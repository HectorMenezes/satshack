export const makeReplacePkPlaceholders =
  (contract: string) =>
  ({
    clientOnePk,
    clientTwoPk,
    escrowPk,
  }: {
    clientOnePk: string;
    clientTwoPk: string;
    escrowPk: string;
  }): string => {
    return contract
      .replace('${CLIENT_ONE_PK}', clientOnePk)
      .replace('${CLIENT_TWO_PK}', clientTwoPk)
      .replace('${ESCROW_PK}', escrowPk);
  };
