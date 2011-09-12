express = require('express')
app = express.createServer()
io = require('socket.io').listen(app)
requirejs = require('requirejs')
_u = require('underscore')._

# Configure socket.io
io.configure 'production', ->
  io.enable 'browser client minification' 
  io.enable 'browser client etag'
  io.set 'log level', 1                 
  io.set 'transports', ['websocket', 'flashsocket']

  console.log "Starting socket.io on production."

# Setup Static Files
app.use express.static(__dirname + '/public')

# Listen
app.listen process.env.PORT || process.env.C9_PORT || 3000

# Load game modules
require('coffee-script')
requirejs.config 
  nodeRequire: require
  baseUrl: __dirname + '/build'
    
# Run Game
requirejs ['reckoning/reckoning', 'minnows/minnows'],
  (Reckoning, Minnows) ->
    game = new Reckoning.Game null,
      sceneType: Minnows.MinnowsScene

    SerializationMap = Reckoning.Serializable.buildMap Reckoning, Minnows

    setInterval( ->
      game.tick()
    , 100)

    player_ids = 0

    io.sockets.on 'connection', (socket) ->
      interval = null
      player_id = player_ids++

      # Client ready
      socket.on 'nick', (data, fn) ->
        Reckoning.Serializable.deserialize data, SerializationMap

        # Add this player to the simulation
        player = data.player
        console.log "#{player_id} joined"

        join = new Minnows.JoinCommand +new Date(), player_id, player
        game.addCommand join

        # We have to let the client know who's around.
        fn( history: game.history, commands: game.commands )

        # Tell everyone that someone joined.
        io.sockets.emit 'join', { time: join.time, nick: data.nick, id: player_id, player: player }

        # Sync game state periodically to prevent drift
        interval = setInterval(() ->
          socket.volatile.emit 'sync', game.state
        , 2000)

      broadcast = (name, data) ->
         socket.broadcast.volatile.emit name, data
      broadcast_t = _u.throttle broadcast, 40

      socket.on 'mouse', (data) ->
        Reckoning.Serializable.deserialize data, SerializationMap

        # console.log 'recieved command at', data.time, 'curr time', +new Date()

        # console.log 'got mouse from', player_id
        mouse = new Minnows.MouseCommand data.time, player_id, data.dest.x, data.dest.y
        game.addCommand mouse

        data.id = player_id
        broadcast_t 'mouse', data

      socket.on 'ping', (data, fn) ->
        fn(+new Date())

      socket.on 'disconnect', () ->
        console.log player_id, 'is leaving'
        # clearInterval(interval)

        leave = new Minnows.LeaveCommand +new Date(), player_id
        game.addCommand leave

        socket.broadcast.emit 'leave', { time: leave.time, id: player_id }
