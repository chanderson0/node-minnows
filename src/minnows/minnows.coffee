define (require) ->
  Player = require('./player')
  PlayerView = require('./player_view')

  MouseCommand = require('./mouse_command')
  PositionCommand = require('./position_command')
  JoinCommand = require('./join_command')
  LeaveCommand = require('./leave_command')

  # CommandFactory = (data) ->
  #   switch data.type
  #     when 1    then data.__proto__ = MouseCommand.prototype
  #     when 2    then data.__proto__ = PositionCommand.prototype
  #     when 3    then data.__proto__ = JoinCommand.prototype
  #     when 4    then data.__proto__ = LeaveCommand.prototype
  #   return data

  {
    Player: Player,
    PlayerView: PlayerView,

    MouseCommand: MouseCommand,
    JoinCommand: JoinCommand,
    PositionCommand: PositionCommand,
    LeaveCommand: LeaveCommand,
    # CommandFactory: CommandFactory
  }