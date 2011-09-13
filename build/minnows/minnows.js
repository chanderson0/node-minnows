var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var JoinCommand, LeaveCommand, MinnowsScene, MouseCommand, Player, PlayerView, Point, PositionCommand, Reckoning, windowSize;
  Reckoning = require('reckoning/reckoning');
  Point = Reckoning.Point;
  windowSize = {
    height: 384,
    width: 576
  };
  JoinCommand = (function() {
    __extends(JoinCommand, Reckoning.Command);
    JoinCommand.prototype.__type = 'JoinCommand';
    function JoinCommand(time, id, player) {
      this.time = time;
      this.id = id;
      this.player = player;
      JoinCommand.__super__.constructor.call(this, this.time, this.id);
    }
    JoinCommand.prototype.apply = function(state) {
      return state.addObject(this.id, this.player);
    };
    return JoinCommand;
  })();
  LeaveCommand = (function() {
    __extends(LeaveCommand, Reckoning.Command);
    LeaveCommand.prototype.__type = 'LeaveCommand';
    function LeaveCommand(time, id) {
      this.time = time;
      this.id = id;
      LeaveCommand.__super__.constructor.call(this, this.time, this.id);
    }
    LeaveCommand.prototype.apply = function(state) {
      var obj;
      obj = state.getObjectById(this.id);
      if (obj != null) {
        return state.removeObject(this.id);
      }
    };
    return LeaveCommand;
  })();
  MouseCommand = (function() {
    __extends(MouseCommand, Reckoning.Command);
    MouseCommand.prototype.__type = 'MouseCommand';
    function MouseCommand(time, id, destx, desty) {
      this.time = time;
      this.id = id;
      this.destx = destx;
      this.desty = desty;
      MouseCommand.__super__.constructor.call(this, this.time, this.id);
    }
    MouseCommand.prototype.apply = function(state) {
      var obj;
      obj = state.getObjectById(this.id);
      if (obj != null) {
        obj.destx = this.destx;
        return obj.desty = this.desty;
      }
    };
    return MouseCommand;
  })();
  PositionCommand = (function() {
    __extends(PositionCommand, Reckoning.Command);
    PositionCommand.prototype.__type = 'PositionCommand';
    function PositionCommand(time, id, x, y, vx, vy) {
      this.time = time;
      this.id = id;
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      PositionCommand.__super__.constructor.call(this, this.time, this.id);
    }
    PositionCommand.prototype.apply = function(state) {
      var obj;
      obj = state.getObjectById(this.id);
      if (obj != null) {
        obj.setPos(this.x, this.y);
        return obj.setVel(this.vx, this.vy);
      }
    };
    return PositionCommand;
  })();
  MinnowsScene = (function() {
    __extends(MinnowsScene, Reckoning.Scene);
    function MinnowsScene() {
      MinnowsScene.__super__.constructor.apply(this, arguments);
    }
    MinnowsScene.prototype.__type = 'MinnowsScene';
    MinnowsScene.prototype.afterTick = function(dt) {
      var id, id2, object, object2, _ref, _results;
      _ref = this.objects;
      _results = [];
      for (id in _ref) {
        object = _ref[id];
        _results.push((function() {
          var _ref2, _results2;
          _ref2 = this.objects;
          _results2 = [];
          for (id2 in _ref2) {
            object2 = _ref2[id2];
            _results2.push(object.__type === 'Player' && object2.__type === 'Player' && id !== id2 ? object.collide(object2) : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    return MinnowsScene;
  })();
  Player = (function() {
    __extends(Player, Reckoning.GameObject2D);
    Player.prototype.__type = 'Player';
    function Player(x, y, vx, vy, rotation, destx, desty, radius) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (vx == null) {
        vx = 0;
      }
      if (vy == null) {
        vy = 0;
      }
      this.rotation = rotation != null ? rotation : 0;
      this.destx = destx != null ? destx : null;
      this.desty = desty != null ? desty : null;
      this.radius = radius != null ? radius : 25;
      Player.__super__.constructor.call(this, x, y, vx, vy, this.rotation);
      if (!(this.destx != null) || !(this.desty != null)) {
        this.destx = x;
        this.desty = y;
      }
    }
    Player.prototype.clone = function() {
      return new Player(this.x, this.y, this.vx, this.vy, this.rotation, this.destx, this.desty, this.radius);
    };
    Player.prototype.setPos = function(x, y) {
      if (x + this.radius > windowSize.width) {
        x = windowSize.width - this.radius;
      } else if (x - this.radius < 0) {
        x = this.radius;
      }
      if (y + this.radius > windowSize.height) {
        y = windowSize.height - this.radius;
      } else if (y - this.radius < 0) {
        y = this.radius;
      }
      return Player.__super__.setPos.call(this, x, y);
    };
    Player.prototype.approach = function(dt) {
      var dir, dist, to_move;
      if (!(this.destx != null) || !(this.desty != null)) {
        return;
      }
      dir = Point.subtract(this.destx, this.desty, this.x, this.y);
      dist = Point.getLength(dir.x, dir.y);
      to_move = Point.normalize(dir.x, dir.y, Math.sqrt(dist) * dt / 1000.0 * 4);
      if (dist < 0.5) {
        to_move.x = 0;
        to_move.y = 0;
        this.setPos(this.destx, this.desty);
      }
      return this.setVel(to_move.x, to_move.y);
    };
    Player.prototype.tick = function(dt) {
      this.approach(dt);
      return Player.__super__.tick.call(this, dt);
    };
    Player.prototype.collide = function(other) {
      var diff, distance, normal, penetration, separation;
      diff = Point.subtract(other.x, other.y, this.x, this.y);
      distance = Point.getLength(diff.x, diff.y);
      separation = this.radius + other.radius;
      if (distance > separation) {
        return false;
      }
      penetration = separation - distance;
      normal = Point.normalize(diff.x, diff.y, penetration / 2.0);
      this.x -= normal.x;
      this.y -= normal.y;
      other.x += normal.x;
      other.y += normal.y;
      return true;
    };
    return Player;
  })();
  PlayerView = (function() {
    function PlayerView(paper, game, player_id, color, truth, interp) {
      this.paper = paper;
      this.game = game;
      this.player_id = player_id;
      this.color = color != null ? color : 'white';
      this.truth = truth != null ? truth : false;
      this.interp = interp != null ? interp : true;
      console.log("drawing " + this.player_id);
      this.time = this.game.time;
    }
    PlayerView.prototype.tick = function(state) {
      this.prevTime = this.time;
      this.time = state.time;
      return this.draw(state);
    };
    PlayerView.prototype.draw = function(state) {
      var da, delta, dist, dp, player;
      player = state.getObjectById(this.player_id);
      if (player != null) {
        if (!(this.obj != null)) {
          this.create(state);
        }
        delta = Point.subtract(player.x + player.vx, player.y + player.vy, this.x, this.y);
        dist = Point.getLength(delta.x, delta.y);
        if (dist < 0.25 || dist > 50 || this.truth) {
          if (dist > 50) {
            console.log('snap pos');
          }
        } else {
          delta = Point.normalize(delta.x, delta.y, dist * 0.8);
        }
        dp = new this.paper.Point(delta);
        da = dist > 0.25 ? dp.getAngle() - this.rotation : 0;
        if (da < 10 || da > 90 || this.truth) {} else {
          da *= 0.25;
        }
        this.obj.translate(dp);
        this.obj.rotate(da);
        this.x += delta.x;
        this.y += delta.y;
        return this.rotation += da;
      } else {
        return this.remove();
      }
    };
    PlayerView.prototype.create = function(state) {
      var circle, line, player;
      player = state.getObjectById(this.player_id);
      console.log("creating " + this.player_id);
      if (player != null) {
        this.x = player.x;
        this.y = player.y;
        circle = new this.paper.Path.Circle([player.x, player.y], player.radius);
        circle.strokeColor = this.color;
        line = new this.paper.Path.Line([player.x, player.y - player.radius], [player.x, player.y]);
        line.strokeColor = this.color;
        this.obj = new this.paper.Group([circle, line]);
        this.rotation = player.rotation;
        this.obj.rotate(player.rotation + 90);
        return console.log("created");
      }
    };
    PlayerView.prototype.remove = function() {
      if (this.obj != null) {
        this.obj.remove();
        return this.obj = null;
      }
    };
    return PlayerView;
  })();
  return {
    Player: Player,
    PlayerView: PlayerView,
    MinnowsScene: MinnowsScene,
    MouseCommand: MouseCommand,
    JoinCommand: JoinCommand,
    PositionCommand: PositionCommand,
    LeaveCommand: LeaveCommand
  };
});