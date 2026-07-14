export type CausalLedgerEntry = { id:string; cause:string; effect:string; countereffect?:string; publicSafe:boolean };
export const causalLedger: CausalLedgerEntry[] = [];
