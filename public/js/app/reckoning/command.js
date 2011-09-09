var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var Command, Serializable;
  Serializable = require('./serializable');
  return Command = (function() {
    __extends(Command, Serializable);
    Command.prototype.__type = 'Command';
    function Command(time, id) {
      this.time = time;
      this.id = id;
      Command.__super__.constructor.apply(this, arguments);
    }
    Command.prototype.apply = function(scene) {};
    return Command;
  })();
});