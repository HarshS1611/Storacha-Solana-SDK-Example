declare module 'sdk' {
  export interface ClientConfig {
    environment: 'mainnet-beta' | 'testnet' | 'devnet';
  }

  export class Client {
    constructor(config?: ClientConfig);
    createDeposit(params: CreateDepositArgs): Promise<Transaction>;
  }

  export interface CreateDepositArgs {
    payer: PublicKey;
    file: File;
    durationDays: number;
  }
    
}