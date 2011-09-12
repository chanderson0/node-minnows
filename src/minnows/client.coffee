define (require) ->
  Reckoning = require('reckoning/reckoning')
  Minnows = require('minnows/minnows')
  # paper = require('paper')
  _u = require('underscore')._
  require('paper')

  # How to inflate stuff
  SerializationMap = Reckoning.Serializable.buildMap Reckoning, Minnows
  # console.log SerializationMap

  # GAME SETUP
  nick = Reckoning.Util.uuid()
  id = null
  game = null
  ping = 0
  serverOffset = new Reckoning.CircularBuffer 5
  serverDelta = ->
    i = serverOffset.firstIndex()
    sum = 0
    count = 0
    while i < serverOffset.length
      sum += serverOffset.get(i)
      count++
      i++
    return if count > 0 then sum / count else 0
  serverTime = ->
    return +new Date() + serverDelta()

  view = []

  # DRAWING STUFF
  paper.setup 'game-canvas'
  atool = new paper.Tool()
  rttText = new paper.PointText(new paper.Point(10, 17))
  rttText.justification = 'left'
  rttText.fillColor = 'white'
  rttText.content = ping

  mouseTimeout = null
  sendmove = (pos) ->
    socket.emit 'mouse', { time: serverTime(), dest: { x: pos.x, y: pos.y } }
  sendmove_t = _u.throttle sendmove, 1

  domove = (pos) ->
    move = new Minnows.MouseCommand serverTime(), id, pos.x, pos.y
    game.addCommand move

    clearTimeout(mouseTimeout)
    setTimeout(->
      sendmove(pos)
    , 25)

    sendmove_t(pos)

  setup = (history, commands) ->
    game = new Reckoning.Game serverTime(),
      sceneType: Minnows.MinnowsScene
      renderBehind: 2

    game.history = history
    game.commands = commands

    game.frame = game.history.length-1
    game.state = game.history.get(game.frame)

    for object_id, object of game.state.scene.objects
      if object.__type == 'Player'
        if false
          view.push new Minnows.PlayerView paper, game, player_id, 'red', true
        view.push new Minnows.PlayerView paper, game, object_id

    atool.onMouseMove = (e) ->
      domove e.point if id?

    draw = (state) ->
      i = 0
      while i < view.length
        view[i].tick(state)
        i++

    paper.view.onFrame = (e) ->
      game.tick serverTime(), draw
      rttText.content = Math.round(game.time) + ' ' + game.frame + ' ' + Math.round(ping*100)/100 + ' ' + Math.round(serverDelta()*100)/100

  processTime = (earlier, server) ->
    now = +new Date()

    rtt = now - earlier
    ping = rtt / 2.0
    delta = server - earlier - ping

    console.log now, earlier, server, ping, delta
    serverOffset.push delta

  determineTime = ->
    now = +new Date()
    socket.emit 'ping', now, (ts) ->
      processTime now, ts

  # SOCKET STUFF
  socket = io.connect()
  socket.on 'connect', () ->
    console.log('connected')

    determineTime()
    setInterval(determineTime, 1000)

    me = new Minnows.Player 100, 100, 0, 0
    socket.emit 'nick', { 'nick': nick, 'player': me }, (data) ->
      console.log 'joined'
      Reckoning.Serializable.deserialize data, SerializationMap
      setup(data.history, data.commands)
  
  socket.on 'sync', (state) ->
    Reckoning.Serializable.deserialize state, SerializationMap

    frame = game.findFrame state.time

    console.log 'sync from', state.time, 'at', game.state.time, 'in', frame, 'of', game.frame

    game.history.set frame, state
    game.replay frame, game.frame

  socket.on 'join', (data) ->
    Reckoning.Serializable.deserialize data, SerializationMap

    console.log('join', data)
    
    if data.nick == nick
      ready = true
      id = data.id
      color = 'red'
    else
      color = 'white'
    
    player = data.player
    # view.push new Minnows.PlayerView paper, game, data.id, 'blue', true
    view.push new Minnows.PlayerView paper, game, data.id, color

    join = new Minnows.JoinCommand data.time, data.id, player
    game.addCommand join

  dolog = (msg) ->
    console.log msg
  dolog_t = _u.throttle dolog, 100

  socket.on 'mouse', (data) ->
    Reckoning.Serializable.deserialize data, SerializationMap

    # dolog_t "mouse from #{data.id}"
    return if data.id == id
     
    dest = data.dest
    move = new Minnows.MouseCommand data.time, data.id, dest.x, dest.y
    game.addCommand move

  socket.on 'leave', (data) ->
    Reckoning.Serializable.deserialize data, SerializationMap
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