define (require) ->
  _ = require('underscore')._

  Util = require './util/util'
  Point = require './util/point'
  CircularBuffer = require './util/circular_buffer'
  Serializable = require './serializable'

  class GameObject extends Serializable
    __type: 'GameObject'

    constructor: () ->
      super

    clone: ->
      new GameObject()

    tick: (dt) ->
      # Override me!

    interpolate: (prev, alpha) ->
      @clone()

    leave: ->
      # Override me!

  class GameObject2D extends GameObject
    __type: 'Player2D'

    constructor: (@x = 0, @y = 0, @vx = 0, @vy = 0, @rotation = 0) ->
      super @state

    clone: ->
      new GameObject2D @x, @y, @vx, @vy, @rotation

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
      newPos = Point.add(@x, @y, @vx * dt, @vy * dt)
      @setPos newPos.x, newPos.y

  class State extends Serializable
    __type: 'State'

    constructor: (@time, scene) ->
      super
      @scene = scene.clone()
    
    clone: (time = @time) ->
      new this.constructor time, @scene

    tick: (dt) ->
      @beforeTick()
      @scene.tick dt
      @afterTick()

    interpolate: (prevState, alpha) ->
      res = @clone()
      prevScene = prevState.scene
      res.scene = @scene.interpolate(prevScene, alpha)
      return res

    getObjectById: (id) ->
      @scene.getObjectById id

    addObject: (id, obj) ->
      @scene.addObject id, obj
    
    removeObject: (id) ->
      @scene.removeObject id

    beforeTick: ->
      # Override me!

    afterTick: ->
      # Override me!

  class Scene extends Serializable
    __type: 'Scene'

    constructor: (objects = {}) ->
      super

      @objects = {}
      for id, object of objects
        @objects[id] = object.clone(@state)

    clone: ->
      new this.constructor @objects
    
    tick: (dt) ->
      @beforeTick()

      for id, object of @objects
        object.tick dt

      @afterTick()

    interpolate: (prevScene, alpha) ->
      res = new this.constructor()
      for id, object of @objects
        prev = prevScene.objects[id]
        if prev?
          res.objects[id] = object.interpolate prev, alpha
      return res
    
    beforeTick: ->
      # Override me!

    afterTick: ->
      # Override me!

    getObjectById: (id) ->
      @objects[id]

    addObject: (id, obj) ->
      @objects[id] = obj

    removeObject: (id) ->
      @objects[id].leave()
      delete @objects[id]
  
  class Command extends Serializable
    __type: 'Command'

    constructor: (@time, @id) ->
      super
      # Override me!

    apply: (state) ->
      # Override me!


  class Game extends Serializable
    __type: 'Game'

    defaults = 
      historySize: 100
      timeStep: 1000 / 60.0
      renderBehind: 8
      stateType: State
      sceneType: Scene

    constructor: (time = null, options = {}) ->
      super
      options = _.extend defaults, options

      @time = time ? +new Date()
      @accumulator = 0
      @frame = 0

      @state = new options.stateType @time, new options.sceneType()
      @replayNeeded = false

      @history = new CircularBuffer options.historySize
      @commands = new CircularBuffer options.historySize

      @timeStep = options.timeStep
      @renderBehind = options.renderBehind

    replay: (fromFrame, stopFrame) ->
      frame = fromFrame
      state = @history.get frame

      #console.log "replaying from #{frame}, simulation at #{@frame}/#{@time}"
      t = state.time
      while frame <= stopFrame
        newState = state.clone t

        @applyCommands frame, newState
        @history.set frame, newState
        
        state = newState
        frame += 1
        t += @timeStep

      @state = state
      # console.log "we were at #{@frame}, now at #{stopFrame}"
      @frame = stopFrame

    tick: (now = null, draw = null) ->
      # Replay history if we're behind.
      if @replayNeeded
        @replay @replayNeeded, @frame
        @replayNeeded = false

      # Calculate time since last tick
      now = now ? +new Date()
      diff = now - @time
      @time = now
      @accumulator += diff

      # Empty time buffer
      while @accumulator >= @timeStep
        @frame += 1
        newState = @state.clone @time

        @applyCommands @frame, newState
        @history.set @frame, @state

        @state = newState
        @accumulator -= @timeStep

      if draw?
        # interpState = @interpolate()
        # draw(interpState)
        draw @history.get(@frame - @renderBehind)

    interpolate: () ->
      alpha = @accumulator / @timeStep
      prev = @history.get @frame - 1
      return @state.interpolate prev, alpha

    predict: (state, prevState) ->
      # Override me!

    applyCommands: (frame, state) ->
      commands = @commands.getDefault(frame, [])
      i = 0
      while i < commands.length
        command = commands[i]
        command.apply state
        i++

      state.tick @timeStep

    findFrame: (time) ->
      firstIndex = @history.firstIndex()
      historical = null
      frame = @frame
      while frame >= firstIndex
        historical = @history.get(frame)
        if not historical?
          console.log frame, 'is missing'
          frame--
          continue
        if historical.time < time
          break

        frame--
      return frame

    addCommand: (command) ->
      if command.time < @time
        frame = @findFrame(command.time)
        historical = @history.get(frame)
        if not historical?
          return

        # console.log 'adding command in past', frame, @frame
        
        # console.log 'simulation at',@frame,'inserting at',frame
        # console.log 'time at',@time,'frame has',historical.time
        # console.log 'for command at',command.time

        if historical.time > command.time
          # Discard, too old
          # console.log 'had to discard command at', command.time, 'was before earliest command', historical.time
        else
          @commands.pushOrCreate frame, command

          if @replayNeeded
            @replayNeeded = Math.min(@replayNeeded, frame)
          else
            # console.log 'lets replay from', frame
            @replayNeeded = frame
      else
        # console.log 'adding command in future'
        @commands.pushOrCreate @frame + 1, command
    
    getObjectById: (id) ->
      @state.getObjectById id


  # Export everything...
  {
    Serializable: Serializable
    GameObject: GameObject
    GameObject2D: GameObject2D
    State: State
    Scene: Scene
    Command: Command
    Game: Game

    CircularBuffer: CircularBuffer
    Serializable: Serializable
    Point: Point
    Util: Util
  }