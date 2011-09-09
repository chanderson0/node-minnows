define ->
  
  deserialize = (object, prototypes) ->
    if object? and typeof object == 'object'
      if object.__type?
        object.__proto__ = prototypes[object.__type].prototype
      
      for key, value of object
        if typeof value == 'object'
          deserialize(value, prototypes)

  {
    deserialize: deserialize
  }
