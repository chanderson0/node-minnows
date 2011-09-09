define (require) ->

  Command = require './command'
  GameObject = require './game_object'
  Scene = require './scene'
  State = require './state'
  CircularBuffer = require './util/circular_buffer'
  Serializable = require './serializable'

  return class Game extends Serializable
    __type: 'Game'

    constructor: (time = null) ->
      super

      if not time?
        @time = +new Date()
      else
        @time = time

      @accumulator = 0
      @frame = 0

      @state = new State @time, new Scene({})

      @history = new CircularBuffer 100
      @commands = new CircularBuffer 100

      @timeStep = 1000 / 60.0
      @replayNeeded = false

    replay: (stateIdx, stopTime) ->
      state = @history.get stateIdx
      frame = stateIdx

      # console.log "replaying from #{frame}, simulation at #{@frame}"
      t = state.time
      while t < stopTime
        newState = state.clone t
        @history.set frame, state

        @applyCommands(frame, newState)
        
        state = newState
        # console.log frame
        frame += 1
        t += @timeStep

      @state = state
      @frame = frame

    tick: (now = null, draw = null) ->
      if @replayNeeded
        @replay @replayNeeded, @time
        @replayNeeded = false

      if not now?
        now = +new Date()
      diff = now - @time
      @time = now
      @accumulator += diff

      # console.log "tick #{@frame} #{@accumulator}"
      while @accumulator > @timeStep
        # console.log @frame
        newState = @state.clone @time

        @applyCommands(@frame, newState)
        @history.set @frame, @state

        @frame += 1
        @state = newState
        @accumulator -= @timeStep

      if draw?
        interpState = @interpolate()
        draw(interpState)

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
        command.apply state.scene
        i++

      state.scene.tick @timeStep

    addCommand: (command) ->
      # if command.time < @time
      #   frame = @history.firstIndex()
      #   length = @history.length
      #   while frame+1 < length
      #     if not @history.get(frame+1)?
      #       console.log frame+1, 'is missing'
      #     if not (@history.get(frame+1)? && @history.get(frame+1).time < command.time)
      #       break

      #     frame++

      #   state = @history.get(frame)
      #   if not state?
      #     return

      #   if state.time > command.time
      #     # Discard, too old
      #   else
      #     @commands.pushOrCreate frame, command

      #     if @replayNeeded
      #       @replayNeeded = Math.min(@replayNeeded, frame)
      #     else
      #       console.log 'lets replay from', frame
      #       @replayNeeded = frame
      # else
        @commands.pushOrCreate @frame + 1, command
    
    getObjectById: (id, frame = @frame) ->
      @state.scene.objects[id]
