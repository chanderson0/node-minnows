define(function() {
  var Point;
  return Point = (function() {
    function Point() {}
    Point.getAngleDeg = function(x, y) {
      return this.getAngle(x, y) * 180 / Math.PI;
    };
    Point.getAngle = function(x, y) {
      return Math.atan2(y, x);
    };
    Point.add = function(x1, y1, x2, y2) {
      return {
        x: x1 + x2,
        y: y1 + y2
      };
    };
    Point.subtract = function(x1, y1, x2, y2) {
      return {
        x: x1 - x2,
        y: y1 - y2
      };
    };
    Point.getDistance = function(x1, y1, x2, y2) {
      var x, y;
      x = x1 - x2;
      y = y1 - y2;
      return Math.sqrt(x * x + y * y);
    };
    Point.getLength = function(x, y) {
      return Math.sqrt(x * x + y * y);
    };
    Point.normalize = function(x, y, length) {
      var current, scale;
      current = this.getLength(x, y);
      scale = current !== 0 ? length / current : 0;
      return {
        x: x * scale,
        y: y * scale
      };
    };
    return Point;
  })();
});