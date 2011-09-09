define (require) ->
  Scene = require('./scene')
  Serializable = require('./serializable')

  return class State extends Serializable
    __type: 'State'

    constructor: (@time, scene) ->
      super
      @scene = scene.clone()
    
    clone: (time = @time) ->
      new State time, @scene

    interpolate: (prevState, alpha) ->
      res = @clone()
      # console.log prevState
      prevScene = prevState.scene
      # console.log prevState, prevScene
      res.scene = @scene.interpolate(prevScene, alpha)
      return res

    getObjectById: (id) ->
      return @scene.objects[id]
