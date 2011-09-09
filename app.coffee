express = require('express')
app = express.createServer()
io = require('socket.io').listen(app)
# redis = require('redis')
# client = redis.createClient()
requirejs = require('requirejs')
_u = require('underscore')

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
    
# Run Game
requirejs ['public/js/app/reckoning/reckoning', 'public/js/app/minnows/minnows'],
  (Reckoning, Minnows) ->
    game = new Reckoning.Game
    bless = Reckoning.Bless

    SerializationMap = {
    'CircularBuffer': 'CircularBuffer',
    }
    for key, obj of Reckoning
      SerializationMap[key] = obj
    for key, obj of Minnows
      SerializationMap[key] = obj

    setInterval(()->
      game.tick()
    , 100)

    # Initial values for redis
    # client.set 'players',   '0'
    # client.set 'player_id', '0'
    player_ids = 0

    io.sockets.on 'connection', (socket) ->
      interval = null

      # Setup
      # client.incr 'players'
      # player_id = null
      # client.incr 'player_id', (err, id) ->
      #   player_id = id
      player_id = player_ids++

      # Client ready
      socket.on 'nick', (data, fn) ->
        bless.deserialize data, SerializationMap

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
        # interval = setInterval(() ->
        #   socket.volatile.emit 'sync', game.state
        # , 200)

      broadcast = (name, data) ->
         socket.broadcast.volatile.emit name, data
      broadcast_t = _u.throttle broadcast, 0

      socket.on 'mouse', (data) ->
        bless.deserialize data, SerializationMap

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
