declare module 'solana-storacha-sdk' {
    import { PublicKey, Transaction } from '@solana/web3.js';
  
    export interface CreateDepositArgs {
      cid: string;
      size: number;
      duration: number;
      payer: PublicKey;
      connection: import('@solana/web3.js').Connection;
      depositAmount: number;
      apiUrl: string;
    }
  
    /**
     * Calls the deposit API for on-chain storage and returns a Transaction
     * which must be signed and sent externally by the user.
     */
    export function createDepositTxn(
      args: CreateDepositArgs
    ): Promise<Transaction>;
  
    export interface ClientOptions {
      rpcUrl: string;
      serverUrl: string;
    }
  
    export interface DepositParams {
      payer: PublicKey;
      cid: string;
      size: number;
      durationDays: number;
      depositAmount: number;
    }
  
    export class Client {
      constructor(options: ClientOptions);
  
      /**
       * Creates a deposit transaction ready to be signed & sent by user's wallet.
       */
      createDeposit(params: DepositParams): Promise<Transaction>;
    }
  }
  