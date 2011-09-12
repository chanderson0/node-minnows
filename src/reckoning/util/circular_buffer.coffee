define (require) ->
  Serializable = require('../serializable')

  class CircularBuffer extends Serializable
    __type: 'CircularBuffer'

    constructor: (n) ->
      super
      @array = new Array(n)
      @min = n
      @length = 0

    get: (i) ->
      return undefined if i < 0 or i < @length - @array.length or i >= @length
      @array[i % @array.length]

    set: (i, v) ->
      if i < 0 or i < @length - @array.length
        console.log i, @min, @length
        throw Error

      while i > @length
        @array[@length % @array.length] = undefined
        @length++
        
      @array[i % @array.length] = v
      @length++  if i == @length

    getDefault: (i, def) ->
      val = @get(i)
      if not @get(i)? or @get(i) == undefined
        def
      else
        val

    pushOrCreate: (i, v) ->
      if i >= @length
        @set i, [ v ]
      else if @get(i)? and @get(i) != undefined
        @get(i).push v
      else
        @set i, [ v ]

    push: (v) ->
      @set @length, v

    firstIndex: ->
      Math.max @length - @min, 0

    last: ->
      @array[@length - 1]
