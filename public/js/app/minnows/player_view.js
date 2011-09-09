define(function(require) {
  var PlayerView, Point;
  Point = require('../reckoning/util/point');
  return PlayerView = (function() {
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
          da *= 0.1;
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
});