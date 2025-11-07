import { type Result } from '../../src/lib/result.js';
import shell from 'shelljs';

type ContractInfo = {
  cmr: string;
  liquidTestNetAddressUnconf: string;
  programHex: string;
};

export function compileSimplicityContract(
  contractPath: string,
): Result<ContractInfo> {
  const compileResult = shell.exec(`simc ${contractPath}`, { silent: true });
  if (compileResult.code !== 0) {
    return { ok: false, error: `Compilation failed: ${compileResult.stderr}` };
  }

  const inputProgram = compileResult.stdout
    .replace('Program:', '')
    .replace(/\n/g, '')
    .trim();
  if (!inputProgram) {
    return {
      ok: false,
      error:
        'Failed to compile Simplicity program: simc returned an empty output',
    };
  }

  const infoResult = shell.exec(
    `hal-simplicity simplicity info --liquid "${inputProgram}"`,
    {
      silent: true,
    },
  );
  if (infoResult.code !== 0) {
    console.error('hal-simplicity error:', infoResult.stderr);
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

    const cmr = contractInfo.cmr; // Assuming the CMR field is named 'cmr' in the JSON output
    if (!cmr) {
      return {
        ok: false,
        error: 'CMR not found in contract info',
      };
    }

    const buffer = Buffer.from(inputProgram, 'base64');
    const programHex = buffer.toString('hex');

    return {
      ok: true,
      value: {
        cmr,
        liquidTestNetAddressUnconf,
        programHex,
      },
    };
  } catch (parseError) {
    return {
      ok: false,
      error: `Failed to parse contract info JSON: ${(parseError as Error).message}`,
    };
  }
}
