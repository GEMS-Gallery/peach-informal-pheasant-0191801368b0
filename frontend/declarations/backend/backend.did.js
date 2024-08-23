export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getGameState' : IDL.Func([], [IDL.Text], ['query']),
    'resetGame' : IDL.Func([], [], []),
    'updateCommanderDamage' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Int], [], []),
    'updateLifeTotal' : IDL.Func([IDL.Nat, IDL.Int], [], []),
    'updatePoisonCounters' : IDL.Func([IDL.Nat, IDL.Int], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
