define(function() {
  var deserialize;
  deserialize = function(object, prototypes) {
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
  return {
    deserialize: deserialize
  };
});