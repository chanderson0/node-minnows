define (require) ->
  Command = require('../reckoning/command')
  
  # type = 4
  return class LeaveCommand extends Command
    __type: 'LeaveCommand'

    constructor: (@time, @id) ->
      super @time, @id
    
    apply: (scene) ->
      if scene.objects[@id]?
        scene.objects[@id].leave()
        delete scene.objects[@id]
