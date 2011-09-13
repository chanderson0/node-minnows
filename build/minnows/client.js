define(function(require) {
  var Minnows, Reckoning, SerializationMap, atool, determineTime, dolog, dolog_t, domove, game, id, mouseTimeout, nick, ping, processTime, rttText, sendmove, sendmove_t, serverDelta, serverOffset, serverTime, setup, socket, view, _u;
  Reckoning = require('reckoning/reckoning');
  Minnows = require('minnows/minnows');
  _u = require('underscore')._;
  require('paper');
  SerializationMap = Reckoning.Serializable.buildMap(Reckoning, Minnows);
  nick = Reckoning.Util.uuid();
  id = null;
  game = null;
  ping = 0;
  serverOffset = new Reckoning.CircularBuffer(50);
  serverDelta = function() {
    var count, i, sum;
    i = serverOffset.firstIndex();
    sum = 0;
    count = 0;
    while (i < serverOffset.length) {
      sum += serverOffset.get(i);
      count++;
      i++;
    }
    if (count > 0) {
      return sum / count;
    } else {
      return 0;
    }
  };
  serverTime = function() {
    return +new Date() + serverDelta();
  };
  view = [];
  paper.setup('game-canvas');
  atool = new paper.Tool();
  rttText = new paper.PointText(new paper.Point(10, 17));
  rttText.justification = 'left';
  rttText.fillColor = 'white';
  rttText.content = ping;
  mouseTimeout = null;
  sendmove = function(pos) {
    return socket.emit('mouse', {
      time: serverTime(),
      dest: {
        x: pos.x,
        y: pos.y
      }
    });
  };
  sendmove_t = _u.throttle(sendmove, 5);
  domove = function(pos) {
    var move;
    move = new Minnows.MouseCommand(serverTime(), id, pos.x, pos.y);
    game.addCommand(move);
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(function() {
      return sendmove(pos);
    }, 25);
    return sendmove_t(pos);
  };
  setup = function(history, commands) {
    var draw, object, object_id, _ref;
    game = new Reckoning.Game(serverTime(), {
      sceneType: Minnows.MinnowsScene,
      renderBehind: 5
    });
    game.history = history;
    game.commands = commands;
    game.frame = game.history.length - 1;
    game.state = game.history.get(game.frame);
    _ref = game.state.scene.objects;
    for (object_id in _ref) {
      object = _ref[object_id];
      if (object.__type === 'Player') {
        if (false) {
          view.push(new Minnows.PlayerView(paper, game, player_id, 'red', true));
        }
        view.push(new Minnows.PlayerView(paper, game, object_id));
      }
    }
    atool.onMouseMove = function(e) {
      if (id != null) {
        return domove(e.point);
      }
    };
    draw = function(state) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < view.length) {
        view[i].tick(state);
        _results.push(i++);
      }
      return _results;
    };
    return paper.view.onFrame = function(e) {
      game.tick(serverTime(), draw);
      return rttText.content = Math.round(game.time) + ' ' + game.frame + ' ' + Math.round(ping * 100) / 100 + ' ' + Math.round(serverDelta() * 100) / 100;
    };
  };
  processTime = function(earlier, server) {
    var delta, now, rtt;
    now = +new Date();
    rtt = now - earlier;
    ping = rtt / 2.0;
    delta = server - earlier - ping;
    return serverOffset.push(delta);
  };
  determineTime = function() {
    var now;
    now = +new Date();
    return socket.emit('ping', now, function(ts) {
      return processTime(now, ts);
    });
  };
  socket = io.connect();
  socket.on('connect', function() {
    var me;
    console.log('connected');
    determineTime();
    setInterval(determineTime, 1000);
    me = new Minnows.Player(100, 100, 0, 0);
    return socket.emit('nick', {
      'nick': nick,
      'player': me
    }, function(data) {
      console.log('joined');
      Reckoning.Serializable.deserialize(data, SerializationMap);
      return setup(data.history, data.commands);
    });
  });
  socket.on('sync', function(state) {
    var frame;
    Reckoning.Serializable.deserialize(state, SerializationMap);
    frame = game.findFrame(state.time);
    console.log('sync from', state.time, 'at', game.state.time, 'in', frame, 'of', game.frame);
    game.history.set(frame, state);
    return game.replay(frame, game.frame);
  });
  socket.on('join', function(data) {
    var color, join, player, ready;
    Reckoning.Serializable.deserialize(data, SerializationMap);
    console.log('join', data);
    if (data.nick === nick) {
      ready = true;
      id = data.id;
      color = 'red';
    } else {
      color = 'white';
    }
    player = data.player;
    view.push(new Minnows.PlayerView(paper, game, data.id, color));
    join = new Minnows.JoinCommand(data.time, data.id, player);
    return game.addCommand(join);
  });
  dolog = function(msg) {
    return console.log(msg);
  };
  dolog_t = _u.throttle(dolog, 100);
  socket.on('mouse', function(data) {
    var dest, move;
    Reckoning.Serializable.deserialize(data, SerializationMap);
    if (data.id === id) {
      return;
    }
    dest = data.dest;
    move = new Minnows.MouseCommand(data.time, data.id, dest.x, dest.y);
    return game.addCommand(move);
  });
  return socket.on('leave', function(data) {
    var leave;
    Reckoning.Serializable.deserialize(data, SerializationMap);
    console.log('leave', data);
    view = _.reject(view, function(obj) {
      if (obj.player_id === data.id) {
        obj.remove();
        return true;
      } else {
        return false;
      }
    });
    leave = new Minnows.LeaveCommand(data.time, data.id);
    return game.addCommand(leave);
  });
});