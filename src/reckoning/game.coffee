define (require) ->

  Command = require './command'
  GameObject = require './game_object'
  Scene = require './scene'
  State = require './state'
  CircularBuffer = require './util/circular_buffer'
  Serializable = require './serializable'

  _u = require 'underscore'

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

      @history = new CircularBuffer 500
      @commands = new CircularBuffer 500

      @timeStep = 1000 / 60.0
      @replayNeeded = false

    replay: (fromFrame, stopFrame) ->
      frame = fromFrame
      state = @history.get frame

      console.log "replaying from #{frame}, simulation at #{@frame}/#{@time}"
      t = state.time
      while frame <= stopFrame
        console.log 'replaying', frame
        newState = state.clone t

        @applyCommands frame, newState
        @history.set frame, newState
        
        state = newState
        frame += 1
        t += @timeStep

      @state = state
      console.log "we were at #{@frame}, now at #{stopFrame}"
      @frame = stopFrame

    tick: (now = null, draw = null) ->
      if @replayNeeded
        @replay @replayNeeded, @frame
        @replayNeeded = false

      if not now?
        now = +new Date()
      diff = now - @time
      @time = now
      @accumulator += diff

      # console.log "tick #{@frame} #{@accumulator}/#{@time}"
      while @accumulator > @timeStep
        @frame += 1
        newState = @state.clone @time

        @applyCommands(@frame, newState)
        @history.set @frame, @state

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
      if command.time < @time
        frame = @frame
        firstIndex = @history.firstIndex()
        while frame >= firstIndex
          historical = @history.get(frame)
          if not historical?
            console.log frame, 'is missing'
            frame--
            continue
          if historical.time < command.time
            break

          frame--

        console.log 'will insert at',frame,'on',@frame

        state = @history.get(frame)
        if not state?
          return

        if state.time > command.time
          # Discard, too old
        else
          @commands.pushOrCreate frame, command

          if @replayNeeded
            @replayNeeded = Math.min(@replayNeeded, frame)
          else
            console.log 'lets replay from', frame
            @replayNeeded = frame
      else
        @commands.pushOrCreate @frame + 1, command
    
    getObjectById: (id, frame = @frame) ->
      @state.scene.objects[id]
