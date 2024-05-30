import React, { useEffect, useState } from "react";
import "./calculator.css";
import FinancialProfessionalFee from "../../components/FPFee/FinancialProfessionalFee";
import ProgramFeeSelection from "../../components/ProgramFee/ProgramFeeSelection";
import ProgramFeePayment from "../../components/ProgramFeePayment/ProgramFeePayment";
// import ProgramFeeDetails from "../../components/ProgramFeeDetails/ProgramFeeDetails";
import StrategistFee from "../../components/CaapAndSas/StrategistFee";
import AdditionalDetail from "../../components/AdditionalDetail/AdditionalDetail";
import StepIndicator from "../../components/StepIndicatorFolder/StepIndicator";
import YourEstimatedResults from "../../components/Results/YourEstimatedResults";
import StepFooter from "../../components/StepFooter/StepFooter";
import useIntersectionObserver from "../../components/useIntersectionObserver/useIntersectionObserver"
import { useCalculationStorage } from "../../context/StorageContext";
function CalculatorPage() {
  const {
    calculationData,
    setCalculationData,
    handleChange,
    getCalculationDataValue,index,setIndex   
  } = useCalculationStorage();

  const [completedSteps, setCompletedSteps] = useState([0]); // Step 0: Enter Account Value
  const [selectedOption, setSelectedOption] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const sectionsRef = useIntersectionObserver(setCurrentStep);
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    // handleProgramFeeSelectionComplete();
  };
  
  return (
    <div>
      {/* Header Section */}
      <div className="headerContainer">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/16a0bf8ee9915a3c1274ab46ee5f5cd31e6b2e149ae5785312a1e6ed4b606161?apiKey=f95b5ca361ef4526b1cb461f7b2405ea&"
          className="logoImage"
        />
      </div>
      <div className="filler-top"></div>
      <div className="calculation-wrapper-outer">
        <div className="calculation-left">
          {/* Main Content Section */}
          <h1> WealthPort Fee Calculator</h1>
          <div className="container">
            <div className="contentWrapper">
              <div className="imageColumn">
                <img loading="lazy" src="/icon.svg" className="featureImage" />
              </div>
              <div className="textColumn">
                <div className="description">
                  Use this tool to calculate the estimated account fees for any
                  WealthPort program fee type or to compare investment options.
                  Save each estimate's unique link to share or revisit directly
                  through your browser. Export your estimate to an Excel or PDF
                  to quickly share and analyze your estimated fees.
                  <br />
                  <p>Get Started below.</p>
                  <br />
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Section */}
          <div className="filler"></div>

          <div
            className="scenario-container"
            ref={(el) => (sectionsRef.current[1] = el)}
          >
            <div className="scenario-header">
              Enter a name for this scenario
            </div>
            <div className="scenario-label">Scenario Name</div>
            <input
              onChange={(e) => {
                handleChange(e);
              }}
              name="scenario-name"
              className="scenario-input"
              type="text"
              value={getCalculationDataValue("scenario-name")[index] || ''}
              min='0'
            />
          </div>

          {/* Account Value Section */}
          <div className="filler"></div>

          <div
            className="scenario-container"
            // ref={(el) => (sectionsRef.current[2] = el)}
          >
            <div className="header-title">Enter Account Value</div>
            <div className="label-title">Account Value</div>
            <input
              onChange={handleChange}
              name="account-value"
              className="scenario-input"
              type="number"
              value={getCalculationDataValue("account-value")[index]  || ''}
            />
          </div>

          {/* Financial Professional Fee Section */}
          <div className="filler"></div>
          <div ref={(el) => (sectionsRef.current[2] = el)}>
            <FinancialProfessionalFee
              handleChange={handleChange}
              setCalculationData={setCalculationData}
              calculationData={calculationData}
              getCalculationDataValue={getCalculationDataValue}
            ></FinancialProfessionalFee>
          </div>

          {/* Select Program Fee Section */}
          <div className="filler"></div>
          <div ref={(el) => (sectionsRef.current[3] = el)}>
            <ProgramFeeSelection
              handleChange={handleChange}
              onOptionChange={handleOptionChange}
              getCalculationDataValue={getCalculationDataValue}
            />
          </div>

          {/* Program Fee Payment Section */}
          <div className="filler"></div>
          <div ref={(el) => (sectionsRef.current[4] = el)}>
            <ProgramFeePayment
              getCalculationDataValue={getCalculationDataValue}
              handleChange={handleChange}
            ></ProgramFeePayment>
          </div>

          {/* Strategist Fee Section */}

          {/* <ProgramFeeDetails selectedOption={selectedOption} /> */}
          <div className="filler"></div>
          <div
            ref={(el) =>
              getCalculationDataValue("paymentOption") && getCalculationDataValue("paymentOption") !== '' && getCalculationDataValue("paymentOption") !== "advisor-directed"
                ? (sectionsRef.current[5] = el)
                : null
            }
          >
            <StrategistFee
              handleChange={handleChange}
              getCalculationDataValue={getCalculationDataValue}
              feeType={selectedOption}
              setCalculationData={setCalculationData}
              calculationData={calculationData}
            ></StrategistFee>
          </div>

          {/* Additional Details Section */}
          <div className="filler"></div>

          <div ref={(el) => (sectionsRef.current[6] = el)}>
            <AdditionalDetail
              handleChange={handleChange}
              getCalculationDataValue={getCalculationDataValue}
              setCalculationData={setCalculationData}
              calculationData={calculationData}
            ></AdditionalDetail>
          </div>
          <div className="filler"></div>
        </div>
        <div className="calculation-right">
          <div className="calculation-right-container">
            <StepIndicator calculationData={calculationData} />
            <YourEstimatedResults
              handleChange={handleChange}
              getCalculationDataValue={getCalculationDataValue}
              feeType={selectedOption}
              setCalculationData={setCalculationData}
              calculationData={calculationData}
            ></YourEstimatedResults>
          </div>
        </div>
      </div>
      <div className="filler-top"></div>
      <StepFooter
        currentStep={currentStep}        
      ></StepFooter>
    </div>
  );
}

export default CalculatorPage;
