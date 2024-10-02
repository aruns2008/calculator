import React, { useState, useEffect } from "react";
import CircularProgress from "../CircularProgress/CircularProgress";
import { useCalculationStorage } from "../../context/StorageContext";
import { type } from "@testing-library/user-event/dist/type";
import Radio from "../Radio/Radio";
import NumberInput from "../../components/NumberInput/NumberInput";
const FinancialProfessionalFee = ({
  onComplete,
  handleChange,
  setCalculationData,
  calculationData,
  getCalculationDataValue,
}) => {
  const {
    totalAccountFeeValues,
    errorMessages,
    setErrorMessages,
    tierValueSum,
    setTierValueSum,
    breakPointValueSum,
    setBreakPointValueSum,
    index,
    setIndex,
    formatNumberWithCommas,
    formatCurrency,
  } = useCalculationStorage();

  // Function to update tierValueSum and breakPointValueSum based on index
  const [flatValue, setFlatValue] = useState(
    getCalculationDataValue("FPfeeFlat")[index]?.amount || ""
  );
  const [fixedValue, setFixedValue] = useState(
    getCalculationDataValue("FPfeeFixed")[index]?.amount || ""
  );

  // useEffect to initialize the input value
  const formatAndSetValue = (value, setValue, suffix) => {
    const numericValue = value.replace(/[^0-9,]/g, "");
    const formattedValue = formatNumberWithCommas(numericValue);
    setValue(formattedValue ? `${formattedValue}` : "");
  };

  const setArrayValueAtIndex = (setStateFunction, index, value) => {
    setStateFunction((prevState) => {
      const newState = [...prevState];
      // Ensure the array is long enough
      while (newState.length <= index) {
        newState.push({ doller: "", percentage: "" });
      }
      newState[index] = value;
      return newState;
    });
  };
  const updateTierAndBreakPointSums = (
    index,
    tierSum,
    tierPercentage,
    breakPointSum,
    breakPointPercentage
  ) => {
    setArrayValueAtIndex(setTierValueSum, index, {
      doller: tierSum,
      percentage: tierPercentage,
    });
    setArrayValueAtIndex(setBreakPointValueSum, index, {
      doller: breakPointSum,
      percentage: breakPointPercentage,
    });
  };

  const calculateSums = (data) => {
    let amounts = [];
    let percentages = [];

    if (data) {
      Object.values(data).forEach((item) => {
        amounts.push(parseFloat(item.amount || 0));
        percentages.push(parseFloat(item.percentage || 0));
      });
    }
    const sumOfAmounts = amounts.reduce((acc, val) => acc + val, 0);
    const sumOfPercentages = percentages.reduce((acc, val) => acc + val, 0);
    return { sumOfAmounts, sumOfPercentages };
  };
  const [tierCompletionStatus, setTierCompletionStatus] = useState(0);
  const [breakPointCompletionStatus, setBreakPointCompletionStatus] =
    useState(0);

  useEffect(() => {
    const FPfeeTiers = getCalculationDataValue("FPfeeTiers")[index] || "";

    const FPfeeBreakPoints =
      getCalculationDataValue("FPfeeBreakPoints")[index] || "";
    const accountValue = getCalculationDataValue("account-value")[index] || "";

    const { sumOfAmounts: sumOfTiers, sumOfPercentages: sumOfTierPercentages } =
      calculateSums(FPfeeTiers);
    const {
      sumOfAmounts: sumOfBreakPoints,
      sumOfPercentages: sumOfBreakPointPercentages,
    } = calculateSums(FPfeeBreakPoints);


    updateTierAndBreakPointSums(
      index,
      sumOfTiers,
      sumOfTierPercentages,
      sumOfBreakPoints,
      sumOfBreakPointPercentages
    );

    const tierCompletion = accountValue ? (sumOfTiers / accountValue) * 100 : 0;
    const breakPointCompletion = accountValue
      ? (sumOfBreakPoints / accountValue) * 100
      : 0;

    setTierCompletionStatus(tierCompletion);
    setBreakPointCompletionStatus(breakPointCompletion);
  }, [calculationData]);

  // State for the fee type selection
  const [feeType, setFeeType] = useState(
    getCalculationDataValue("FPfeeType")[index] || ""
  );

  const fetchBreakPoints = () => {
    const tiersData = getCalculationDataValue("FPfeeBreakPoints")[index] || "";
    return Object.keys(tiersData).map((key) => ({
      ...tiersData[key],
      id: key,
      amount: formatNumberWithCommas(tiersData[key].amount),
      percentage: formatNumberWithCommas(tiersData[key].percentage),
    }));
  };

  const fetchTiers = () => {
    const tiersData = getCalculationDataValue("FPfeeTiers")[index] || "";
    return Object.keys(tiersData).map((key) => ({
      ...tiersData[key],
      id: key,
      amount: formatNumberWithCommas(tiersData[key].amount),
      percentage: formatNumberWithCommas(tiersData[key].percentage),
    }));
  };

  // State hook to store tiers
  const [tiers, setTiers] = useState(fetchTiers());
  const [breakpoints, setBreakpoints] = useState(fetchBreakPoints());

  // Example account value for progress calculations
  const MAX_ITEMS = 9;

  // Handle change of fee type
  const handleFeeChange = (event) => {
    setFeeType(event.target.value);
    handleChange({
      target: { name: "FPfeeType", value: event.target.value },
    });
  };
  // Example function to check if the data is complete
  const isDataComplete = () => {
    // Example logic: just checks if a fee type is selected and at least one value is entered
    return (
      feeType !== "" &&
      ((feeType === "fixed" && tiers[0]?.amount !== "") ||
        (feeType === "breakpoint" && breakpoints[0]?.amount !== ""))
    );
  };

  // Check completion on each change
  useEffect(() => {
    if (isDataComplete() && onComplete) {
      onComplete(); // Invoke the onComplete handler when data is complete
    }
  }, [feeType, tiers, breakpoints, onComplete]);

  // Update tier value
  const updateTier = (index, field, value) => {
    const updatedTiers = [...tiers];
    const formated_value = value.replace(/[^\d.]/g, "");
    updatedTiers[index][field] = formated_value;
    setTiers(updatedTiers);
    handleChange({
      target: {
        name: "FPfeeTiers",
        value: updatedTiers.reduce((acc, tier, idx) => {
          acc[`tier${idx + 1}`] = { ...tier };
          return acc;
        }, {}),
      },
    });
  };

  // Update breakpoint value
  const updateBreakpoint = (index, field, value) => {
    const updatedBreakpoints = [...breakpoints];
    const formated_input = value.replace(/[^\d.]/g, "");
    updatedBreakpoints[index][field] = formated_input;
    setBreakpoints(updatedBreakpoints);
    handleChange({
      target: {
        name: "FPfeeBreakPoints",
        value: updatedBreakpoints.reduce((acc, bp, idx) => {
          acc[`breakpoint${idx + 1}`] = { ...bp };
          return acc;
        }, {}),
      },
    });
  };

  const handleFixed = (event) => {
    const value = event.target.value;
    setFixedValue(value);
    const formated_input = value.replace(/[^\d.]/g, "");
    if (formated_input !== undefined) {
      handleChange({
        target: {
          name: "FPfeeFixed",
          value: { type: "fixed", amount: formated_input },
          type: "text",
        },
      });
    }
  };
  const handleFlat = (event) => {
    const value = event.target.value;
    setFlatValue(value);
    const formated_input = value.replace(/[^\d.]/g, "");
    if (formated_input !== undefined) {
      handleChange({
        target: {
          name: "FPfeeFlat",
          value: { type: "flat", amount: formated_input },
          type: "text",
        },
      });
    }
  };

  // Add another tier
  const addTier = () => {
    if (tiers.length < MAX_ITEMS) {
      setTiers([...tiers, { amount: "", percentage: "" }]);
    }
  };

  // Add another breakpoint
  const addBreakpoint = () => {
    if (breakpoints.length < MAX_ITEMS) {
      setBreakpoints([...breakpoints, { amount: "", percentage: "" }]);
    }
  };

  // Dynamically label tiers and breakpoints
  const getOrdinalLabel = (index) => {
    const ordinals = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
    ];
    return ordinals[index] || `Tier ${index + 1}`;
  };

  // Error Setup

  const FPfeeFlat = getCalculationDataValue("FPfeeFlat")[index];
  const paymentOption = getCalculationDataValue("paymentOption")[index];

  useEffect(() => {
    updateErrorMessages(FPfeeFlat, paymentOption);
  }, [FPfeeFlat, paymentOption]);

  const updateErrorMessages = (totalAccountFeeValues, paymentOption) => {
    let errorKey = null;
    let maxLimit = 3;

    if (
      paymentOption === "advisor-directed" ||
      paymentOption === "team-directed"
    ) {
      errorKey = "flat_team_directed";
      maxLimit = 2.25;
    } else if (paymentOption === "uma-sma" || paymentOption === "caap") {
      errorKey = "flat_uma_sma";
      maxLimit = 2.15;
    } else {
      errorKey = "caap_small_account_solutions";
      maxLimit = 3;
    }

    if (errorKey !== null && totalAccountFeeValues) {
      const isError = totalAccountFeeValues > maxLimit;
      setErrorMessages((prev) => ({ ...prev, [errorKey]: isError }));
    }
  };

  const handleAmountChange = (index, e, type, from) => {
    const newValue = e.target.value;
    if (from == "tier") {
      updateTier(index, type, newValue);
    } else {
      updateBreakpoint(index, type, newValue);
    }
  };
  // Function to format number by adding commas
  const formatNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // Render the appropriate content based on the fee type
  const renderFeeContent = () => {
    switch (feeType) {
      case "flat":
        return (
          <div>
            <div className="fee-input-title">Enter Flat Fee</div>
            <div className="fee-input-description">
              Enter a flat annual percentage fee based on the total account
              value; billed monthly or quarterly. Maximum Financial Professional
              Fee for Advisor-directed and Team-directed is 2.25%; CAAP and UMA
              is 2.15%.{" "}
            </div>
            <div className="fee-input-label">Enter Flat Fee Amount (%)</div>

            <NumberInput
              value={flatValue}
              onChange={handleFlat}
              // placeholder="$ "
              className={`scenario-input ${
                getCalculationDataValue("FPfeeFlat")[index]?.amount > "2.25" ||
                getCalculationDataValue("FPfeeFlat")[index]?.amount > 2.25
                  ? "active"
                  : ""
              }`}
              symbol={"%"}
            />

            <p
              className={`error-message ${
                getCalculationDataValue("FPfeeFlat")[index]?.amount > "2.25" ||
                getCalculationDataValue("FPfeeFlat")[index]?.amount > 2.25
                  ? "active"
                  : ""
              }`}
            >
              Please enter a number between 0 and 2.25
            </p>
          </div>
        );
      case "fixed":
        return (
          <div>
            <div className="fee-input-title">Enter Fixed Fee</div>
            <div className="fee-input-description">
              Enter a fixed annual dollar amount, billed monthly or quarterly.
              Maximum Financial Professional Fee for Advisor-directed and
              Team-directed is 2.25%; CAAP and UMA is 2.15%.
            </div>
            <div className="fee-input-label">Enter Fixed Fee ($)</div>
            <NumberInput
              value={fixedValue}
              onChange={handleFixed}
              className="scenario-input"
              symbol={"$"}
            />
            <p
              className={`error-message ${
                totalAccountFeeValues.rate && totalAccountFeeValues.rate > "3"
                  ? "active"
                  : ""
              }`}
            >
              The total account fee has exceeded the maximum limit of 3%. Please
              correct the input entries to continue.
            </p>
          </div>
        );
      case "tier":
        return (
          <div>
            <div className="fee-input-title">Build Tier Table</div>
            <div className="progress-fp">
              <div className="fee-input-description">
                A blended rate fee based on applying the % Fee to the value of
                the account that falls into each respective fee tier.
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "200px",
                  flexDirection: "column",
                }}
              >
                <CircularProgress percentage={tierCompletionStatus} />
                {tierCompletionStatus < 100 ? (
                  <p className="circular-message">Under Allocated</p>
                ) : tierCompletionStatus > 100 ? (
                  <p className="circular-message">Over Allocated</p>
                ) : (
                  <p className="circular-message">Allocation Complete</p>
                )}
              </div>
            </div>
            {tiers.map((tier, index) => (
              <div key={index} className="tier-breakpoint-row">
                <div className="tier-breakpoint-input">
                  <div className="tier-label">
                    {getOrdinalLabel(index)} Tier
                  </div>
                  <NumberInput
                    value={`${formatNumber(tier.amount)}`}
                    from={"tier"}
                    onChange={(e) =>
                      handleAmountChange(index, e, "amount", "tier")
                    }
                    className="scenario-input"
                    symbol="$"
                  />
                </div>
                <div className="percentage-input">
                  <div>% Fee</div>
                  <NumberInput
                    from={"tier"}
                    value={`${formatNumber(tier.percentage)}`}
                    onChange={(e) =>
                      handleAmountChange(index, e, "percentage", "tier")
                    }
                    className="scenario-input"
                    symbol="%"
                  />
                </div>
              </div>
            ))}
            {tiers.length != MAX_ITEMS ? (
              <div className="tier-breakpoint-btn-wrapper" onClick={addTier}>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc9f7f93b265b7a99dbd7335ed6fe561e3e2642aabe2c1ba8aa6b8203b298043?apiKey=f95b5ca361ef4526b1cb461f7b2405ea&"
                  className="img"
                />
                <div className="tier-breakpoint-btn">
                  Add Another Breakpoint
                </div>
              </div>
            ) : (
              ""
            )}
            <p
              className={`error-message ${
                getCalculationDataValue("account-value")[index] &&
                getCalculationDataValue("account-value")[index] <
                  tierValueSum.doller
                  ? "active"
                  : ""
              }`}
            >
              Tier doller value is greater than the account value
            </p>
            <p
              className={`error-message ${
                3 < tierValueSum.percentage ? "active" : ""
              }`}
            >
              The input value has exceeded the maximum limit of 3%. Please
              correct the input entries to continue.
            </p>
          </div>
        );
      case "breakpoint":
        return (
          <div>
            <div className="fee-input-title">Build Breakpoint Table</div>
            <div className="progress-fp">
              <div className="fee-input-description">
                A blended rate fee based on applying the % Fee to the value of
                the account that falls into each respective fee tier.
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "200px",
                  flexDirection: "column",
                }}
              >
                <CircularProgress percentage={breakPointCompletionStatus} />
                {breakPointCompletionStatus < 100 ? (
                  <p className="circular-message">Under Allocated</p>
                ) : breakPointCompletionStatus > 100 ? (
                  <p className="circular-message">Over Allocated</p>
                ) : (
                  <p className="circular-message">Allocation Complete</p>
                )}
              </div>
            </div>

            {breakpoints.map((bp, index) => (
              <div key={index} className="tier-breakpoint-row">
                <div className="tier-breakpoint-input">
                  <div className="tier-label">
                    {getOrdinalLabel(index)} Breakpoint
                  </div>
                  <NumberInput
                    from={"breakPoint"}
                    value={`${formatNumber(bp.amount)}`}
                    onChange={(e) =>
                      handleAmountChange(index, e, "amount", "bp")
                    }
                    className="scenario-input"
                    symbol="$"
                  />
                </div>
                <div className="percentage-input">
                  <div>% Fee</div>

                  <NumberInput
                    from={"breakPoint"}
                    value={`${formatNumber(bp.percentage)}`}
                    onChange={(e) =>
                      handleAmountChange(index, e, "percentage", "bp")
                    }
                    className="scenario-input"
                    symbol="%"
                  />
                </div>
              </div>
            ))}
            <div
              className="tier-breakpoint-btn-wrapper"
              onClick={addBreakpoint}
            >
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc9f7f93b265b7a99dbd7335ed6fe561e3e2642aabe2c1ba8aa6b8203b298043?apiKey=f95b5ca361ef4526b1cb461f7b2405ea&"
                className="img"
              />
              <div className="tier-breakpoint-btn">Add Another Breakpoint</div>
            </div>
            <p
              className={`error-message ${
                getCalculationDataValue("account-value")[index] &&
                getCalculationDataValue("account-value")[index] <
                  breakPointValueSum.doller
                  ? "active"
                  : ""
              }`}
            >
              Tier doller value is greater than the account value
            </p>
            <p
              className={`error-message ${
                3 < breakPointValueSum.percentage ? "active" : ""
              }`}
            >
              The input value has exceeded the maximum limit of 3%. Please
              correct the input entries to continue.
            </p>
            {/* <div>
              <h4>Breakpoints Complete</h4>
              <p>{Math.round(calculateBreakpointProgress())}%</p>
            </div> */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fee-container">
      <div className="fee-title">Financial Professional Fee</div>
      <div className="fee-options-container">
        <label className="fee-option">

          <Radio
            selectedValue={feeType}
            value="flat"
            onchange={handleFeeChange}
            name=""
          />
          <div className="fee-option-title">Flat</div>
        </label>
        <label className="fee-option">

          <Radio
            selectedValue={feeType}
            value="fixed"
            onchange={handleFeeChange}
            name=""
          />
          <div className="fee-option-title">Fixed</div>
        </label>
        <label className="fee-option">

          <Radio
            selectedValue={feeType}
            value="tier"
            onchange={handleFeeChange}
            name=""
          />
          <div className="fee-option-title">Tier</div>
        </label>
        <label className="fee-option">
          
          <Radio
            selectedValue={feeType}
            value="breakpoint"
            onchange={handleFeeChange}
            name=""
          />
          <div className="fee-option-title">Breakpoint</div>
        </label>
      </div>
      <div>{renderFeeContent()}</div>
    </div>
  );
};

export default FinancialProfessionalFee;
