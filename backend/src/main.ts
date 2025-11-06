import { compileSimplicityContract } from './commands/compile-simplicity-contract';
import * as path from 'path';

export function main(): void {
  const contractPath = path.join(
    __dirname,
    './contracts/escrow_with_delay.simf',
  );
  console.log(`Computed contract path: ${contractPath}`);
  const contract = compileSimplicityContract(contractPath);
  console.log(`contrac result`, contract);
}

main();
