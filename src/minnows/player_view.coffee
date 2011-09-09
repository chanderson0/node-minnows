define (require) ->
  Point = require('../reckoning/util/point')

  class PlayerView
    constructor: (@paper, @game, @player_id, @color = 'white', @truth = false, @interp = true) ->
      console.log "drawing #{@player_id}"

    tick: (state) ->
      @draw(state)

    draw: (state) ->
      player = state.getObjectById(@player_id) 

      if player?
        @create(state) if not @obj?

        delta = Point.subtract(player.x + player.vx, player.y + player.vy, @x, @y)
        dist = Point.getLength(delta.x, delta.y)

        if dist < 0.25 || dist > 1000 || @truth
          # Just snap into place
        else
          # Ease in
          delta = Point.normalize(delta.x, delta.y, dist * 0.7)
        
        dp = new @paper.Point(delta)
        da = if dist > 0.25 then dp.getAngle() - @rotation else 0

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
