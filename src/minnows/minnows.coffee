define (require) ->
  Reckoning = require 'reckoning/reckoning'
  Point = Reckoning.Point

  windowSize = 
    height: 384
    width: 576

  class JoinCommand extends Reckoning.Command
    __type: 'JoinCommand'

    constructor: (@time, @id, @player) ->
      super @time, @id
    
    apply: (state) ->
      state.addObject @id, @player

  class LeaveCommand extends Reckoning.Command
    __type: 'LeaveCommand'

    constructor: (@time, @id) ->
      super @time, @id
    
    apply: (state) ->
      obj = state.getObjectById @id
      if obj?
        state.removeObject @id

  class MouseCommand extends Reckoning.Command
    __type: 'MouseCommand'

    constructor: (@time, @id, @destx, @desty) ->
      super @time, @id

    apply: (state) ->
      obj = state.getObjectById @id
      if obj?
        obj.destx = @destx
        obj.desty = @desty

  class PositionCommand extends Reckoning.Command
    __type: 'PositionCommand'

    constructor: (@time, @id, @x, @y, @vx, @vy) ->
      super @time, @id
    
    apply: (state) ->
      obj = state.getObjectById @id
      if obj?
        obj.setPos @x, @y
        obj.setVel @vx, @vy

  class MinnowsScene extends Reckoning.Scene
    __type: 'MinnowsScene'

    afterTick: (dt) ->
      for id, object of @objects
        for id2, object2 of @objects
          if object.__type == 'Player' and object2.__type == 'Player' and id != id2
            object.collide(object2)

  class Player extends Reckoning.GameObject2D
    __type: 'Player'

    constructor: (x = 0, y = 0, vx = 0, vy = 0, @rotation = 0, @destx = null, @desty = null, @radius = 25) ->
      super x, y, vx, vy, @rotation
      if not @destx? or not @desty?
        @destx = x
        @desty = y

    clone: ->
      new Player @x, @y, @vx, @vy, @rotation, @destx, @desty, @radius

    setPos: (x, y) ->
      if x + @radius > windowSize.width
        x = windowSize.width - @radius
      else if x - @radius < 0
        x = @radius
      
      if y + @radius > windowSize.height
        y = windowSize.height - @radius
      else if y - @radius < 0
        y = @radius

      super x, y
      

    approach: (dt) ->
      return if not @destx? or not @desty?
      
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

    collide: (other) ->
      diff = Point.subtract other.x, other.y, @x, @y
      distance = Point.getLength diff.x, diff.y
      separation = @radius + other.radius

      if distance > separation
        return false

      penetration = separation - distance
      normal = Point.normalize diff.x, diff.y, penetration / 2.0

      @x -= normal.x
      @y -= normal.y
      other.x += normal.x
      other.y += normal.y

      return true

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
          da *= 0.25

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

  # Define the library.
  {
    Player: Player,
    PlayerView: PlayerView,
    MinnowsScene: MinnowsScene,

    MouseCommand: MouseCommand,
    JoinCommand: JoinCommand,
    PositionCommand: PositionCommand,
    LeaveCommand: LeaveCommand
  }