import * as networks from 'liquidjs-lib/src/networks.js';
import * as address from 'liquidjs-lib/src/address.js';

import {
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

export function liquidService() {
  return {
    createPSET(input: CreatePSETInput): string {
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

      const internalKey = Buffer.from(
        '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0',
        'hex',
      );

      const cmr = Buffer.from(input.cmr, 'hex'); // Commitment Merkle Root for Simplicity
      updater.addInTapInternalKey(0, internalKey); // If key-spend or internal key needed
      updater.addInTapMerkleRoot(0, cmr); // For script-path with Simplicity CMR

      return pset.toBase64();
    },
  };
}
