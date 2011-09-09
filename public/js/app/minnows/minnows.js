define(function(require) {
  var JoinCommand, LeaveCommand, MouseCommand, Player, PlayerView, PositionCommand;
  Player = require('./player');
  PlayerView = require('./player_view');
  MouseCommand = require('./mouse_command');
  PositionCommand = require('./position_command');
  JoinCommand = require('./join_command');
  LeaveCommand = require('./leave_command');
  return {
    Player: Player,
    PlayerView: PlayerView,
    MouseCommand: MouseCommand,
    JoinCommand: JoinCommand,
    PositionCommand: PositionCommand,
    LeaveCommand: LeaveCommand
  };
});