define (require) ->
  Point = require('../reckoning/util/point')

  class PlayerView
    constructor: (@paper, @game, @player_id, @color = 'white', @truth = false, @interp = true) ->
      console.log "drawing #{@player_id}"
      @time = @game.time

    tick: (state) ->
      @prevTime = @time
      @time = state.time

      @draw(state)

    draw: (state) ->
      player = state.getObjectById(@player_id) 

      if player?
        @create(state) if not @obj?

        delta = Point.subtract(player.x + player.vx, player.y + player.vy, @x, @y)
        dist = Point.getLength(delta.x, delta.y)

        if dist < 0.25 || dist > 50 || @truth
          if dist > 50
            console.log 'snap pos'
        else
          # Ease in
          delta = Point.normalize(delta.x, delta.y, dist * 0.8)
        
        dp = new @paper.Point(delta)
        da = if dist > 0.25 then dp.getAngle() - @rotation else 0

        if da < 10 || da > 90 || @truth
          # Snap
        else
          da *= 0.1

        @obj.translate dp
        @obj.rotate da

        @x += delta.x
        @y += delta.y
        @rotation += da

        # console.log @obj.getPosition().x, @obj.getPosition().y
      else
        @remove()

    create: (state) ->
      player = state.getObjectById(@player_id)
      console.log "creating #{@player_id}"

      if player?
        @x = player.x
        @y = player.y

        circle = new @paper.Path.Circle [player.x, player.y], player.radius
        circle.strokeColor = @color
        line = new @paper.Path.Line [player.x, player.y - player.radius], [player.x, player.y]
        line.strokeColor = @color
        @obj = new @paper.Group([circle, line])
        @rotation = player.rotation
        @obj.rotate player.rotation + 90

        console.log "created"

    remove: ->
      if @obj?
        @obj.remove()
        @obj = null
