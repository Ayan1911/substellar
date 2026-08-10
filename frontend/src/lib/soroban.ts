import { Contract, rpc, TransactionBuilder, Networks, xdr } from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

export const CONTRACT_ID =
  import.meta.env.VITE_SUBSTELLAR_CONTRACT_ID ||
  import.meta.env.VITE_SOROBAN_CONTRACT_ID ||
  'CD7KRXBIHVP7AKQXQFPEI5PBJFYWPTV3PWURSFRBVNLCQHMLNY3RKA7D';

export const STELLAR_NETWORK = import.meta.env.VITE_STELLAR_NETWORK || 'testnet';
export const RPC_URL = import.meta.env.VITE_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';

export const server = new rpc.Server(RPC_URL);

/**
 * Builds and signs a Soroban contract call transaction for SubStellar subscriptions
 */
export async function invokeSorobanContract(
  callerAddress: string,
  functionName: string,
  args: xdr.ScVal[] = []
) {
  try {
    const account = await server.getAccount(callerAddress);
    const contract = new Contract(CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(functionName, ...args))
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    const xdrString = preparedTx.toXDR();

    const signResult = await signTransaction(xdrString, {
      networkPassphrase: Networks.TESTNET,
      address: callerAddress,
    });

    if (signResult.error) {
      throw new Error(String(signResult.error));
    }

    const signedTx = TransactionBuilder.fromXDR(signResult.signedTxXdr, Networks.TESTNET);
    const sendResponse = await server.sendTransaction(signedTx);

    if (sendResponse.status === 'ERROR') {
      throw new Error(`Transaction failed simulation or submission: ${JSON.stringify(sendResponse.errorResult)}`);
    }

    return sendResponse;
  } catch (error: any) {
    console.error(`Error invoking Soroban function ${functionName}:`, error);
    throw error;
  }
}
