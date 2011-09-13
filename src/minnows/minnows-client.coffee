define (require) ->
  Reckoning = require('reckoning/reckoning')
  Minnows = require('minnows/minnows')
  _u = require('underscore')._

  SerializationMap = Reckoning.Serializable.buildMap Reckoning, Minnows

  class Client
    constructor: ->
      @setup()
      
    setup: ->
      @nick = Reckoning.Util.udid()
      @id = null

      @game = null
      @visible = []

      @ping = null
      @serverOffset = new Reckoning.CircularBuffer 5

      @setupSocket()

    setupSocket: ->
      @socket = io.connect()

      @socket.on 'connect', () ->
        # console.log('connected')
        @syncTime()
        setInterval(@syncTime, 1000)

        @onConnect()
        me = new Minnows.Player 100, 100, 0, 0
        socket.emit 'nick', { 'nick': nick, 'player': me }, (data) ->
          console.log 'joined'
          Reckoning.Serializable.deserialize data, SerializationMap
          setup(data.history, data.commands)
  
      @socket.on 'sync', (state) ->
        Reckoning.Serializable.deserialize state, SerializationMap

        frame = @game.findFrame state.time
        @game.history.set frame, state
        @game.replay frame, @game.frame

        # console.log 'sync from', state.time, 'at', game.state.time, 'in', frame, 'of', game.frame

      @socket.on 'join', (data) ->
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

    serverDelta: ->
      i = @serverOffset.firstIndex()
      sum = 0
      count = 0
      while i < @serverOffset.length
        sum += @serverOffset.get(i)
        count++
        i++
      return if count > 0 then sum / count else 0
    
    serverTime: ->
      +new Date() + @serverDelta()

    setupDrawing: ->
      # Override me

    sendMessageThrottle: (name, data) ->
      # TODO

    sendMessage: (name, data, throttle = false) ->
      if throttle
        @sendMessageThrottle name, data
      else
        @socket.emit name, data

    onFrame: ->
      @game.tick serverTime(), @draw

    draw: (state) ->
      view.tick(state) for view in @visible

  setup = (history, commands) ->
    game = new Reckoning.Game serverTime(),
      sceneType: Minnows.MinnowsScene
      renderBehind: 5

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

