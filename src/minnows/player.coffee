define (require) ->

  Reckoning = require('../reckoning/reckoning')
  util = require('../reckoning/util/util')
  Point = require('../reckoning/util/point')

  class Player extends Reckoning.Player2D
    __type: 'Player'

    constructor: (x = 0, y = 0, vx = 0, vy = 0, @rotation = 0, @destx = null, @desty = null, @radius = 25) ->
      super(x, y, vx, vy, @rotation)
      if not @destx? or not @desty?
        @destx = x
        @desty = y

    clone: ->
      new Player(@x, @y, @vx, @vy, @rotation, @destx, @desty, @radius)

    approach: (dt) ->
      dir = Point.subtract @destx, @desty, @x, @y
      dist = Point.getLength dir.x, dir.y

      to_move = Point.normalize dir.x, dir.y, Math.sqrt(dist) * dt / 1000.0 * 4
      if dist < 0.5
        to_move.x = 0
        to_move.y = 0
        @setPos @destx, @desty

      @setVel to_move.x, to_move.y
    
    tick: (dt) ->
      @approach dt
      super dt
