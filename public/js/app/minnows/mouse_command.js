var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Command, MouseCommand;
  Command = require('../reckoning/command');
  return MouseCommand = (function() {
    __extends(MouseCommand, Command);
    MouseCommand.prototype.__type = 'MouseCommand';
    function MouseCommand(time, id, destx, desty) {
      this.time = time;
      this.id = id;
      this.destx = destx;
      this.desty = desty;
      MouseCommand.__super__.constructor.call(this, this.time, this.id);
    }
    MouseCommand.prototype.apply = function(scene) {
      if (scene.objects[this.id] != null) {
        scene.objects[this.id].destx = this.destx;
        return scene.objects[this.id].desty = this.desty;
      }
    };
    return MouseCommand;
  })();
});