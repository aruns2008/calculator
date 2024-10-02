import React, { useEffect, useState } from "react";
import "./YourEstimatedResults.css"; // Create this CSS file for styling
import calculateBreakpointFees from "./CalculateBreakpointFees";
import calculateProgramFee from "./CalculateProgramFee";
import calculateTierFee from "./CalculateTierFee";
import { useCalculationStorage } from "../../context/StorageContext";
import { Co2Sharp } from "@mui/icons-material";
const YourEstimatedResults = ({
  handleChange,
  getCalculationDataValue,
  setCalculationData,
  calculationData,
}) => {
  const {
    programFeeValues,
    setProgramFeeValues,
    strategistFeeValues,
    setStrategistFeeValues,
    totalAccountFeeValues,
    setTotalAccountFeeValues,
    totalClientFeeValues,
    setTotalClientFeeValues,
    grossAnnualFeeValues,
    setgrossAnnualFeeValues,
    netAnnualFeeValues,
    setNetAnnualFeeValues,
    fpValues,
    setFpValues,
    accountValue,
    setAccountValue,
    fundExpenses,
    setFundExpenses,
    fpPayout,
    setFpPayout,
    houseHoldValue,
    setHouseHoldValue,
    feeType,
    setFeeType,
    programFee,
    setProgramFee,
    index,
    setIndex,
  } = useCalculationStorage();
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("total-account-fees");

  const strategistFeeCaap =
    getCalculationDataValue("strategistFeeCaap")[index] || "";
  const strategistFeeCaapSmallAccount =
    getCalculationDataValue("strategistFeeCaapSmallAccount")[index] || "";

  const updateStateAtIndex = (setter, value) => {
    setter((prev) => {
      // Create a copy of the previous state
      const updated = [...prev];

      // Check if the index is within the bounds of the current state array
      if (index >= updated.length) {
        // Extend the array to include the new index
        if (typeof value === "object") {
          updated.push(
            ...Array(index - updated.length + 1).fill({
              rate: "",
              price: "N/A",
            })
          );
        } else if (typeof value === "string") {
          updated.push(...Array(index - updated.length + 1).fill(""));
        }
      }

      // Update the specified index with the new value
      updated[index] = value;

      return updated;
    });
  };
  useEffect(() => {
    const fpFeeType = getCalculationDataValue("FPfeeType")[index] || "";
    const accountValue =
      parseFloat(calculationData["account-value"][index]) || 0;
    const programType = getCalculationDataValue("paymentOption")[index] || "";
    const teamDirectedInput =
      parseFloat(getCalculationDataValue("teamDirectedInput")[index]) || 0;
    const AUADiscount =
      getCalculationDataValue("AdditionalDetails")[index]?.auaDiscount || 0;
    const UmaSmaStrategistFee =
      getCalculationDataValue("UMA-SMA-Strategist-Fee")[index] || [];
    const programOption = getCalculationDataValue("programOption")[index] || "";
    const householdAUM =
      getCalculationDataValue("AdditionalDetails")[index]?.houseHoldValue || 0;
    const fundExp =
      getCalculationDataValue("AdditionalDetails")[index]?.fundExpenses || 0;
    const fpPayout = parseFloat(
      getCalculationDataValue("AdditionalDetails")[index]?.fpPayOut || 0
    );

    // When updating, specify the index and the new value object
    updateStateAtIndex(setAccountValue, { rate: 0, price: accountValue });
    updateStateAtIndex(setFundExpenses, { rate: fundExp, price: "N/A" });
    updateStateAtIndex(setFpPayout, { rate: fpPayout, price: "N/A" });
    updateStateAtIndex(setHouseHoldValue, { rate: householdAUM, price: "N/A" });

    const mapFeeType = (type, mappings) => {
      return mappings[type] || "N/A";
    };

    const programTypeMappings = {
      "advisor-directed": "Advisor Directed",
      caap: "CAAP",
      "caap-small-account": "CAAP Small Account Solutions",
      "team-directed": "Team Directed",
      "uma-sma": "UMA/SMA",
    };

    const fpFeeTypeMappings = {
      breakpoint: "Breakpoint",
      tier: "Tier",
      fixed: "Fixed",
      flat: "Flat",
    };

    if (programType) {
      const feeType = mapFeeType(programType, programTypeMappings);
      updateStateAtIndex(setProgramFee, feeType);
      // setProgramFee(feeType);
    }

    if (fpFeeType) {
      const feeType = mapFeeType(fpFeeType, fpFeeTypeMappings);
      updateStateAtIndex(setFeeType, feeType);
      // setFeeType(feeType);
    }

    if (fpFeeType === "flat") {
      const rate = parseFloat(calculationData.FPfeeFlat[index]?.amount) || 0;
      const FPfeeFlat = accountValue !== 0 ? (rate / 100) * accountValue : 0;
      updateStateAtIndex(setFpValues, {
        rate: rate.toFixed(4),
        price: FPfeeFlat.toFixed(2),
      });
    } else if (fpFeeType === "fixed") {
      const price = parseFloat(calculationData.FPfeeFixed[index]?.amount) || 0;
      const fpFeeFixedAmount =
        accountValue !== 0 ? (price / accountValue) * 100 : 0;

      updateStateAtIndex(setFpValues, {
        rate: fpFeeFixedAmount.toFixed(4),
        price: price.toFixed(2),
      });
    } else if (fpFeeType === "breakpoint") {
      const FPfeeBreakPoints = calculationData["FPfeeBreakPoints"][index];
      const breakpoints = [];
      const feePercentages = [];

      if (FPfeeBreakPoints) {
        Object.values(FPfeeBreakPoints).forEach((breakpoint) => {
          breakpoints.push(parseFloat(breakpoint.amount || 0));
          feePercentages.push(parseFloat(breakpoint.percentage || 0));
        });
      }

      if (breakpoints.length > 0 && feePercentages.length > 0 && accountValue) {
        const results = calculateBreakpointFees(
          accountValue,
          householdAUM,
          breakpoints,
          feePercentages
        );
        if (results.length > 0 && accountValue) {
          const totalFee = results[0].fee;
          const rate = (totalFee / accountValue) * 100;
          const price = totalFee;
          updateStateAtIndex(setFpValues, {
            rate: rate.toFixed(4),
            price: price.toFixed(2),
          });
        }
      }
    } else if (fpFeeType === "tier") {
      const FPfeeTiers = calculationData["FPfeeTiers"][index];
      const tiers = [];
      const feePercentages = [];

      if (FPfeeTiers) {
        Object.values(FPfeeTiers).forEach((tier) => {
          tiers.push(parseFloat(tier.amount || 0));
          feePercentages.push(parseFloat(tier.percentage || 0));
        });
      }
      if (tiers.length > 0 && feePercentages.length > 0 && accountValue) {
        const results = calculateTierFee(
          accountValue,
          householdAUM,
          tiers,
          feePercentages
        );
        if (results?.totalTierFee > 0 && accountValue) {
          const totalFee = results?.totalTierFee;
          const rate = (totalFee / accountValue) * 100;
          const price = totalFee;
          updateStateAtIndex(setFpValues, {
            rate: rate.toFixed(2),
            price: price.toFixed(4),
          });
        }
      }
    }

    if (programType && AUADiscount) {
      const pType = AUADiscount.replace(/%$/, "");
      const results = calculateProgramFee(accountValue, 0, programType, pType);

      // Validate results
      if (Array.isArray(results)) {
        // Assuming results is an array of numbers
        let totalRate = 0;
        results.forEach((result) => {
          totalRate += result;
        });
        const roundedTotalRate = Math.ceil(totalRate);
        const rate = (roundedTotalRate / accountValue) * 100;

        updateStateAtIndex(setProgramFeeValues, {
          rate: isNaN(rate) ? "N/A" : rate.toFixed(4),
          price: roundedTotalRate.toFixed(2),
        });
      }
    }
    if (teamDirectedInput) {
      const price = (teamDirectedInput / 100) * accountValue;

      updateStateAtIndex(setStrategistFeeValues, {
        rate: teamDirectedInput.toFixed(4),
        price: price.toFixed(2),
      });
    }
    if (programType === "caap") {
      if (
        strategistFeeCaap &&
        Object.keys(strategistFeeCaap).length !== 0 &&
        accountValue !== 0 &&
        accountValue !== ""
      ) {
        const percentageValue = strategistFeeCaap.value;
        const price =
          percentageValue !== 0 ? (percentageValue / 100) * accountValue : 0;

        updateStateAtIndex(setStrategistFeeValues, {
          rate: percentageValue.toFixed(4),
          price: price.toFixed(2),
        });
      }
    } else if (programType === "caap-small-account") {
      if (
        strategistFeeCaapSmallAccount &&
        Object.keys(strategistFeeCaapSmallAccount).length !== 0 &&
        accountValue !== 0
      ) {
        const percentageValue = strategistFeeCaapSmallAccount.value;
        const price =
          percentageValue !== 0 ? (percentageValue / 100) * accountValue : 0;

        updateStateAtIndex(setStrategistFeeValues, {
          rate: percentageValue.toFixed(4),
          price: price.toFixed(2),
        });
      }
    } else if (programType === "uma-sma") {
      const calculationData =
        getCalculationDataValue("UMA-SMA-Strategist-Fee")[index] || "";
      const sumResult = calculateTotal(calculationData);
      let dollarValue = 0;
      if (accountValue && accountValue !== 0) {
        dollarValue = (sumResult / 100) * accountValue;
        dollarValue = parseFloat(dollarValue.toFixed(2));
      }

      updateStateAtIndex(setStrategistFeeValues, {
        rate: parseFloat(sumResult).toFixed(4),
        price: dollarValue.toFixed(2) || 0,
      });
    }
  }, [calculationData]);

  useEffect(() => {
    const programOption = getCalculationDataValue("programOption")[index] || "";
    const accountValue =
      parseFloat(calculationData["account-value"][index]) || 0;
    const fundExpences =
      parseFloat(
        getCalculationDataValue("AdditionalDetails")[index]?.fundExpenses
      ) || 0;
    const fpPayout = parseFloat(
      getCalculationDataValue("AdditionalDetails")[index]?.fpPayOut || 0
    );
    // Calculate the total fee whenever the relevant fee states change
    if (programOption) {
      let totalAccountFee = 0;
      let netAnnualFee = 0;
      if (programOption === "fp") {
        totalAccountFee =
          parseFloat(fpValues[index]?.rate || 0) +
          parseFloat(strategistFeeValues[index]?.rate || 0);

        //Annual Fee

        netAnnualFee =
          parseFloat(fpValues[index]?.price || 0) -
          parseFloat(programFeeValues[index]?.price || 0);
      } else if (programOption === "client") {
        totalAccountFee =
          parseFloat(fpValues[index]?.rate || 0) +
          parseFloat(programFeeValues[index]?.rate || 0) +
          parseFloat(strategistFeeValues[index]?.rate || 0);
        //Annual Fee

        netAnnualFee = parseFloat(fpValues[index]?.price || 0);
      }
      let dollerValue = (totalAccountFee / 100) * accountValue;

      updateStateAtIndex(setTotalAccountFeeValues, {
        rate: isNaN(totalAccountFee) ? "N/A" : totalAccountFee.toFixed(4),
        price: isNaN(dollerValue) ? "N/A" : dollerValue.toFixed(2),
      });
      let percentageValue = (netAnnualFee / accountValue) * 100;

      updateStateAtIndex(setNetAnnualFeeValues, {
        rate:
          isNaN(percentageValue) || percentageValue === Infinity
            ? "N/A"
            : percentageValue.toFixed(4),
        price: isNaN(netAnnualFee) ? "N/A" : netAnnualFee.toFixed(2),
      });
    }
    const totalClientFees =
      parseFloat(fpValues[index]?.rate || 0) +
      parseFloat(programFeeValues[index]?.rate || 0) +
      parseFloat(strategistFeeValues[index]?.rate || 0) +
      parseFloat(fundExpences || 0);
    let clientDollerValue = (totalClientFees / 100) * accountValue;

    updateStateAtIndex(setTotalClientFeeValues, {
      rate: isNaN(totalClientFees) ? "N/A" : totalClientFees.toFixed(4),
      price: isNaN(clientDollerValue) ? "N/A" : clientDollerValue.toFixed(2),
    });
    let grossannualfee;
    if (fpPayout && fpPayout != 0) {
      grossannualfee = parseFloat(fpValues[index]?.rate);
    } else {
      grossannualfee = "N/A";
    }
    let grossAnnualFeeDollerValue =
      grossannualfee !== "N/A" ? (grossannualfee / 100) * accountValue : "N/A";

    updateStateAtIndex(setgrossAnnualFeeValues, {
      rate: isNaN(grossannualfee) ? "N/A" : grossannualfee.toFixed(4),
      price:
        grossAnnualFeeDollerValue !== "N/A"
          ? grossAnnualFeeDollerValue.toFixed(2)
          : grossAnnualFeeDollerValue,
    });
  }, [fpValues, programFeeValues, strategistFeeValues]);

  const calculateTotal = (funds) => {
    if (funds) {
      return funds.reduce((acc, fund) => {
        const enteredValue = parseFloat(fund.inputValue) || 0;
        const bps = parseFloat(fund.value) || 0;
        return acc + (enteredValue * bps) / 100;
      }, 0);
    }
  };

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "total-account-fees":
        return (
          <div className="result-content">
            <div className="result-row">
              <div className="result-label">Financial Professional Fee</div>
              <div className="result-value-container">
                <div className="result-value">                  
                  {fpValues[index]?.rate && fpValues[index]?.rate !== undefined && fpValues[index]?.rate !==""
                    ? `${Number(fpValues[index].rate)?.toLocaleString()}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {fpValues[index]?.price != null &&
                  fpValues[index].price !== "" && fpValues[index].price !== undefined
                    ? `$${Number(fpValues[index].price)?.toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
     
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Program Fee</div>
              <div className="result-value-container">
                <div className="result-value">
                  {programFeeValues[index]?.rate !== "" &&
                  programFeeValues[index]?.rate !== "N/A" && programFeeValues[index]?.rate !== undefined
                    ? `${programFeeValues[index].rate}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {programFeeValues[index]?.price !== "" &&
                  programFeeValues[index]?.rate !== "N/A" && programFeeValues[index]?.rate !== undefined
                    ? `$${Number(programFeeValues[index].price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Strategist Fee (if applicable)</div>
              <div className="result-value-container">
                <div className="result-value">
                  {strategistFeeValues[index]?.rate !== "" && strategistFeeValues[index]?.rate !== "N/A" && strategistFeeValues[index]?.rate !== undefined
                    ? `${strategistFeeValues[index].rate}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {strategistFeeValues[index]?.price !== "" && strategistFeeValues[index]?.price !== "N/A" && strategistFeeValues[index]?.price !== undefined
                    ? `$${Number(strategistFeeValues[index].price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Total Account Fee (annualized)</div>
              <div className="result-value-container">
                <div className="result-value">
                  {totalAccountFeeValues[index]?.rate !== "" &&
                  totalAccountFeeValues[index]?.rate !== "N/A" && totalAccountFeeValues[index]?.rate !== undefined
                    ? `${totalAccountFeeValues[index].rate}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {totalAccountFeeValues[index]?.price !== "" &&
                  totalAccountFeeValues[index]?.price !== "N/A" && totalAccountFeeValues[index]?.price !== undefined
                    ? `$${Number(totalAccountFeeValues[index]?.price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="divider" />
            <div className="result-row">
              <div className="result-label">
                Total Client Fees (including Fund Expenses)
              </div>
              <div className="result-value-container">
                <div className="result-value">
                  {totalClientFeeValues[index]?.rate !== "0.0000" &&
                  totalClientFeeValues[index]?.rate !== "N/A" && totalClientFeeValues[index]?.rate !== undefined
                    ? `${totalClientFeeValues[index]?.rate}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {totalClientFeeValues[index]?.price !== "0.00" &&
                  totalClientFeeValues[index]?.price !== "N/A" && totalClientFeeValues[index]?.price !== undefined
                    ? `$${Number(totalClientFeeValues[index]?.price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        );
      case "additional-detail":
        return (
          <div className="result-content">
            <div className="result-row">
              <div className="result-label">
                Gross Annual Fee to Financial Professional
              </div>
              <div className="result-value-container">
                <div className="result-value">
                  {grossAnnualFeeValues[index]?.rate !== "" &&
                  grossAnnualFeeValues[index]?.rate !== undefined &&
                  grossAnnualFeeValues[index]?.rate !== "N/A"
                    ? `${grossAnnualFeeValues[index]?.rate}%`
                    : grossAnnualFeeValues[index]?.rate !== undefined
                    ? "N/A"
                    : ""}
                </div>

                <div className="result-value">
                  {grossAnnualFeeValues[index]?.price !== "" &&
                  !isNaN(grossAnnualFeeValues[index]?.price) &&
                  grossAnnualFeeValues[index]?.price !== "N/A" && grossAnnualFeeValues[index]?.price !== undefined
                    ? `$${Number(grossAnnualFeeValues[index]?.price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">
                Net Annual Fee to Financial Professional
              </div>
              <div className="result-value-container">
                <div className="result-value">
                  {netAnnualFeeValues[index]?.rate !== "" &&
                   netAnnualFeeValues[index]?.rate !== undefined
                    ? `${netAnnualFeeValues[index]?.rate}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {netAnnualFeeValues[index]?.price !== "" &&
                   netAnnualFeeValues[index]?.price !== undefined
                    ? `$${Number(netAnnualFeeValues[index]?.price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        );
      case "summary":
        return (
          <div className="result-content">
            <div className="result-row">
              <div className="result-label">Account Value</div>
              <div className="result-value-container">
                <div className="result-value">
                  {accountValue[index]?.rate && accountValue[index]?.rate !== undefined && accountValue[index]?.rate !==""
                    ? `${Number(accountValue[index]?.rate).toLocaleString()}%`
                    : "N/A"}
                </div>
                <div className="result-value">
                  {accountValue[index]?.price && accountValue[index]?.price !== undefined && accountValue[index]?.price !==""
                    ? `$${Number(accountValue[index]?.price).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Fund Expenses</div>
              <div className="result-value-container">
                <div className="result-value">
                  {fundExpenses[index]?.rate && fundExpenses[index]?.rate !== undefined && fundExpenses[index]?.rate !=="" 
                    ? `${fundExpenses[index]?.rate}%`
                    : "N/A"}
                </div>
                <div className="result-value">N/A</div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Financial Professional Payout</div>
              <div className="result-value-container">
                <div className="result-value">
                  {fpPayout[index]?.rate && fpPayout[index]?.rate !== undefined && fpPayout[index]?.rate !=="" ? `${fpPayout[index]?.rate}%` : "N/A"}
                </div>
                <div className="result-value">N/A</div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Household Value</div>
              <div className="result-value-container">
                <div className="result-value">N/A</div>
                <div className="result-value">
                  {houseHoldValue[index]?.rate && houseHoldValue[index]?.rate !== undefined && houseHoldValue[index]?.rate !==""
                    ? `$${Number(houseHoldValue[index]?.rate).toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Fee Type</div>
              <div className="result-value single-column">
                {feeType[index] || "N/A"}
              </div>
            </div>
            <div className="divider" />
            <div className="result-row">
              <div className="result-label">Program Fee</div>
              <div className="result-value single-column">
                {programFee[index] || "N/A"}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Function to handle tab switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="results-container">
      <div className="results-title">Your Estimated Results</div>
      <div className="tabs-container">
        <div
          className={`tab ${
            activeTab === "total-account-fees" ? "active" : ""
          }`}
          onClick={() => handleTabSwitch("total-account-fees")}
        >
          Total Account Fees
          <div
            className={`tab-underline ${
              activeTab === "total-account-fees" ? "active" : ""
            }`}
          />
        </div>
        <div
          className={`tab ${activeTab === "additional-detail" ? "active" : ""}`}
          onClick={() => handleTabSwitch("additional-detail")}
        >
          Additional Detail
          <div
            className={`tab-underline ${
              activeTab === "additional-detail" ? "active" : ""
            }`}
          />
        </div>
        <div
          className={`tab ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => handleTabSwitch("summary")}
        >
          Summary
          <div
            className={`tab-underline ${
              activeTab === "summary" ? "active" : ""
            }`}
          />
        </div>
      </div>
      <div className="iconsContainer">
        <div className="min-width-half"></div>
        <div className="flex-container">
          <div className="rate-label labels">Rate(%)</div>
          <div className="price-label labels">Price($)</div>
        </div>
      </div>

      <div className="divider" />
      <div className="results-content">{renderTabContent()}</div>
    </div>
  );
};

export default YourEstimatedResults;
