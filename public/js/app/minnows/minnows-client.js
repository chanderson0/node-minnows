define(function(require) {
  var CircularBuffer, Minnows, Reckoning, SerializationMap, atool, bless, domove, game, id, key, mouseTimeout, nick, obj, paper, ping, pingArr, processTime, rttText, sendmove, sendmove_t, serverOffset, serverTime, setup, socket, util, view;
  Reckoning = require('reckoning/reckoning');
  Minnows = require('minnows/minnows');
  CircularBuffer = require('reckoning/util/circular_buffer');
  util = require('reckoning/util/util');
  paper = require('paper');
  bless = require('reckoning/util/bless');
  SerializationMap = {
    'CircularBuffer': CircularBuffer
  };
  for (key in Reckoning) {
    obj = Reckoning[key];
    SerializationMap[key] = obj;
  }
  for (key in Minnows) {
    obj = Minnows[key];
    SerializationMap[key] = obj;
  }
  console.log(SerializationMap);
  nick = util.uuid();
  id = null;
  game = null;
  serverOffset = 0;
  serverTime = function() {
    return +new Date() + serverOffset;
  };
  pingArr = new CircularBuffer(5);
  ping = function() {
    var count, i, sum;
    i = pingArr.firstIndex();
    sum = 0;
    count = 0;
    while (i < pingArr.length) {
      sum += pingArr.get(i);
      count++;
      i++;
    }
    if (count > 0) {
      return sum / count;
    } else {
      return 0;
    }
  };
  view = [];
  paper.setup('game-canvas');
  atool = new paper.Tool();
  rttText = new paper.PointText(new paper.Point(10, 17));
  rttText.justification = 'left';
  rttText.fillColor = 'white';
  rttText.content = new String(ping());
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
  sendmove_t = _.throttle(sendmove, 40);
  domove = function(pos) {
    var move;
    move = new Minnows.MouseCommand(serverTime(), id, pos.x, pos.y);
    game.addCommand(move);
    clearTimeout(mouseTimeout);
    setTimeout(function() {
      return sendmove(pos);
    }, 25);
    return sendmove_t(pos);
  };
  setup = function(history, commands) {
    var draw, player, player_id, _ref;
    game = new Reckoning.Game(serverTime());
    game.history = history;
    game.commands = commands;
    game.frame = game.history.length - 1;
    game.state = game.history.get(game.frame);
    _ref = game.state.scene.objects;
    for (player_id in _ref) {
      player = _ref[player_id];
      view.push(new Minnows.PlayerView(paper, game, player_id));
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
      return rttText.content = Math.round(game.time) + ' ' + game.frame + ' ' + Math.round(ping() * 100) / 100;
    };
  };
  processTime = function(earlier, ts) {
    var estimate, newerNow, rtt, thisPing;
    newerNow = +new Date();
    rtt = newerNow - earlier;
    thisPing = rtt / 2.0;
    pingArr.push(thisPing);
    estimate = ts - ping();
    return serverOffset = Math.max(newerNow - estimate, 0);
  };
  socket = io.connect();
  socket.on('connect', function() {
    var me;
    console.log('connected');
    me = new Minnows.Player(100, 100, 0, 0);
    return socket.emit('nick', {
      'nick': nick,
      'player': me
    }, function(data) {
      console.log('joined');
      bless.deserialize(data, SerializationMap);
      return setup(data.history, data.commands);
    });
  });
  socket.on('sync', function(state) {
    var i, old;
    bless.deserialize(state, SerializationMap);
    i = game.history.firstIndex();
    while (i < game.history.length) {
      old = game.history.get(i);
      if (!(old != null)) {
        console.log(i);
      }
      if (!(old != null) || old.time < state.time) {
        i++;
      } else {
        break;
      }
    }
    console.log('sync from', state.time, 'at', game.state.time);
    game.history.set(i, state);
    return game.replay(i, serverTime());
  });
  socket.on('join', function(data) {
    var join, player, ready;
    bless.deserialize(data, SerializationMap);
    console.log('join', data);
    if (data.nick === nick) {
      ready = true;
      id = data.id;
    }
    player = data.player;
    view.push(new Minnows.PlayerView(paper, game, data.id));
    join = new Minnows.JoinCommand(data.time, data.id, player);
    return game.addCommand(join);
  });
  socket.on('mouse', function(data) {
    var dest, move;
    bless.deserialize(data, SerializationMap);
    if (data.id === id) {
      return;
    }
    dest = data.dest;
    move = new Minnows.MouseCommand(data.time, data.id, dest.x, dest.y);
    return game.addCommand(move);
  });
  socket.on('leave', function(data) {
    var leave;
    bless.deserialize(data, SerializationMap);
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
  return setInterval(function() {
    var now;
    now = +new Date();
    return socket.emit('ping', now, function(ts) {
      return processTime(now, ts);
    });
  }, 1000);
});