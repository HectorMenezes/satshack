import { compileSimplicityContract } from './commands/compile-simplicity-contract.js';
import { makeReplacePkPlaceholders } from './contracts/helpers/replace-pk-placeholders.js';
import * as path from 'path';
import * as fs from 'fs';
import * as liquidService from '../src/services/liquid-service.js';
import { isOk } from './lib/result.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ONE_PK =
  '0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'; // 1 * G
const CLIENT_TWO_PK =
  '0xc6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5'; // 2 * G
const ESCROW_PK =
  '0xf9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9'; // 3 * G

export async function main(): Promise<void> {
  const contractTemplatePath = path.join(
    __dirname,
    './contracts/escrow_with_delay.template.simf',
  );

  const contractTemplate = fs.readFileSync(contractTemplatePath, {
    encoding: `utf-8`,
  });

  const replacePks = makeReplacePkPlaceholders(contractTemplate);

  const contractPath = path.join(
    __dirname,
    './contracts/escrow_with_delay.simf',
  );

  fs.writeFileSync(
    contractPath,
    replacePks({
      clientOnePk: CLIENT_ONE_PK,
      clientTwoPk: CLIENT_TWO_PK,
      escrowPk: ESCROW_PK,
    }),
  );

  console.log(`Computed contract path: ${contractPath}`);
  const contract = compileSimplicityContract(contractPath);

  if (isOk(contract)) {
    const hex = await  liquidService.createPSET({
      cmr: contract.value.cmr,
      winnerAddress:
        'tex1pd2e4sk0yvnls5ad0rxgm9e7k3w543446wk4mrfv5lzusfh6snrhsazc5dq',
      txnIdClientOne:
        '070bc3c538c5c70587675171bdd8d476202e7ddeca398400d50b9be43b92b8df',
      txnIdClientTwo:
        '6be9bd65fb41a116a0fbfb9d6ba52ebb64ae8df652f1a2ba430668dada9f1ae5',
      programHex: contract.value.programHex,
      signers: [],
    });
    console.log(`hex: `, hex);
    liquidService.broadcastTransaction(hex);
  }

  console.log(`contrac result`, contract);
}

main();
