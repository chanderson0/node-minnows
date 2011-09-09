var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Command, LeaveCommand;
  Command = require('../reckoning/command');
  return LeaveCommand = (function() {
    __extends(LeaveCommand, Command);
    LeaveCommand.prototype.__type = 'LeaveCommand';
    function LeaveCommand(time, id) {
      this.time = time;
      this.id = id;
      LeaveCommand.__super__.constructor.call(this, this.time, this.id);
    }
    LeaveCommand.prototype.apply = function(scene) {
      if (scene.objects[this.id] != null) {
        scene.objects[this.id].leave();
        return delete scene.objects[this.id];
      }
    };
    return LeaveCommand;
  })();
});