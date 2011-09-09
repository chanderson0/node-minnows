define (require) ->
  Serializable = require('./serializable')

  return class GameObject extends Serializable
    __type: 'GameObject'

    constructor: () ->
      super
      # Override me!

    clone: ->
      new GameObject()

    tick: (dt) ->
      # Override me!

    interpolate: (prev, alpha) ->
      @clone()

    leave: ->
      # Override me!

  # toJSON: ->
  #   bless.serialize this