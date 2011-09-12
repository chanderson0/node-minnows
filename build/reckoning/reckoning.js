var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var CircularBuffer, Command, Game, GameObject, GameObject2D, Point, Scene, Serializable, State, Util, _;
  _ = require('underscore')._;
  Util = require('./util/util');
  Point = require('./util/point');
  CircularBuffer = require('./util/circular_buffer');
  Serializable = require('./serializable');
  GameObject = (function() {
    __extends(GameObject, Serializable);
    GameObject.prototype.__type = 'GameObject';
    function GameObject() {
      GameObject.__super__.constructor.apply(this, arguments);
    }
    GameObject.prototype.clone = function() {
      return new GameObject();
    };
    GameObject.prototype.tick = function(dt) {};
    GameObject.prototype.interpolate = function(prev, alpha) {
      return this.clone();
    };
    GameObject.prototype.leave = function() {};
    return GameObject;
  })();
  GameObject2D = (function() {
    __extends(GameObject2D, GameObject);
    GameObject2D.prototype.__type = 'Player2D';
    function GameObject2D(x, y, vx, vy, rotation) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.vx = vx != null ? vx : 0;
      this.vy = vy != null ? vy : 0;
      this.rotation = rotation != null ? rotation : 0;
      GameObject2D.__super__.constructor.call(this, this.state);
    }
    GameObject2D.prototype.clone = function() {
      return new GameObject2D(this.x, this.y, this.vx, this.vy, this.rotation);
    };
    GameObject2D.prototype.setPos = function(x, y) {
      this.x = x;
      return this.y = y;
    };
    GameObject2D.prototype.setVel = function(vx, vy) {
      this.vx = vx;
      this.vy = vy;
      if (this.vx !== 0 || this.vy !== 0) {
        return this.rotation = Point.getAngleDeg(this.vx, this.vy);
      }
    };
    GameObject2D.prototype.interpolate = function(prev, alpha) {
      return new this.constructor((prev.x + this.x) / 2.0, (prev.y + this.y) / 2.0, (prev.vx + this.vx) / 2.0, (prev.vy + this.vy) / 2.0, (prev.rotation + this.rotation) / 2.0);
    };
    GameObject2D.prototype.tick = function(dt) {
      var newPos;
      newPos = Point.add(this.x, this.y, this.vx * dt, this.vy * dt);
      return this.setPos(newPos.x, newPos.y);
    };
    return GameObject2D;
  })();
  State = (function() {
    __extends(State, Serializable);
    State.prototype.__type = 'State';
    function State(time, scene) {
      this.time = time;
      State.__super__.constructor.apply(this, arguments);
      this.scene = scene.clone();
    }
    State.prototype.clone = function(time) {
      if (time == null) {
        time = this.time;
      }
      return new this.constructor(time, this.scene);
    };
    State.prototype.tick = function(dt) {
      this.beforeTick();
      this.scene.tick(dt);
      return this.afterTick();
    };
    State.prototype.interpolate = function(prevState, alpha) {
      var prevScene, res;
      res = this.clone();
      prevScene = prevState.scene;
      res.scene = this.scene.interpolate(prevScene, alpha);
      return res;
    };
    State.prototype.getObjectById = function(id) {
      return this.scene.getObjectById(id);
    };
    State.prototype.addObject = function(id, obj) {
      return this.scene.addObject(id, obj);
    };
    State.prototype.removeObject = function(id) {
      return this.scene.removeObject(id);
    };
    State.prototype.beforeTick = function() {};
    State.prototype.afterTick = function() {};
    return State;
  })();
  Scene = (function() {
    __extends(Scene, Serializable);
    Scene.prototype.__type = 'Scene';
    function Scene(objects) {
      var id, object;
      if (objects == null) {
        objects = {};
      }
      Scene.__super__.constructor.apply(this, arguments);
      this.objects = {};
      for (id in objects) {
        object = objects[id];
        this.objects[id] = object.clone(this.state);
      }
    }
    Scene.prototype.clone = function() {
      return new this.constructor(this.objects);
    };
    Scene.prototype.tick = function(dt) {
      var id, object, _ref;
      this.beforeTick();
      _ref = this.objects;
      for (id in _ref) {
        object = _ref[id];
        object.tick(dt);
      }
      return this.afterTick();
    };
    Scene.prototype.interpolate = function(prevScene, alpha) {
      var id, object, prev, res, _ref;
      res = new this.constructor();
      _ref = this.objects;
      for (id in _ref) {
        object = _ref[id];
        prev = prevScene.objects[id];
        if (prev != null) {
          res.objects[id] = object.interpolate(prev, alpha);
        }
      }
      return res;
    };
    Scene.prototype.beforeTick = function() {};
    Scene.prototype.afterTick = function() {};
    Scene.prototype.getObjectById = function(id) {
      return this.objects[id];
    };
    Scene.prototype.addObject = function(id, obj) {
      return this.objects[id] = obj;
    };
    Scene.prototype.removeObject = function(id) {
      this.objects[id].leave();
      return delete this.objects[id];
    };
    return Scene;
  })();
  Command = (function() {
    __extends(Command, Serializable);
    Command.prototype.__type = 'Command';
    function Command(time, id) {
      this.time = time;
      this.id = id;
      Command.__super__.constructor.apply(this, arguments);
    }
    Command.prototype.apply = function(state) {};
    return Command;
  })();
  Game = (function() {
    var defaults;
    __extends(Game, Serializable);
    Game.prototype.__type = 'Game';
    defaults = {
      historySize: 100,
      timeStep: 1000 / 60.0,
      renderBehind: 8,
      stateType: State,
      sceneType: Scene
    };
    function Game(time, options) {
      if (time == null) {
        time = null;
      }
      if (options == null) {
        options = {};
      }
      Game.__super__.constructor.apply(this, arguments);
      options = _.extend(defaults, options);
      this.time = time != null ? time : +new Date();
      this.accumulator = 0;
      this.frame = 0;
      this.state = new options.stateType(this.time, new options.sceneType());
      this.replayNeeded = false;
      this.history = new CircularBuffer(options.historySize);
      this.commands = new CircularBuffer(options.historySize);
      this.timeStep = options.timeStep;
      this.renderBehind = options.renderBehind;
    }
    Game.prototype.replay = function(fromFrame, stopFrame) {
      var frame, newState, state, t;
      frame = fromFrame;
      state = this.history.get(frame);
      t = state.time;
      while (frame <= stopFrame) {
        newState = state.clone(t);
        this.applyCommands(frame, newState);
        this.history.set(frame, newState);
        state = newState;
        frame += 1;
        t += this.timeStep;
      }
      this.state = state;
      return this.frame = stopFrame;
    };
    Game.prototype.tick = function(now, draw) {
      var diff, newState;
      if (now == null) {
        now = null;
      }
      if (draw == null) {
        draw = null;
      }
      if (this.replayNeeded) {
        this.replay(this.replayNeeded, this.frame);
        this.replayNeeded = false;
      }
      now = now != null ? now : +new Date();
      diff = now - this.time;
      this.time = now;
      this.accumulator += diff;
      while (this.accumulator >= this.timeStep) {
        this.frame += 1;
        newState = this.state.clone(this.time);
        this.applyCommands(this.frame, newState);
        this.history.set(this.frame, this.state);
        this.state = newState;
        this.accumulator -= this.timeStep;
      }
      if (draw != null) {
        return draw(this.history.get(this.frame - this.renderBehind));
      }
    };
    Game.prototype.interpolate = function() {
      var alpha, prev;
      alpha = this.accumulator / this.timeStep;
      prev = this.history.get(this.frame - 1);
      return this.state.interpolate(prev, alpha);
    };
    Game.prototype.predict = function(state, prevState) {};
    Game.prototype.applyCommands = function(frame, state) {
      var command, commands, i;
      commands = this.commands.getDefault(frame, []);
      i = 0;
      while (i < commands.length) {
        command = commands[i];
        command.apply(state);
        i++;
      }
      return state.tick(this.timeStep);
    };
    Game.prototype.findFrame = function(time) {
      var firstIndex, frame, historical;
      firstIndex = this.history.firstIndex();
      historical = null;
      frame = this.frame;
      while (frame >= firstIndex) {
        historical = this.history.get(frame);
        if (!(historical != null)) {
          console.log(frame, 'is missing');
          frame--;
          continue;
        }
        if (historical.time < time) {
          break;
        }
        frame--;
      }
      return frame;
    };
    Game.prototype.addCommand = function(command) {
      var frame, historical;
      if (command.time < this.time) {
        frame = this.findFrame(command.time);
        historical = this.history.get(frame);
        if (!(historical != null)) {
          return;
        }
        if (historical.time > command.time) {} else {
          this.commands.pushOrCreate(frame, command);
          if (this.replayNeeded) {
            return this.replayNeeded = Math.min(this.replayNeeded, frame);
          } else {
            return this.replayNeeded = frame;
          }
        }
      } else {
        return this.commands.pushOrCreate(this.frame + 1, command);
      }
    };
    Game.prototype.getObjectById = function(id) {
      return this.state.getObjectById(id);
    };
    return Game;
  })();
  return {
    Serializable: Serializable,
    GameObject: GameObject,
    GameObject2D: GameObject2D,
    State: State,
    Scene: Scene,
    Command: Command,
    Game: Game,
    CircularBuffer: CircularBuffer,
    Serializable: Serializable,
    Point: Point,
    Util: Util
  };
});