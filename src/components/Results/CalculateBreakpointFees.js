const calculateBreakpointFees = (
  accountValue,
  householdAUM,
  tiers,
  feePercentages
) => {
  let results = tiers.map(() => ({ valueInBreakpoint: 0, fee: 0 }));
  let cumulativeTierValue = 0;
  let tierPlaced = false;

  for (let i = 0; i < tiers.length; i++) {
    cumulativeTierValue += tiers[i];

    if (!tierPlaced && accountValue <= cumulativeTierValue) {
      results[i].valueInBreakpoint = accountValue;
      results[i].fee = accountValue * (feePercentages[i] / 100);
      tierPlaced = true;
    }
  }

  if (!tierPlaced) {
    let lastTierIndex = tiers.length - 1;
    results[lastTierIndex].valueInBreakpoint = accountValue;
    results[lastTierIndex].fee =
      accountValue * (feePercentages[lastTierIndex] / 100);
  }

  return results.filter(
    (result) => result.valueInBreakpoint > 0 || result.fee > 0
  );
};

export default calculateBreakpointFees;
