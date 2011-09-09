define (require) ->
  GameObject = require('./game_object')
  Point = require('./util/point')

  class Player2D extends GameObject
    __type: 'Player2D'

    constructor: (@x = 0, @y = 0, @vx = 0, @vy = 0, @rotation = 0) ->
      super

    clone: ->
      new Player2D @x, @y, @vx, @vy, @rotation

    setPos: (x, y) ->
      @x = x
      @y = y

    setVel: (vx, vy) ->
      @vx = vx
      @vy = vy

      if @vx != 0 or @vy != 0
        @rotation = Point.getAngleDeg(@vx, @vy)
    
    interpolate: (prev, alpha) ->
      new this.constructor (prev.x + @x) / 2.0, 
        (prev.y  + @y ) / 2.0
        (prev.vx + @vx) / 2.0, 
        (prev.vy + @vy) / 2.0, 
        (prev.rotation + @rotation) / 2.0
    
    tick: (dt) ->
      newPos = Point.add(@x, @y, @vx, @vy)
      @setPos newPos.x, newPos.y
