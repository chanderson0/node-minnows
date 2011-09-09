var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Player, Point, Reckoning, util;
  Reckoning = require('../reckoning/reckoning');
  util = require('../reckoning/util/util');
  Point = require('../reckoning/util/point');
  return Player = (function() {
    __extends(Player, Reckoning.Player2D);
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
    Player.prototype.approach = function(dt) {
      var dir, dist, to_move;
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
    return Player;
  })();
});