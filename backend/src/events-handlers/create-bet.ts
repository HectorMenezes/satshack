import { compileSimplicityContract } from '../commands/compile-simplicity-contract.js';
import { makeReplacePkPlaceholders } from '../contracts/helpers/replace-pk-placeholders.js';
import * as path from 'path';
import * as fs from 'fs';
import { liquidService } from '../services/liquid-service.js';
import { isOk } from '../lib/result.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createBetEventHandler(pubkyes: {
  CLIENT_ONE_PUBK: string;
  CLIENT_TWO_PUBK: string;
  ESCROW_PUBK: string;
}): void {
  const contractTemplatePath = path.join(
    __dirname,
    '../contracts/escrow_with_delay.template.simf',
  );

  const contractTemplate = fs.readFileSync(contractTemplatePath, {
    encoding: `utf-8`,
  });

  const replacePks = makeReplacePkPlaceholders(contractTemplate);

  const contractPath = path.join(
    __dirname,
    '../contracts/escrow_with_delay.simf',
  );

  fs.writeFileSync(
    contractPath,
    replacePks({
      clientOnePk: `0x${pubkyes.CLIENT_ONE_PUBK}`,
      clientTwoPk: `0x${pubkyes.CLIENT_TWO_PUBK}`,
      escrowPk: `0x${pubkyes.ESCROW_PUBK}`,
    }),
  );

  console.log(`Computed contract path: ${contractPath}`);
  const contract = compileSimplicityContract(contractPath);

  if (isOk(contract)) {
    liquidService().createPSET({
      cmr: contract.value.cmr,
      winnerAddress:
        'tex1pd2e4sk0yvnls5ad0rxgm9e7k3w543446wk4mrfv5lzusfh6snrhsazc5dq',
      txnIdClientOne:
        '070bc3c538c5c70587675171bdd8d476202e7ddeca398400d50b9be43b92b8df',
      txnIdClientTwo:
        '6be9bd65fb41a116a0fbfb9d6ba52ebb64ae8df652f1a2ba430668dada9f1ae5',
    });
  }

  console.log(`contrac result`, contract);
}
