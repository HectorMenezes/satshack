import shell from 'shelljs';

type ContractInfo = {
  base64Contract: string;
  liquidTestNetAddressUnconf: string;
};

type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

export function compileSimplicityContract(
  contractPath: string,
): Result<ContractInfo> {
  const compileResult = shell.exec(`simc ${contractPath}`, { silent: true });
  if (compileResult.code !== 0) {
    return { ok: false, error: `Compilation failed: ${compileResult.stderr}` };
  }

  const outputLines = compileResult.stdout.trim().split('\n');
  const base64Contract = outputLines[outputLines.length - 1].trim();

  if (!base64Contract) {
    return {
      ok: false,
      error: 'Failed to extract compiled program from output',
    };
  }

  console.log(base64Contract);

  const infoResult = shell.exec(
    `hal-simplicity simplicity info "${base64Contract}"`,
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
        base64Contract,
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
