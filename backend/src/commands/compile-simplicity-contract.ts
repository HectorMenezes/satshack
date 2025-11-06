<<<<<<< HEAD
import * as shell from 'shelljs';
import { Result } from '../../src/lib/result';
=======
import shell from 'shelljs';
>>>>>>> main

type ContractInfo = {
  cmr: string;
  liquidTestNetAddressUnconf: string;
};

export function compileSimplicityContract(
  contractPath: string,
): Result<ContractInfo> {
  const compileResult = shell.exec(`simc ${contractPath}`, { silent: true });
  if (compileResult.code !== 0) {
    return { ok: false, error: `Compilation failed: ${compileResult.stderr}` };
  }

  const outputLines = compileResult.stdout.trim().split('\n');
  const cmr = outputLines[outputLines.length - 1].trim();

  if (!cmr) {
    return {
      ok: false,
      error: 'Failed to extract compiled program from output',
    };
  }

  const infoResult = shell.exec(
<<<<<<< HEAD
    `hal-simplicity simplicity simplicity info "${cmr}"`,
=======
    `hal-simplicity simplicity info "${base64Contract}"`,
>>>>>>> main
    { silent: true },
  );
  if (infoResult.code !== 0) {
    return {
      ok: false,
      error: `Failed to get contract info: ${infoResult.stderr}`,
    };
  }

  try {
    const contractInfo = JSON.parse(infoResult.stdout.trim());
    const liquidTestNetAddressUnconf =
      contractInfo.liquid_testnet_address_unconf;
    if (!liquidTestNetAddressUnconf) {
      return {
        ok: false,
        error: 'liquid_testnet_address_unconf not found in contract info',
      };
    }

    return {
      ok: true,
      value: {
        cmr,
        liquidTestNetAddressUnconf,
      },
    };
  } catch (parseError) {
    return {
      ok: false,
      error: `Failed to parse contract info JSON: ${(parseError as Error).message}`,
    };
  }
}
