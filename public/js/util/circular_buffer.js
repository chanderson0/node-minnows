var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function(require) {
  var CircularBuffer, Serializable;
  Serializable = require('serializable');
  return CircularBuffer = (function() {
    __extends(CircularBuffer, Serializable);
    CircularBuffer.prototype.__type = 'CircularBuffer';
    function CircularBuffer(n) {
      CircularBuffer.__super__.constructor.apply(this, arguments);
      this.array = new Array(n);
      this.min = n;
      this.length = 0;
    }
    CircularBuffer.prototype.get = function(i) {
      if (i < 0 || i < this.length - this.array.length || i >= this.length) {
        return;
      }
      return this.array[i % this.array.length];
    };
    CircularBuffer.prototype.set = function(i, v) {
      if (i < 0 || i < this.length - this.array.length) {
        console.log(i, this.min, this.length);
        throw Error;
      }
      while (i > this.length) {
        this.array[this.length % this.array.length] = void 0;
        this.length++;
      }
      this.array[i % this.array.length] = v;
      if (i === this.length) {
        return this.length++;
      }
    };
    CircularBuffer.prototype.getDefault = function(i, def) {
      var val;
      val = this.get(i);
      if (!(this.get(i) != null) || this.get(i) === void 0) {
        return def;
      } else {
        return val;
      }
    };
    CircularBuffer.prototype.pushOrCreate = function(i, v) {
      if (i >= this.length) {
        return this.set(i, [v]);
      } else if ((this.get(i) != null) && this.get(i) !== void 0) {
        return this.get(i).push(v);
      } else {
        return this.set(i, [v]);
      }
    };
    CircularBuffer.prototype.push = function(v) {
      return this.set(this.length, v);
    };
    CircularBuffer.prototype.firstIndex = function() {
      return Math.max(this.length - this.min, 0);
    };
    CircularBuffer.prototype.last = function() {
      return this.array[this.length - 1];
    };
    return CircularBuffer;
  })();
});