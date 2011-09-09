var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var GameObject, Player2D, Point;
  GameObject = require('./game_object');
  Point = require('./util/point');
  return Player2D = (function() {
    __extends(Player2D, GameObject);
    Player2D.prototype.__type = 'Player2D';
    function Player2D(x, y, vx, vy, rotation) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.vx = vx != null ? vx : 0;
      this.vy = vy != null ? vy : 0;
      this.rotation = rotation != null ? rotation : 0;
      Player2D.__super__.constructor.apply(this, arguments);
    }
    Player2D.prototype.clone = function() {
      return new Player2D(this.x, this.y, this.vx, this.vy, this.rotation);
    };
    Player2D.prototype.setPos = function(x, y) {
      this.x = x;
      return this.y = y;
    };
    Player2D.prototype.setVel = function(vx, vy) {
      this.vx = vx;
      this.vy = vy;
      if (this.vx !== 0 || this.vy !== 0) {
        return this.rotation = Point.getAngleDeg(this.vx, this.vy);
      }
    };
    Player2D.prototype.interpolate = function(prev, alpha) {
      return new this.constructor((prev.x + this.x) / 2.0, (prev.y + this.y) / 2.0, (prev.vx + this.vx) / 2.0, (prev.vy + this.vy) / 2.0, (prev.rotation + this.rotation) / 2.0);
    };
    Player2D.prototype.tick = function(dt) {
      var newPos;
      newPos = Point.add(this.x, this.y, this.vx, this.vy);
      return this.setPos(newPos.x, newPos.y);
    };
    return Player2D;
  })();
});