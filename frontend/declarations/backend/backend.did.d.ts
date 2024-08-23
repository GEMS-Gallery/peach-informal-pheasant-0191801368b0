import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getGameState' : ActorMethod<[], string>,
  'resetGame' : ActorMethod<[], undefined>,
  'updateCommanderDamage' : ActorMethod<[bigint, bigint, bigint], undefined>,
  'updateLifeTotal' : ActorMethod<[bigint, bigint], undefined>,
  'updatePoisonCounters' : ActorMethod<[bigint, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
