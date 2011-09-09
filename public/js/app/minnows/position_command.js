var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Command, PositionCommand;
  Command = require('../reckoning/command');
  return PositionCommand = (function() {
    __extends(PositionCommand, Command);
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
    PositionCommand.prototype.apply = function(scene) {
      var obj;
      if (scene.objects[this.id] != null) {
        obj = scene.objects[this.id];
        obj.x = this.x;
        obj.y = this.y;
        obj.vx = this.vx;
        return obj.vy = this.vy;
      }
    };
    return PositionCommand;
  })();
});