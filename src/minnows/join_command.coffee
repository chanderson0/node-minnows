define (require) ->
  Command = require('../reckoning/command')

  # type = 3
  return class JoinCommand extends Command
    __type: 'JoinCommand'

    constructor: (@time, @id, @player) ->
      super @time, @id
    
    apply: (scene) ->
      scene.objects[@id] = @player

    # @unserialize: (data) ->
    #   new _Class data.time, data.id, data.player