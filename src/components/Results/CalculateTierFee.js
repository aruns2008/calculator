const calculateTierFee = (
  accountValue,
  householdAUM,
  breakpoints,
  feePercentages
) => {
  
  let maxVal = Math.max(accountValue, householdAUM);
  let tierValues = [];
  let tierFees = [];
  let sumTierValues = 0;

  breakpoints.forEach((breakpoint, i) => {
    let tierValue = 0;
    if (i === 0) {
      tierValue = Math.min(breakpoint, (accountValue / maxVal) * breakpoint);
    } else {
      const remainingValue = accountValue - sumTierValues;
      if (remainingValue <= 0) {
        tierValue = 0; // No remaining account value to allocate
      } else if (i === breakpoints.length - 1) {
        // For the last tier, allocate all remaining account value
        tierValue = remainingValue;
      } else {
        // For intermediate tiers, calculate based on the remaining value and breakpoint
        tierValue = Math.min(
          remainingValue,
          (accountValue / maxVal) * breakpoint
        );
      }
    }
    sumTierValues += tierValue;
    tierValues.push(tierValue);
    tierFees.push(tierValue * (feePercentages[i] / 100));
  });

  let totalTierFee = tierFees.reduce((acc, fee) => acc + fee, 0);  
  return { tierValues, tierFees, totalTierFee };
  
};
export default calculateTierFee;

