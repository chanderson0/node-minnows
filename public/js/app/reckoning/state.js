var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Scene, Serializable, State;
  Scene = require('./scene');
  Serializable = require('./serializable');
  return State = (function() {
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
      return new State(time, this.scene);
    };
    State.prototype.interpolate = function(prevState, alpha) {
      var prevScene, res;
      res = this.clone();
      prevScene = prevState.scene;
      res.scene = this.scene.interpolate(prevScene, alpha);
      return res;
    };
    State.prototype.getObjectById = function(id) {
      return this.scene.objects[id];
    };
    return State;
  })();
});