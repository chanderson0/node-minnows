var __slice = Array.prototype.slice;
define(function() {
  var Serializable;
  return Serializable = (function() {
    var __type;
    __type = 'Serializable';
    function Serializable() {
      this.__type = this.__type;
    }
    Serializable.buildMap = function() {
      var id, key, map, maps, res, val;
      maps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      res = {};
      for (id in maps) {
        map = maps[id];
        for (key in map) {
          val = map[key];
          res[key] = val;
        }
      }
      return res;
    };
    Serializable.deserialize = function(object, prototypes) {
      var key, value, _results;
      if ((object != null) && typeof object === 'object') {
        if (object.__type != null) {
          object.__proto__ = prototypes[object.__type].prototype;
        }
        _results = [];
        for (key in object) {
          value = object[key];
          _results.push(typeof value === 'object' ? deserialize(value, prototypes) : void 0);
        }
        return _results;
      }
    };
    return Serializable;
  })();
});