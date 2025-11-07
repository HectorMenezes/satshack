import * as networks from 'liquidjs-lib/src/networks.js';
import * as address from 'liquidjs-lib/src/address.js';
import { Transaction } from 'liquidjs-lib/src/transaction.js';

import {
  Finalizer as PsetFinalizer,
  Extractor as PsetExtractor,
  Creator as PsetCreator,
  Updater as PsetUpdater,
  CreatorInput,
  CreatorOutput,
} from 'liquidjs-lib/src/psetv2/index.js';

// Use the appropriate network (e.g., testnet for Liquid testnet)
const NETWORK = networks.testnet; // or networks.regtest for local testing
const L_BTC = NETWORK.assetHash; // Liquid Bitcoin asset hash

type CreatePSETInput = {
  txnIdClientOne: string;
  txnIdClientTwo: string;
  cmr: string;
  winnerAddress: string;
};

import axios from 'axios';

export async function broadcastTransaction(psetBase64: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://blockstream.info/liquidtestnet/api/tx',
      psetBase64,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      },
    );

    const result = response.data;
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw error;
  }
}

export const createPSET = (input: CreatePSETInput): string => {
  // Assume vout 0 for both inputs; adjust if needed based on actual UTXOs
  const inputs: CreatorInput[] = [
    new CreatorInput(input.txnIdClientOne, 0),
    new CreatorInput(input.txnIdClientTwo, 0),
  ];

  const sendAmount = 99900; // 99,900 sats (0.000999 BTC)
  const feeAmount = 100; // 100 sats fee
  const outputs: CreatorOutput[] = [
    new CreatorOutput(
      L_BTC,
      sendAmount,
      address.toOutputScript(input.winnerAddress, NETWORK),
    ),
    new CreatorOutput(L_BTC, feeAmount), // Explicit fee output (no script)
  ];

  // Create the base PSET with inputs and outputs
  const pset = PsetCreator.newPset({
    inputs,
    outputs,
  });
  const updater = new PsetUpdater(pset);

  updater.addInSighashType(0, Transaction.SIGHASH_ALL);
  updater.addInSighashType(1, Transaction.SIGHASH_ALL);

  const internalKey = Buffer.from(
    '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0',
    'hex',
  );

  const cmr = Buffer.from(input.cmr, 'hex'); // Commitment Merkle Root for Simplicity
  updater.addInTapInternalKey(0, internalKey); // If key-spend or internal key needed
  updater.addInTapMerkleRoot(0, cmr); // For script-path with Simplicity CMR

  const finalizer = new PsetFinalizer(pset);
  finalizer.finalize();
  const tx = PsetExtractor.extract(pset);
  const hex = tx.toHex();
  return hex
};
