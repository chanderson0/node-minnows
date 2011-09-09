define (require) ->
  Serializable = require('./serializable')

  return class Scene extends Serializable
    __type: 'Scene'

    constructor: (objects) ->
      super

      @objects = {}
      for id, object of objects
        @objects[id] = object.clone()

    clone: () ->
      new Scene @objects
    
    tick: (dt) ->
      for id, object of @objects
        object.tick dt

      @consistency(dt)

    interpolate: (prevScene, alpha) ->
      res = new Scene()
      for id, object of @objects
        prev = prevScene.objects[id]
        if prev?
          res.objects[id] = object.interpolate prev, alpha
      return res

    consistency: (dt) ->
      # Override me!
