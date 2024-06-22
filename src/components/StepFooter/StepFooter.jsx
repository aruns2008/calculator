import React, { useEffect, useState } from "react";
import "./StepFooter.css";
import { useNavigate } from "react-router-dom";
import { useCalculationStorage } from "../../context/StorageContext";
const StepFooter = ({ currentStep = 1, from }) => {
  const {
    fpValues,
    stepsCompleted,
    setStepsCompleted,
    index,
    setIndex,
    originalIndex,
    setOriginalIndex,
    handleChange,
    accountValue,
    getCalculationDataValue,
    calculationData,
  } = useCalculationStorage();
  const navigate = useNavigate();
  const [allowCreation, setAllowCreation] = useState(false);
  useEffect(() => {
    if (from && from === "estimated-results") {
      const accountValues = getCalculationDataValue("account-value") || [];
      let vacantIndex = -1;
      for (let i = 0; i < 2; i++) {
        if (accountValues[i] === "" || accountValues[i] === undefined) {
          vacantIndex = i;
          break;
        }
      }

      if (vacantIndex !== -1) {
        setAllowCreation(true);
      } else if (index < 2) {
        if (
          (index === 0 &&
            (accountValues[1] === "" || accountValues[1] === undefined)) ||
          (index === 1 &&
            (accountValues[2] === "" || accountValues[2] === undefined))
        ) {
          setAllowCreation(true);
        }
      }
    } else {
      setAllowCreation(false);
    }
  }, [index, calculationData]);
  useEffect(() => {
    if (from && from === "estimated-results") {
      const accountValues = getCalculationDataValue("account-value") || [];
      let vacantIndex = -1;
      for (let i = 0; i < 2; i++) {
        if (accountValues[i] === "" || accountValues[i] === undefined) {
          vacantIndex = i;
          break;
        }
      }

      if (vacantIndex !== -1) {
        setAllowCreation(true);
      } else if (index < 2) {
        if (
          (index === 0 &&
            (accountValues[1] === "" || accountValues[1] === undefined)) ||
          (index === 1 &&
            (accountValues[2] === "" || accountValues[2] === undefined))
        ) {
          setAllowCreation(true);
        }
      }
    } else {
      setAllowCreation(false);
    }
  }, []);

  useEffect(() => {
    console.log(allowCreation, "allowCreation");
  }, [allowCreation]);

  const stepLabels = {
    1: "Financial Professional Fee",
    2: "Financial Professional Fee",
    3: "Program Fee",
    4: "Program Fee Payment",
    5: "Strategist Fee",
    6: "Additional Detail",
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSummary = () => {
    if (stepsCompleted && originalIndex !== null) {
      setIndex(originalIndex);
      setOriginalIndex(null);
      navigate("/results");
    } else if (stepsCompleted && originalIndex === null) {
      navigate("/results");
    }

    if (from && from === "estimated-results") {
      const accountValues = getCalculationDataValue("account-value") || [];
      const calculationLength = accountValues.length;
      if (index < 2) {
        // setIndex(index + 1);
        // navigate("/");
        if (
          (index === 0 &&
            (accountValues[1] === "" || accountValues[1] === undefined)) ||
          (index === 1 &&
            (accountValues[2] === "" || accountValues[2] === undefined))
        ) {
          setIndex(index + 1);
          navigate("/");
        }
      } else if (index === 2) {
        let vacantIndex = -1;
        for (let i = 0; i < 2; i++) {
          if (accountValues[i] === "" || accountValues[i] === undefined) {
            vacantIndex = i;
            break;
          }
        }
        if (vacantIndex !== -1) {
          setIndex(vacantIndex);
          navigate("/");
        }
      }
    }
  };
  const handleBack = () => {
    const accountValues = getCalculationDataValue("scenario-name") || "";
    navigate("/results");
  };

  return (
    <div className="step-footer">
      {from != "estimated-results" ? (
        <div className="step-info">{stepLabels[currentStep]}</div>
      ) : (
        <div className="step-info"></div>
      )}
      {/* <div className="result step-info">
        <span>Financial Professional Fee</span>        
        <span>{`Rate: ${
          fpValues[index] && fpValues[index].rate && fpValues[index].rate !== undefined && fpValues[index].rate !== ""
            ? `${fpValues[index].rate} %`
            : "000 %"
        }`}</span>
        <span>{`Price: ${
          fpValues[index] && fpValues[index].price && fpValues[index].price !== undefined && fpValues[index].price !== ""
            ? `$${Number(fpValues[index].price).toLocaleString()}`
            : "$000"
        }`}</span>
      </div> */}
      <div className="step-actions">
        <div className="step-cancel" onClick={handleCancel}>
          Cancel
        </div>
        <div className={`step-cancel`} onClick={handleBack}>
          Back
        </div>
        <div
          className={`step-save ${
            stepsCompleted !== true ||
            (from == "estimated-results" && !allowCreation)
              ? "disabled"
              : ""
          }`}
          onClick={handleSummary}
        >
          {from == "estimated-results"
            ? "Create New Estimate"
            : "Save and View Summary"}
        </div>
      </div>
    </div>
  );
};

export default StepFooter;
