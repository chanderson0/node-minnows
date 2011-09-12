
define('underscore',["require", "exports", "module"], function(require, exports, module) {
// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||
(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,
function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),
function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,
b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);
c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;
if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==
1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||
!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};
var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,
arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();

});

define('reckoning/util/util',[],function(){return{uuid:function(){var a,b,c,d,e;a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),e=Array(36),d=0;for(b=0;b<=36;b++)switch(b){case 8:case 13:case 18:case 23:e[b]="-";break;case 14:e[b]="4";break;default:d<=2&&(d=33554432+Math.random()*16777216|0),c=d&15,d=d>>4,e[b]=a[b===19?c&3|8:c]}return e.join("")}}})
define('reckoning/util/point',[],function() {
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
      if (length == null) {
        length = 1;
      }
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
var __slice = Array.prototype.slice;
define('reckoning/serializable',[],function() {
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
          _results.push(typeof value === 'object' ? this.deserialize(value, prototypes) : void 0);
        }
        return _results;
      }
    };
    return Serializable;
  })();
});
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define('reckoning/util/circular_buffer',['require','../serializable'],function(require) {
  var CircularBuffer, Serializable;
  Serializable = require('../serializable');
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

define('underscore',["require", "exports", "module"], function(require, exports, module) {
// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||
(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,
function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),
function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,
b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);
c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;
if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==
1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||
!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};
var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,
arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();

});

define('reckoning/util/util',[],function(){return{uuid:function(){var a,b,c,d,e;a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),e=Array(36),d=0;for(b=0;b<=36;b++)switch(b){case 8:case 13:case 18:case 23:e[b]="-";break;case 14:e[b]="4";break;default:d<=2&&(d=33554432+Math.random()*16777216|0),c=d&15,d=d>>4,e[b]=a[b===19?c&3|8:c]}return e.join("")}}})
define('reckoning/util/point',[],function() {
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
      if (length == null) {
        length = 1;
      }
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
var __slice = Array.prototype.slice;
define('reckoning/serializable',[],function() {
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
          _results.push(typeof value === 'object' ? this.deserialize(value, prototypes) : void 0);
        }
        return _results;
      }
    };
    return Serializable;
  })();
});
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define('reckoning/util/circular_buffer',['require','../serializable'],function(require) {
  var CircularBuffer, Serializable;
  Serializable = require('../serializable');
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
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define('reckoning/reckoning',['require','underscore','./util/util','./util/point','./util/circular_buffer','./serializable'],function(require) {
  var CircularBuffer, Command, Game, GameObject, GameObject2D, Point, Scene, Serializable, State, Util, _;
  _ = require('underscore')._;
  Util = require('./util/util');
  Point = require('./util/point');
  CircularBuffer = require('./util/circular_buffer');
  Serializable = require('./serializable');
  GameObject = (function() {
    __extends(GameObject, Serializable);
    GameObject.prototype.__type = 'GameObject';
    function GameObject() {
      GameObject.__super__.constructor.apply(this, arguments);
    }
    GameObject.prototype.clone = function() {
      return new GameObject();
    };
    GameObject.prototype.tick = function(dt) {};
    GameObject.prototype.interpolate = function(prev, alpha) {
      return this.clone();
    };
    GameObject.prototype.leave = function() {};
    return GameObject;
  })();
  GameObject2D = (function() {
    __extends(GameObject2D, GameObject);
    GameObject2D.prototype.__type = 'Player2D';
    function GameObject2D(x, y, vx, vy, rotation) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.vx = vx != null ? vx : 0;
      this.vy = vy != null ? vy : 0;
      this.rotation = rotation != null ? rotation : 0;
      GameObject2D.__super__.constructor.call(this, this.state);
    }
    GameObject2D.prototype.clone = function() {
      return new GameObject2D(this.x, this.y, this.vx, this.vy, this.rotation);
    };
    GameObject2D.prototype.setPos = function(x, y) {
      this.x = x;
      return this.y = y;
    };
    GameObject2D.prototype.setVel = function(vx, vy) {
      this.vx = vx;
      this.vy = vy;
      if (this.vx !== 0 || this.vy !== 0) {
        return this.rotation = Point.getAngleDeg(this.vx, this.vy);
      }
    };
    GameObject2D.prototype.interpolate = function(prev, alpha) {
      return new this.constructor((prev.x + this.x) / 2.0, (prev.y + this.y) / 2.0, (prev.vx + this.vx) / 2.0, (prev.vy + this.vy) / 2.0, (prev.rotation + this.rotation) / 2.0);
    };
    GameObject2D.prototype.tick = function(dt) {
      var newPos;
      newPos = Point.add(this.x, this.y, this.vx * dt, this.vy * dt);
      return this.setPos(newPos.x, newPos.y);
    };
    return GameObject2D;
  })();
  State = (function() {
    __extends(State, Serializable);
    State.prototype.__type = 'State';
    function State(time, scene) {
      this.time = time;
      State.__super__.constructor.apply(this, arguments);
      this.scene = scene.clone();
    }
    State.prototype.clone = function(time) {
      if (time == null) {
        time = this.time;
      }
      return new this.constructor(time, this.scene);
    };
    State.prototype.tick = function(dt) {
      this.beforeTick();
      this.scene.tick(dt);
      return this.afterTick();
    };
    State.prototype.interpolate = function(prevState, alpha) {
      var prevScene, res;
      res = this.clone();
      prevScene = prevState.scene;
      res.scene = this.scene.interpolate(prevScene, alpha);
      return res;
    };
    State.prototype.getObjectById = function(id) {
      return this.scene.getObjectById(id);
    };
    State.prototype.addObject = function(id, obj) {
      return this.scene.addObject(id, obj);
    };
    State.prototype.removeObject = function(id) {
      return this.scene.removeObject(id);
    };
    State.prototype.beforeTick = function() {};
    State.prototype.afterTick = function() {};
    return State;
  })();
  Scene = (function() {
    __extends(Scene, Serializable);
    Scene.prototype.__type = 'Scene';
    function Scene(objects) {
      var id, object;
      if (objects == null) {
        objects = {};
      }
      Scene.__super__.constructor.apply(this, arguments);
      this.objects = {};
      for (id in objects) {
        object = objects[id];
        this.objects[id] = object.clone(this.state);
      }
    }
    Scene.prototype.clone = function() {
      return new this.constructor(this.objects);
    };
    Scene.prototype.tick = function(dt) {
      var id, object, _ref;
      this.beforeTick();
      _ref = this.objects;
      for (id in _ref) {
        object = _ref[id];
        object.tick(dt);
      }
      return this.afterTick();
    };
    Scene.prototype.interpolate = function(prevScene, alpha) {
      var id, object, prev, res, _ref;
      res = new this.constructor();
      _ref = this.objects;
      for (id in _ref) {
        object = _ref[id];
        prev = prevScene.objects[id];
        if (prev != null) {
          res.objects[id] = object.interpolate(prev, alpha);
        }
      }
      return res;
    };
    Scene.prototype.beforeTick = function() {};
    Scene.prototype.afterTick = function() {};
    Scene.prototype.getObjectById = function(id) {
      return this.objects[id];
    };
    Scene.prototype.addObject = function(id, obj) {
      return this.objects[id] = obj;
    };
    Scene.prototype.removeObject = function(id) {
      this.objects[id].leave();
      return delete this.objects[id];
    };
    return Scene;
  })();
  Command = (function() {
    __extends(Command, Serializable);
    Command.prototype.__type = 'Command';
    function Command(time, id) {
      this.time = time;
      this.id = id;
      Command.__super__.constructor.apply(this, arguments);
    }
    Command.prototype.apply = function(state) {};
    return Command;
  })();
  Game = (function() {
    var defaults;
    __extends(Game, Serializable);
    Game.prototype.__type = 'Game';
    defaults = {
      historySize: 100,
      timeStep: 1000 / 60.0,
      renderBehind: 8,
      stateType: State,
      sceneType: Scene
    };
    function Game(time, options) {
      if (time == null) {
        time = null;
      }
      if (options == null) {
        options = {};
      }
      Game.__super__.constructor.apply(this, arguments);
      options = _.extend(defaults, options);
      this.time = time != null ? time : +new Date();
      this.accumulator = 0;
      this.frame = 0;
      this.state = new options.stateType(this.time, new options.sceneType());
      this.replayNeeded = false;
      this.history = new CircularBuffer(options.historySize);
      this.commands = new CircularBuffer(options.historySize);
      this.timeStep = options.timeStep;
      this.renderBehind = options.renderBehind;
    }
    Game.prototype.replay = function(fromFrame, stopFrame) {
      var frame, newState, state, t;
      frame = fromFrame;
      state = this.history.get(frame);
      t = state.time;
      while (frame <= stopFrame) {
        newState = state.clone(t);
        this.applyCommands(frame, newState);
        this.history.set(frame, newState);
        state = newState;
        frame += 1;
        t += this.timeStep;
      }
      this.state = state;
      return this.frame = stopFrame;
    };
    Game.prototype.tick = function(now, draw) {
      var diff, newState;
      if (now == null) {
        now = null;
      }
      if (draw == null) {
        draw = null;
      }
      if (this.replayNeeded) {
        this.replay(this.replayNeeded, this.frame);
        this.replayNeeded = false;
      }
      now = now != null ? now : +new Date();
      diff = now - this.time;
      this.time = now;
      this.accumulator += diff;
      while (this.accumulator >= this.timeStep) {
        this.frame += 1;
        newState = this.state.clone(this.time);
        this.applyCommands(this.frame, newState);
        this.history.set(this.frame, this.state);
        this.state = newState;
        this.accumulator -= this.timeStep;
      }
      if (draw != null) {
        return draw(this.history.get(this.frame - this.renderBehind));
      }
    };
    Game.prototype.interpolate = function() {
      var alpha, prev;
      alpha = this.accumulator / this.timeStep;
      prev = this.history.get(this.frame - 1);
      return this.state.interpolate(prev, alpha);
    };
    Game.prototype.predict = function(state, prevState) {};
    Game.prototype.applyCommands = function(frame, state) {
      var command, commands, i;
      commands = this.commands.getDefault(frame, []);
      i = 0;
      while (i < commands.length) {
        command = commands[i];
        command.apply(state);
        i++;
      }
      return state.tick(this.timeStep);
    };
    Game.prototype.findFrame = function(time) {
      var firstIndex, frame, historical;
      firstIndex = this.history.firstIndex();
      historical = null;
      frame = this.frame;
      while (frame >= firstIndex) {
        historical = this.history.get(frame);
        if (!(historical != null)) {
          console.log(frame, 'is missing');
          frame--;
          continue;
        }
        if (historical.time < time) {
          break;
        }
        frame--;
      }
      return frame;
    };
    Game.prototype.addCommand = function(command) {
      var frame, historical;
      if (command.time < this.time) {
        frame = this.findFrame(command.time);
        historical = this.history.get(frame);
        if (!(historical != null)) {
          return;
        }
        if (historical.time > command.time) {} else {
          this.commands.pushOrCreate(frame, command);
          if (this.replayNeeded) {
            return this.replayNeeded = Math.min(this.replayNeeded, frame);
          } else {
            return this.replayNeeded = frame;
          }
        }
      } else {
        return this.commands.pushOrCreate(this.frame + 1, command);
      }
    };
    Game.prototype.getObjectById = function(id) {
      return this.state.getObjectById(id);
    };
    return Game;
  })();
  return {
    Serializable: Serializable,
    GameObject: GameObject,
    GameObject2D: GameObject2D,
    State: State,
    Scene: Scene,
    Command: Command,
    Game: Game,
    CircularBuffer: CircularBuffer,
    Serializable: Serializable,
    Point: Point,
    Util: Util
  };
});
define("reckoning/reckoning", function(){});

var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define('minnows/minnows',['require','reckoning/reckoning'],function(require) {
  var JoinCommand, LeaveCommand, MinnowsScene, MouseCommand, Player, PlayerView, Point, PositionCommand, Reckoning;
  Reckoning = require('reckoning/reckoning');
  Point = Reckoning.Point;
  JoinCommand = (function() {
    __extends(JoinCommand, Reckoning.Command);
    JoinCommand.prototype.__type = 'JoinCommand';
    function JoinCommand(time, id, player) {
      this.time = time;
      this.id = id;
      this.player = player;
      JoinCommand.__super__.constructor.call(this, this.time, this.id);
    }
    JoinCommand.prototype.apply = function(state) {
      return state.addObject(this.id, this.player);
    };
    return JoinCommand;
  })();
  LeaveCommand = (function() {
    __extends(LeaveCommand, Reckoning.Command);
    LeaveCommand.prototype.__type = 'LeaveCommand';
    function LeaveCommand(time, id) {
      this.time = time;
      this.id = id;
      LeaveCommand.__super__.constructor.call(this, this.time, this.id);
    }
    LeaveCommand.prototype.apply = function(state) {
      var obj;
      obj = state.getObjectById(this.id);
      if (obj != null) {
        return state.removeObject(this.id);
      }
    };
    return LeaveCommand;
  })();
  MouseCommand = (function() {
    __extends(MouseCommand, Reckoning.Command);
    MouseCommand.prototype.__type = 'MouseCommand';
    function MouseCommand(time, id, destx, desty) {
      this.time = time;
      this.id = id;
      this.destx = destx;
      this.desty = desty;
      MouseCommand.__super__.constructor.call(this, this.time, this.id);
    }
    MouseCommand.prototype.apply = function(state) {
      var obj;
      obj = state.getObjectById(this.id);
      if (obj != null) {
        obj.destx = this.destx;
        return obj.desty = this.desty;
      }
    };
    return MouseCommand;
  })();
  PositionCommand = (function() {
    __extends(PositionCommand, Reckoning.Command);
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
    PositionCommand.prototype.apply = function(state) {
      var obj;
      obj = state.getObjectById(this.id);
      if (obj != null) {
        obj.setPos(this.x, this.y);
        return obj.setVel(this.vx, this.vy);
      }
    };
    return PositionCommand;
  })();
  MinnowsScene = (function() {
    __extends(MinnowsScene, Reckoning.Scene);
    function MinnowsScene() {
      MinnowsScene.__super__.constructor.apply(this, arguments);
    }
    MinnowsScene.prototype.__type = 'MinnowsScene';
    MinnowsScene.prototype.afterTick = function(dt) {
      var id, id2, object, object2, _ref, _results;
      _ref = this.objects;
      _results = [];
      for (id in _ref) {
        object = _ref[id];
        _results.push((function() {
          var _ref2, _results2;
          _ref2 = this.objects;
          _results2 = [];
          for (id2 in _ref2) {
            object2 = _ref2[id2];
            _results2.push(object.__type === 'Player' && object2.__type === 'Player' && id !== id2 ? object.collide(object2) : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    return MinnowsScene;
  })();
  Player = (function() {
    __extends(Player, Reckoning.GameObject2D);
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
      if (!(this.destx != null) || !(this.desty != null)) {
        return;
      }
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
    Player.prototype.collide = function(other) {
      var diff, distance, normal, penetration, separation;
      diff = Point.subtract(other.x, other.y, this.x, this.y);
      distance = Point.getLength(diff.x, diff.y);
      separation = this.radius + other.radius;
      if (distance > separation) {
        return false;
      }
      penetration = separation - distance;
      normal = Point.normalize(diff.x, diff.y, penetration / 2.0);
      this.x -= normal.x;
      this.y -= normal.y;
      other.x += normal.x;
      other.y += normal.y;
      return true;
    };
    return Player;
  })();
  PlayerView = (function() {
    function PlayerView(paper, game, player_id, color, truth, interp) {
      this.paper = paper;
      this.game = game;
      this.player_id = player_id;
      this.color = color != null ? color : 'white';
      this.truth = truth != null ? truth : false;
      this.interp = interp != null ? interp : true;
      console.log("drawing " + this.player_id);
      this.time = this.game.time;
    }
    PlayerView.prototype.tick = function(state) {
      this.prevTime = this.time;
      this.time = state.time;
      return this.draw(state);
    };
    PlayerView.prototype.draw = function(state) {
      var da, delta, dist, dp, player;
      player = state.getObjectById(this.player_id);
      if (player != null) {
        if (!(this.obj != null)) {
          this.create(state);
        }
        delta = Point.subtract(player.x + player.vx, player.y + player.vy, this.x, this.y);
        dist = Point.getLength(delta.x, delta.y);
        if (dist < 0.25 || dist > 50 || this.truth) {
          if (dist > 50) {
            console.log('snap pos');
          }
        } else {
          delta = Point.normalize(delta.x, delta.y, dist * 0.8);
        }
        dp = new this.paper.Point(delta);
        da = dist > 0.25 ? dp.getAngle() - this.rotation : 0;
        if (da < 10 || da > 90 || this.truth) {} else {
          da *= 0.25;
        }
        this.obj.translate(dp);
        this.obj.rotate(da);
        this.x += delta.x;
        this.y += delta.y;
        return this.rotation += da;
      } else {
        return this.remove();
      }
    };
    PlayerView.prototype.create = function(state) {
      var circle, line, player;
      player = state.getObjectById(this.player_id);
      console.log("creating " + this.player_id);
      if (player != null) {
        this.x = player.x;
        this.y = player.y;
        circle = new this.paper.Path.Circle([player.x, player.y], player.radius);
        circle.strokeColor = this.color;
        line = new this.paper.Path.Line([player.x, player.y - player.radius], [player.x, player.y]);
        line.strokeColor = this.color;
        this.obj = new this.paper.Group([circle, line]);
        this.rotation = player.rotation;
        this.obj.rotate(player.rotation + 90);
        return console.log("created");
      }
    };
    PlayerView.prototype.remove = function() {
      if (this.obj != null) {
        this.obj.remove();
        return this.obj = null;
      }
    };
    return PlayerView;
  })();
  return {
    Player: Player,
    PlayerView: PlayerView,
    MinnowsScene: MinnowsScene,
    MouseCommand: MouseCommand,
    JoinCommand: JoinCommand,
    PositionCommand: PositionCommand,
    LeaveCommand: LeaveCommand
  };
});