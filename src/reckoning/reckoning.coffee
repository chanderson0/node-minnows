define (require) ->
  Game: require('./game')
  GameObject: require('./game_object')
  Scene: require('./scene')
  State: require('./state')
  Command: require('./command')
  Player2D: require ('./player2d')

  Bless: require('./util/bless')
  CircularBuffer: require('./util/circular_buffer')