import * as networks from 'liquidjs-lib/src/networks';
import * as address from 'liquidjs-lib/src/address';
import {
  Creator as PsetCreator,
  Updater as PsetUpdater,
  CreatorInput,
  CreatorOutput,
} from 'liquidjs-lib/src/psetv2';

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

      // Example outputs similar to your bash script:
      // - Send a specific amount to a destination address
      // - Explicit fee output (Liquid requires explicit fee outputs)
      // Adjust amounts, addresses, and assets as needed

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

      // If you need to update with additional data (e.g., witness UTXOs, sighash types),
      // use PsetUpdater. This is similar to adding UTXO data in your bash example.
      // For a full transaction, you'd fetch UTXO details (witnessUtxo, etc.) and add them here.
      // Example (assuming you have fetched data; replace with actual values):

      const updater = new PsetUpdater(pset);

      // For Simplicity/Taproot (as in your bash example), add CMR and internal key if needed.
      // Example for Taproot script-path input (adjust index):
      const internalKey = Buffer.from(
        '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0',
        'hex',
      );

      const cmr = Buffer.from(input.cmr, 'hex'); // Commitment Merkle Root for Simplicity
      updater.addInTapInternalKey(0, internalKey); // If key-spend or internal key needed
      updater.addInTapMerkleRoot(0, cmr); // For script-path with Simplicity CMR

      // Return the PSET (base64 encoded, as in elements-cli)
      return pset.toBase64();
    },
  };
}
