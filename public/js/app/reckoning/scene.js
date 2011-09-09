var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Scene, Serializable;
  Serializable = require('./serializable');
  return Scene = (function() {
    __extends(Scene, Serializable);
    Scene.prototype.__type = 'Scene';
    function Scene(objects) {
      var id, object;
      Scene.__super__.constructor.apply(this, arguments);
      this.objects = {};
      for (id in objects) {
        object = objects[id];
        this.objects[id] = object.clone();
      }
    }
    Scene.prototype.clone = function() {
      return new Scene(this.objects);
    };
    Scene.prototype.tick = function(dt) {
      var id, object, _ref;
      _ref = this.objects;
      for (id in _ref) {
        object = _ref[id];
        object.tick(dt);
      }
      return this.consistency(dt);
    };
    Scene.prototype.interpolate = function(prevScene, alpha) {
      var id, object, prev, res, _ref;
      res = new Scene();
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
    Scene.prototype.consistency = function(dt) {};
    return Scene;
  })();
});