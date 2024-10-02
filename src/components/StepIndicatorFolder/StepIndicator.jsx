import * as React from "react";
import { useEffect, useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCalculationStorage } from "../../context/StorageContext";
import "./StepIndicator.css";

const steps = [
  {
    id: 1,
    title: "Enter Account Value",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Select Financial Professional Fee",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet.",
  },
  {
    id: 3,
    title: "Configure Program Fee",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    title: "Configure Strategist Fee",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 5,
    title: "Add Additional Details",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const VerticalLinearStepper = ({ calculationData }) => {
  const {
    stepsCompleted,
    setStepsCompleted,
    index,
    setIndex,
    getCalculationDataValue,
  } = useCalculationStorage();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [invalidSteps, setInvalidSteps] = useState(new Set());

  useEffect(() => {
    const FPfeeType = getCalculationDataValue("FPfeeType")[index] || "";
    const FPfeeFlat = getCalculationDataValue("FPfeeFlat")[index]?.amount || "";
    const FPfeeFixed = getCalculationDataValue("FPfeeFixed")[index] || "";
    const paymentOption = getCalculationDataValue("paymentOption")[index] || "";
    const accountValue = getCalculationDataValue("account-value")[index] || "";

    const newCompletedSteps = new Set(completedSteps);
    const newInvalidSteps = new Set(invalidSteps);

    if (
      calculationData["scenario-name"][index] &&
      calculationData["scenario-name"][index].trim() !== "" &&
      calculationData["account-value"][index] &&
      calculationData["account-value"][index] > 0
    ) {
      newCompletedSteps.add(1);
    } else {
      newCompletedSteps.delete(1);
    }

    let isFPFeeValid = "";
    if (FPfeeType !== "") {
      isFPFeeValid = true;
      if (FPfeeType === "flat") {
        if (
          (paymentOption === "advisor-directed" ||
            paymentOption === "team-directed") &&
          FPfeeFlat > 2.25
        ) {
          isFPFeeValid = false;
        } else if (
          (paymentOption === "caap" || paymentOption === "uma-sma") &&
          FPfeeFlat > 2.15
        ) {
          isFPFeeValid = false;
        } else if (FPfeeFlat > 2.25) {
          isFPFeeValid = false;
        }
      }
    }
    if (isFPFeeValid) {
      newCompletedSteps.add(2);
      newInvalidSteps.delete(2);
    } else if (isFPFeeValid === false) {
      newCompletedSteps.delete(2);
      newInvalidSteps.add(2);
    }

    // if (calculationData["paymentOption"][index]) {
    //   newCompletedSteps.add(3);
    // } else {
    //   newCompletedSteps.delete(3);
    // }
    let isPaymentOption = "";
    if (calculationData["paymentOption"][index]) {      
      if (
        (calculationData["paymentOption"][index] === "caap-small-account" &&
          accountValue > 50000) ||
        (calculationData["paymentOption"][index] === "team-directed" &&
          accountValue > 5000) ||
        (calculationData["paymentOption"][index] === "uma-sma" &&
          accountValue > 100000) || (calculationData["paymentOption"][index] === "advisor-directed") || (calculationData["paymentOption"][index] === "caap")                
      ) {
        newCompletedSteps.add(3);
        newInvalidSteps.delete(3);
      } else {
        newCompletedSteps.delete(3);
        newInvalidSteps.add(3);
      }
    }

    if (paymentOption) {
      if (
        (calculationData?.paymentOption?.[index] === "caap" &&
          calculationData?.strategistFeeCaap?.[index] &&
          Object.keys(calculationData?.strategistFeeCaap[index])?.length > 0) ||
        (calculationData?.paymentOption?.[index] === "caap-small-account" &&
          calculationData?.strategistFeeCaapSmallAccount?.[index] &&
          Object.keys(calculationData?.strategistFeeCaapSmallAccount[index])
            .length > 0) ||
        (calculationData?.paymentOption?.[index] === "team-directed" &&
          calculationData?.teamDirectedInput?.[index] > 0) ||
        (calculationData?.paymentOption?.[index] === "uma-sma" &&
          Array.isArray(calculationData?.["UMA-SMA-Strategist-Fee"]) &&
          calculationData["UMA-SMA-Strategist-Fee"]?.[index]?.length > 0)
      ) {
        newCompletedSteps.add(4);
      } else {
        newCompletedSteps.delete(4);
      }
    }

    if (
      calculationData?.AdditionalDetails[index]?.fundExpenses > 0 &&
      calculationData?.AdditionalDetails[index]?.fpPayOut > 0 &&
      calculationData?.AdditionalDetails[index]?.auaDiscount !== ""
    ) {
      newCompletedSteps.add(5);
    } else {
      newCompletedSteps.delete(5);
    }

    setCompletedSteps(newCompletedSteps);
    setInvalidSteps(newInvalidSteps);

    const allStepsCompleted =
      calculationData.paymentOption[index] === "advisor-directed"
        ? newCompletedSteps.size === 4
        : newCompletedSteps.size === 5;
    setStepsCompleted(allStepsCompleted);
  }, [calculationData]);

  return (
    <div className="step-indicator">
      {steps.map((step) =>
        !(
          step.id === 4 &&
          calculationData?.paymentOption?.[index] === "advisor-directed"
        ) ? (
          <div
            key={step.id}
            className={`step ${activeStep === step.id ? "active" : ""} ${
              invalidSteps.has(step.id) ? "invalid" : ""
            }`}
            onClick={() => setActiveStep(step.id)}
          >
            <div className="step-line-parent">
              <div
                className={`step-line ${step.id === 1 ? "noLine" : ""}`}
              ></div>
              {completedSteps.has(step.id) ? (
                <CheckCircleIcon
                  sx={{ fill: "#186ADE", width: "18px", height: "18px" }}
                />
              ) : invalidSteps.has(step.id) ? (
                <RadioButtonUncheckedIcon
                  sx={{ fill: "red", width: "18px", height: "18px" }}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{ fill: "#186ADE", width: "18px", height: "18px" }}
                />
              )}
              <div
                className={`step-line ${
                  step.id === steps.length ? "noLine" : ""
                }`}
              ></div>
            </div>
            <div className="title">
              {step.title} <p>{step.description}</p>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default VerticalLinearStepper;
