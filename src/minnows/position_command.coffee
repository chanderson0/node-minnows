define (require) ->  
  Command = require('../reckoning/command')

  # type = 2
  return class PositionCommand extends Command
    __type: 'PositionCommand'

    constructor: (@time, @id, @x, @y, @vx, @vy) ->
      super @time, @id
    
    apply: (scene) ->
      if scene.objects[@id]?
        obj = scene.objects[@id]
        obj.x  = @x
        obj.y  = @y
        obj.vx = @vx
        obj.vy = @vy


    # @unserialize: (data) ->
    #   new _Class data.time, data.id, data.pos, data.vel