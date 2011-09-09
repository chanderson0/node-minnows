(function() {
  var app, express, io, requirejs, _u;
  express = require('express');
  app = express.createServer();
  io = require('socket.io').listen(app);
  requirejs = require('requirejs');
  _u = require('underscore');
  io.configure('production', function() {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.set('log level', 1);
    io.set('transports', ['websocket', 'flashsocket']);
    return console.log("Starting socket.io on production.");
  });
  app.use(express.static(__dirname + '/public'));
  app.listen(process.env.PORT || process.env.C9_PORT || 3000);
  require('coffee-script');
  requirejs.config({
    nodeRequire: require
  });
  requirejs(['public/js/app/reckoning/reckoning', 'public/js/app/minnows/minnows'], function(Reckoning, Minnows) {
    var SerializationMap, bless, game, key, obj, player_ids;
    game = new Reckoning.Game;
    bless = Reckoning.Bless;
    SerializationMap = {
      'CircularBuffer': 'CircularBuffer'
    };
    for (key in Reckoning) {
      obj = Reckoning[key];
      SerializationMap[key] = obj;
    }
    for (key in Minnows) {
      obj = Minnows[key];
      SerializationMap[key] = obj;
    }
    setInterval(function() {
      return game.tick();
    }, 100);
    player_ids = 0;
    return io.sockets.on('connection', function(socket) {
      var broadcast, broadcast_t, interval, player_id;
      interval = null;
      player_id = player_ids++;
      socket.on('nick', function(data, fn) {
        var join, player;
        bless.deserialize(data, SerializationMap);
        player = data.player;
        console.log("" + player_id + " joined");
        join = new Minnows.JoinCommand(+new Date(), player_id, player);
        game.addCommand(join);
        fn({
          history: game.history,
          commands: game.commands
        });
        return io.sockets.emit('join', {
          time: join.time,
          nick: data.nick,
          id: player_id,
          player: player
        });
      });
      broadcast = function(name, data) {
        return socket.broadcast.volatile.emit(name, data);
      };
      broadcast_t = _u.throttle(broadcast, 0);
      socket.on('mouse', function(data) {
        var mouse;
        bless.deserialize(data, SerializationMap);
        mouse = new Minnows.MouseCommand(data.time, player_id, data.dest.x, data.dest.y);
        game.addCommand(mouse);
        data.id = player_id;
        return broadcast_t('mouse', data);
      });
      socket.on('ping', function(data, fn) {
        return fn(+new Date());
      });
      return socket.on('disconnect', function() {
        var leave;
        console.log(player_id, 'is leaving');
        leave = new Minnows.LeaveCommand(+new Date(), player_id);
        game.addCommand(leave);
        return socket.broadcast.emit('leave', {
          time: leave.time,
          id: player_id
        });
      });
    });
  });
}).call(this);
