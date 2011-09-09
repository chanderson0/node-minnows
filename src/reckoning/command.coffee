define (require) ->
  Serializable = require('./serializable')

  return class Command extends Serializable
    __type: 'Command'

    constructor: (@time, @id) ->
      super
      # Override me!

    apply: (scene) ->
      # Override me!
