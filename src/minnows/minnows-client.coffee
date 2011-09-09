define (require) ->
  Reckoning = require('reckoning/reckoning')
  Minnows = require('minnows/minnows')
  CircularBuffer = require('reckoning/util/circular_buffer')
  util = require('reckoning/util/util')
  paper = require('paper')
  bless = require('reckoning/util/bless')

  # How to inflate stuff
  SerializationMap = {
    'CircularBuffer': CircularBuffer,
  }
  for key, obj of Reckoning
    SerializationMap[key] = obj
  for key, obj of Minnows
    SerializationMap[key] = obj

  console.log SerializationMap

  # GAME SETUP
  nick = util.uuid()
  id = null
  game = null
  serverOffset = new CircularBuffer 5
  serverTime = ->
    i = serverOffset.firstIndex()
    sum = 0
    count = 0
    while i < serverOffset.length
      sum += serverOffset.get(i)
      count++
      i++
    delta = if count > 0 then sum / count else 0
    return +new Date() + delta

  pingArr = new CircularBuffer 5
  ping = ->
    i = pingArr.firstIndex()
    sum = 0
    count = 0
    while i < pingArr.length
      sum += pingArr.get(i)
      count++
      i++
    return if count > 0 then sum / count else 0

  view = []

  # DRAWING STUFF
  paper.setup 'game-canvas'
  atool = new paper.Tool()
  rttText = new paper.PointText(new paper.Point(10, 17))
  rttText.justification = 'left'
  rttText.fillColor = 'white'
  rttText.content = new String(ping())

  mouseTimeout = null
  sendmove = (pos) ->
    socket.emit 'mouse', { time: serverTime(), dest: { x: pos.x, y: pos.y } }
  sendmove_t = _.throttle sendmove, 40

  domove = (pos) ->
    move = new Minnows.MouseCommand serverTime(), id, pos.x, pos.y
    game.addCommand move

    clearTimeout(mouseTimeout)
    setTimeout(->
      sendmove(pos)
    , 25)

    sendmove_t(pos)

  setup = (history, commands) ->
    game = new Reckoning.Game serverTime()

    game.history = history
    game.commands = commands

    game.frame = game.history.length-1
    game.state = game.history.get(game.frame)

    for player_id, player of game.state.scene.objects
      # view.push new Minnows.PlayerView paper, game, player_id, 'red', true
      view.push new Minnows.PlayerView paper, game, player_id

    atool.onMouseMove = (e) ->
      domove(e.point) if id?

    draw = (state) ->
      i = 0
      while i < view.length
        view[i].tick(state)
        i++

    paper.view.onFrame = (e) ->
      game.tick serverTime(), draw
      rttText.content = Math.round(game.time) + ' ' + game.frame + ' ' + Math.round(ping()*100)/100

  processTime = (earlier, ts) ->
    newerNow = +new Date()

    rtt = newerNow - earlier
    thisPing = rtt / 2.0

    delta = newerNow - ts + thisPing
    serverOffset.push delta

  # SOCKET STUFF
  socket = io.connect()
  socket.on 'connect', () ->
    console.log('connected')

    me = new Minnows.Player 100, 100, 0, 0
    socket.emit 'nick', { 'nick': nick, 'player': me }, (data) ->
      console.log 'joined'
      bless.deserialize data, SerializationMap
      setup(data.history, data.commands)
  
  socket.on 'sync', (state) ->
    bless.deserialize state, SerializationMap

    i = game.history.firstIndex()
    while i < game.history.length
      old = game.history.get(i)
      console.log i if not old?

      if not old? or old.time < state.time
        i++
      else 
        break

    console.log 'sync from', state.time, 'at', game.state.time

    game.history.set i, state
    game.replay i, serverTime()

  socket.on 'join', (data) ->
    bless.deserialize data, SerializationMap

    console.log('join', data)
    
    if data.nick == nick
      ready = true
      id = data.id
    
    player = data.player
    # view.push new Minnows.PlayerView paper, game, data.id, 'red', true
    view.push new Minnows.PlayerView paper, game, data.id

    join = new Minnows.JoinCommand data.time, data.id, player
    game.addCommand join

  socket.on 'mouse', (data) ->
    bless.deserialize data, SerializationMap

    return if data.id == id
     
    dest = data.dest
    move = new Minnows.MouseCommand data.time, data.id, dest.x, dest.y
    game.addCommand move

  socket.on 'leave', (data) ->
    bless.deserialize data, SerializationMap
    console.log('leave', data)
    
    # Delete anyone no longer visible
    view = _.reject view, (obj) ->
      if obj.player_id == data.id
        obj.remove()
        return true
      else 
        return false
    
    leave = new Minnows.LeaveCommand data.time, data.id
    game.addCommand leave

  setInterval(() ->
    now = +new Date()
    socket.emit 'ping', now, (ts) ->
      processTime now, ts
  , 1000)
