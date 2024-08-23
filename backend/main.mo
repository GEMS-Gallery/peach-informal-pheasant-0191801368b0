import Int "mo:base/Int";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

actor {
  // Type definitions
  type Player = {
    var lifeTotal: Int;
    commanderDamage: [var Int];
    var poisonCounters: Int;
  };

  type GameState = {
    players: [var Player];
  };

  // Stable variable to store game state
  stable var gameState: ?GameState = null;

  // Initialize game state
  func initGameState(): GameState {
    {
      players = Array.tabulateVar<Player>(4, func(i: Nat) {
        {
          var lifeTotal = 40;
          commanderDamage = Array.tabulateVar<Int>(4, func(j: Nat) { 0 });
          var poisonCounters = 0;
        }
      });
    }
  };

  // Helper function to ensure game state is initialized
  func ensureGameState(): GameState {
    switch (gameState) {
      case (null) {
        let newState = initGameState();
        gameState := ?newState;
        newState
      };
      case (?state) { state };
    }
  };

  // Update life total
  public func updateLifeTotal(playerId: Nat, change: Int): async () {
    let state = ensureGameState();
    if (playerId < 4) {
      state.players[playerId].lifeTotal := state.players[playerId].lifeTotal + change;
    };
  };

  // Update commander damage
  public func updateCommanderDamage(playerId: Nat, opponentId: Nat, change: Int): async () {
    let state = ensureGameState();
    if (playerId < 4 and opponentId < 4 and playerId != opponentId) {
      state.players[playerId].commanderDamage[opponentId] := state.players[playerId].commanderDamage[opponentId] + change;
    };
  };

  // Update poison counters
  public func updatePoisonCounters(playerId: Nat, change: Int): async () {
    let state = ensureGameState();
    if (playerId < 4) {
      state.players[playerId].poisonCounters := state.players[playerId].poisonCounters + change;
    };
  };

  // Get game state
  public query func getGameState(): async Text {
    let state = ensureGameState();
    var result = "";
    for (i in state.players.keys()) {
      let player = state.players[i];
      result #= "Player " # Nat.toText(i + 1) # ": ";
      result #= "Life=" # Int.toText(player.lifeTotal) # ", ";
      result #= "Poison=" # Int.toText(player.poisonCounters) # ", ";
      result #= "CMD Damage=[";
      for (j in player.commanderDamage.keys()) {
        if (j > 0) { result #= "," };
        result #= Int.toText(player.commanderDamage[j]);
      };
      result #= "]\n";
    };
    result
  };

  // Reset game
  public func resetGame(): async () {
    gameState := ?initGameState();
  };

  // System functions for upgrades
  system func preupgrade() {
    // gameState is already in stable storage
  };

  system func postupgrade() {
    // gameState is already restored from stable storage
  };
}