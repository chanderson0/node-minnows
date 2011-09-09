var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var GameObject, Serializable;
  Serializable = require('./serializable');
  return GameObject = (function() {
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
});