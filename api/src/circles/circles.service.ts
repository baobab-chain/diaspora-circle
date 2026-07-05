import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Contract,
  Keypair,
  rpc,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';

/**
 * Wraps calls to the DiasporaCircle Soroban contract over RPC.
 *
 * IMPORTANT — this service signs transactions server-side using a single
 * admin/service keypair, which is fine for a testnet demo but is NOT how
 * this should work in production. In a real deployment, `contribute`
 * should be signed client-side by the member's own wallet (Freighter,
 * xBull, etc.) and this API should only ever *submit* an already-signed
 * transaction, never hold member funds' signing authority itself.
 * Tracked in ISSUES.md as a follow-up.
 */
@Injectable()
export class CirclesService {
  private readonly logger = new Logger(CirclesService.name);
  private readonly server: rpc.Server;
  private readonly contractId: string;
  private readonly networkPassphrase: string;
  private readonly serviceKeypair: Keypair;

  constructor(private readonly config: ConfigService) {
    this.server = new rpc.Server(
      this.config.get<string>('SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'),
    );
    this.contractId = this.config.getOrThrow<string>('CONTRACT_ID');
    this.networkPassphrase = this.config.get<string>(
      'NETWORK_PASSPHRASE',
      Networks.TESTNET,
    );
    const secret = this.config.getOrThrow<string>('SERVICE_ACCOUNT_SECRET');
    this.serviceKeypair = Keypair.fromSecret(secret);
  }

  private async invoke(method: string, args: ReturnType<typeof nativeToScVal>[]) {
    const contract = new Contract(this.contractId);
    const account = await this.server.getAccount(this.serviceKeypair.publicKey());

    let tx = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    tx = await this.server.prepareTransaction(tx);
    tx.sign(this.serviceKeypair);

    const result = await this.server.sendTransaction(tx);

    if (result.status === 'ERROR') {
      this.logger.error(`Contract call ${method} failed`, result.errorResult);
      throw new Error(`Contract call ${method} failed`);
    }

    return this.pollForResult(result.hash);
  }

  private async pollForResult(hash: string) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const tx = await this.server.getTransaction(hash);
      if (tx.status === 'SUCCESS') {
        return tx.returnValue ? scValToNative(tx.returnValue) : null;
      }
      if (tx.status === 'FAILED') {
        throw new Error(`Transaction ${hash} failed`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error(`Timed out waiting for transaction ${hash}`);
  }

  async createCircle(tokenContractId: string, contributionAmount: number, memberAddresses: string[]) {
    return this.invoke('create_circle', [
      nativeToScVal(this.serviceKeypair.publicKey(), { type: 'address' }),
      nativeToScVal(tokenContractId, { type: 'address' }),
      nativeToScVal(contributionAmount, { type: 'i128' }),
      nativeToScVal(memberAddresses, { type: 'address' }),
    ]);
  }

  async contribute(circleId: number, memberAddress: string) {
    // NOTE: as written this still signs with the service key, which only
    // works if the "member" is the service account itself. Real member
    // contributions need the client-signed flow described above.
    return this.invoke('contribute', [
      nativeToScVal(circleId, { type: 'u32' }),
      nativeToScVal(memberAddress, { type: 'address' }),
    ]);
  }

  async closeRound(circleId: number) {
    return this.invoke('close_round', [nativeToScVal(circleId, { type: 'u32' })]);
  }

  async getCircle(circleId: number) {
    return this.invoke('get_circle', [nativeToScVal(circleId, { type: 'u32' })]);
  }
}
