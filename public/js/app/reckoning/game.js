var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var CircularBuffer, Command, Game, GameObject, Scene, Serializable, State;
  Command = require('./command');
  GameObject = require('./game_object');
  Scene = require('./scene');
  State = require('./state');
  CircularBuffer = require('./util/circular_buffer');
  Serializable = require('./serializable');
  return Game = (function() {
    __extends(Game, Serializable);
    Game.prototype.__type = 'Game';
    function Game(time) {
      if (time == null) {
        time = null;
      }
      Game.__super__.constructor.apply(this, arguments);
      if (!(time != null)) {
        this.time = +new Date();
      } else {
        this.time = time;
      }
      this.accumulator = 0;
      this.frame = 0;
      this.state = new State(this.time, new Scene({}));
      this.history = new CircularBuffer(100);
      this.commands = new CircularBuffer(100);
      this.timeStep = 1000 / 60.0;
      this.replayNeeded = false;
    }
    Game.prototype.replay = function(stateIdx, stopTime) {
      var frame, newState, state, t;
      state = this.history.get(stateIdx);
      frame = stateIdx;
      t = state.time;
      while (t < stopTime) {
        newState = state.clone(t);
        this.history.set(frame, state);
        this.applyCommands(frame, newState);
        state = newState;
        frame += 1;
        t += this.timeStep;
      }
      this.state = state;
      return this.frame = frame;
    };
    Game.prototype.tick = function(now, draw) {
      var diff, interpState, newState;
      if (now == null) {
        now = null;
      }
      if (draw == null) {
        draw = null;
      }
      if (this.replayNeeded) {
        this.replay(this.replayNeeded, this.time);
        this.replayNeeded = false;
      }
      if (!(now != null)) {
        now = +new Date();
      }
      diff = now - this.time;
      this.time = now;
      this.accumulator += diff;
      while (this.accumulator > this.timeStep) {
        newState = this.state.clone(this.time);
        this.applyCommands(this.frame, newState);
        this.history.set(this.frame, this.state);
        this.frame += 1;
        this.state = newState;
        this.accumulator -= this.timeStep;
      }
      if (draw != null) {
        interpState = this.interpolate();
        return draw(interpState);
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
        command.apply(state.scene);
        i++;
      }
      return state.scene.tick(this.timeStep);
    };
    Game.prototype.addCommand = function(command) {
      return this.commands.pushOrCreate(this.frame + 1, command);
    };
    Game.prototype.getObjectById = function(id, frame) {
      if (frame == null) {
        frame = this.frame;
      }
      return this.state.scene.objects[id];
    };
    return Game;
  })();
});