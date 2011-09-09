var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Command, JoinCommand;
  Command = require('../reckoning/command');
  return JoinCommand = (function() {
    __extends(JoinCommand, Command);
    JoinCommand.prototype.__type = 'JoinCommand';
    function JoinCommand(time, id, player) {
      this.time = time;
      this.id = id;
      this.player = player;
      JoinCommand.__super__.constructor.call(this, this.time, this.id);
    }
    JoinCommand.prototype.apply = function(scene) {
      return scene.objects[this.id] = this.player;
    };
    return JoinCommand;
  })();
});