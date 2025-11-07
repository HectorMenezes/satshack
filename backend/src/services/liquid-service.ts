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
  programHex: string;
};

import axios from 'axios';

// Function to serialize witness stack into a single Buffer
function serializeWitnessStack(stack: Buffer[]): Buffer {
  // Serialize according to Bitcoin witness format:
  // - Number of elements (varint)
  // - For each element: length (varint) + data
  const buffers: Buffer[] = [];

  // Write number of elements as varint
  const count = stack.length;
  if (count < 0xfd) {
    buffers.push(Buffer.from([count]));
  } else if (count <= 0xffff) {
    buffers.push(Buffer.from([0xfd, count & 0xff, (count >> 8) & 0xff]));
  } else {
    throw new Error('Witness stack too large');
  }

  // Write each element: length (varint) + data
  stack.forEach((item) => {
    const len = item.length;
    if (len < 0xfd) {
      buffers.push(Buffer.from([len]));
    } else if (len <= 0xffff) {
      buffers.push(Buffer.from([0xfd, len & 0xff, (len >> 8) & 0xff]));
    } else {
      throw new Error('Witness element too large');
    }
    buffers.push(item);
  });

  return Buffer.concat(buffers);
}

export async function broadcastTransaction(
  psetBase64: string,
): Promise<string> {
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

  // Add witness data (script_witness: ["", programHex, cmr, controlBlock])
  const witnessStack: Buffer[] = [
	      Buffer.from(''), // Empty first element
	          Buffer.from(input.programHex, 'hex'), // Simplicity program
		      Buffer.from(input.cmr, 'hex'), // Commitment Merkle Root
		          Buffer.from('bef5919fa64ce45f8306849072b26c1bfdd2937e6b81774796ff372bd1eb5362d2', 'hex'), // Control block
			    ];
          const serializedWitness = serializeWitnessStack(witnessStack);
  updater.addInWitnessScript(0, serializedWitness);

  const finalizer = new PsetFinalizer(pset);
  console.log(`pset`, pset);
  finalizer.finalize();
  const tx = PsetExtractor.extract(pset);
  console.log(`tx`, tx);
  const hex = tx.toHex();
  return hex;
};
