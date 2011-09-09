define (require) -> 
  Command = require('../reckoning/command')

  # type = 1
  return class MouseCommand extends Command
    __type: 'MouseCommand'

    constructor: (@time, @id, @destx, @desty) ->
      super @time, @id

    apply: (scene) ->
      if scene.objects[@id]?
        scene.objects[@id].destx = @destx
        scene.objects[@id].desty = @desty

