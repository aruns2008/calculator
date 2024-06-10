import React from "react";
import { useCalculationStorage } from "../../context/StorageContext";
import comparison from "./comparison.css";
import Button from "../../components/button/Button";

const Comparison = () => {
  const {
    fpValues,
    accountValue,
    fundExpenses,
    fpPayout,
    houseHoldValue,
    feeType,
    programFee,
    programFeeValues,
    strategistFeeValues,
    totalAccountFeeValues,
    totalClientFeeValues,
    grossAnnualFeeValues,
    netAnnualFeeValues,
    getCalculationDataValue,
    index,
    setIndex,
    originalIndex,
    setOriginalIndex,
    handleEdit,
    handleDelete,
    calculationData,
  } = useCalculationStorage();
  const renderValue = (value) => {
    if (value)
      return (
        value !== undefined && value !== null && value !== "" && value !== "N/A"
      );
  };
  return (
    <div className={`main-container ${calculationData["scenario-name"] && calculationData["scenario-name"].every(element => element === '') ? "active" : ""}`}>
      <div>
        <div className="header">
          <div className="title-block">
            <h1>
              {/* {getCalculationDataValue("scenario-name") ||
                "Investment Account Fee Estimate 1"} */}
              Investment Account Fee Estimate
            </h1>
            <p>
              As of Date:{" "}
              {getCalculationDataValue("currentDate")[index]
                ? getCalculationDataValue("currentDate")[index]
                : ""}
            </p>
          </div>
          <div className="actions">
            <Button
              onClick={() => handleEdit(index)}
              text={"Edit"}
              configuresStyles={"result-button action-button"}
            ></Button>
            <Button
              onClick={() => handleDelete(index)}
              text={"Delete"}
              configuresStyles={"result-button action-button"}
            ></Button>
            <Button
              text={"Share"}
              configuresStyles={"result-button action-button"}
            ></Button>
            <Button
              text={"Export ▼"}
              configuresStyles={"result-button action-button"}
            ></Button>
          </div>
        </div>
        <div className="table-wrapper">
          <div className="field-container rate-doller">
            <div className="field-name"></div>
            {calculationData["scenario-name"] &&
              calculationData["scenario-name"].map((scenario, index) =>
                calculationData["scenario-name"][index] !== "" ? (
                  <div key={index} className="header-labels">
                    <div className="header-label">Rate (%)</div>
                    <div className="header-label">Price ($)</div>
                  </div>
                ) : null
              )}
          </div>
          <div className="field-container black-section">
            <div className="field-name">
              Fee Details and Scenario Assumptions
            </div>

            <div key={index} className="header-labels">
              {calculationData["scenario-name"] &&
                calculationData["scenario-name"].map((name, idx) =>
                  renderValue(calculationData["scenario-name"][idx]) ? (
                    <div key={idx} className="header-label three-column">
                      {calculationData["scenario-name"][idx]}
                    </div>
                  ) : null
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">Account Value</div>

            <div key={index} className="header-labels">
              {calculationData["account-value"] &&
                calculationData["account-value"].map((value, idx) =>
                  renderValue(value) ? (
                    <div key={idx} className="header-label three-column">
                      {`$${value}`}
                    </div>
                  ) : null
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">
              Financial Professional Fee
              <span>
                Amount charged by your Financial Professional for investment
                advisory services
              </span>
            </div>
            {fpValues.length > 0 && (
              <div key={index} className="header-labels">
                {fpValues.map(
                  (value, idx) =>
                    value.rate !== "" &&
                    value.price !== "" && (
                      <React.Fragment key={idx}>
                        <div className="input-values">
                          {renderValue(value.rate) ? `$${value.rate}` : "N/A"}
                        </div>
                        <div className="input-values">
                          {renderValue(value.price) ? `${value.price}%` : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
              </div>
            )}
          </div>

          <div className="field-container">
            <div className="field-name">
              Program Fee
              <span>
                Covers operating and administrative costs associated with
                investment program
              </span>
            </div>
            <div className="header-labels">
              {programFeeValues &&
                programFeeValues.map(
                  (value, index) =>
                    value.rate !== "" &&
                    value.price !== "" && (
                      <React.Fragment key={index}>
                        <div className="input-values">
                          {value && renderValue(value.rate)
                            ? `${value.rate}%`
                            : "N/A"}
                        </div>
                        <div className="input-values">
                          {value && renderValue(value.price)
                            ? `$${value.price}`
                            : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">
              Strategist Fee (if applicable)
              <span>
                A fee that may be charged by the Strategist for asset allocation
              </span>
            </div>
            <div className="header-labels">
              {strategistFeeValues &&
                strategistFeeValues.map((value, index) => (
                  <React.Fragment key={index}>
                    <div className="input-values">
                      {value && value.rate && value.rate !== "N/A" ? `${value.rate}%` : "N/A"}
                    </div>
                    <div className="input-values">
                      {value && value.price && value.price !== "N/A" ? `$${value.price}` : "N/A"}
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div className="field-container">
            <div className="field-name">
              Total Account Fee (annualized)
              <span>
                A fee that may be charged by the Strategist for asset allocation
              </span>
            </div>
            <div className="header-labels">            
              {totalAccountFeeValues &&
                totalAccountFeeValues.map((value, index) => (
                  <React.Fragment key={index}>
                    <div className="input-values">
                      {value && value.rate && value.rate !== "N/A" ? `${value.rate}%` : "N/A"}
                    </div>
                    <div className="input-values">
                      {value && value.price && value.price !== "N/A" ? `$${value.price}` : "N/A"}
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">
              Fund Expenses**
              <span>
                Annual sum of the Financial Professional Fee, Program Fee, and
                Strategist Fee debited from your account
              </span>
            </div>
            <div className="header-labels">
              {fundExpenses &&
                fundExpenses.map(
                  (data, index) =>
                    data?.rate !== "" &&
                    data?.price !== "" && (
                      <React.Fragment key={index}>
                        <div className="input-values">
                          {renderValue(data?.rate) ? `${data.rate}%` : "N/A"}
                        </div>
                        <div className="input-values">
                          {renderValue(data?.price) ? `$${data.price}` : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">
              Total Client Fees (including Fund Expenses)
              <span></span>
            </div>
            <div className="header-labels">
              {totalClientFeeValues &&
                totalClientFeeValues.map(
                  (data, index) =>
                    data?.rate !== "" &&
                    data?.price !== "" && (
                      <React.Fragment key={index}>
                        <div className="input-values">
                          {renderValue(data?.rate) ? `${data.rate}%` : "N/A"}
                        </div>
                        <div className="input-values">
                          {renderValue(data?.price) ? `$${data.price}` : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">
              Gross Annual Fee to Financial Professional
              <span></span>
            </div>
            <div className="header-labels">
              {grossAnnualFeeValues &&
                grossAnnualFeeValues.map(
                  (data, index) =>
                    data?.rate !== "" &&
                    data?.price !== "" && (
                      <React.Fragment key={index}>
                        <div className="input-values">
                          {renderValue(data?.rate) ? `${data.rate}%` : "N/A"}
                        </div>
                        <div className="input-values">
                          {renderValue(data?.price) ? `$${data.price}` : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">
              Fund Expenses
              <span></span>
            </div>
            <div className="header-labels">
              {fundExpenses &&
                fundExpenses.map(
                  (data, index) =>
                    data?.rate !== "" &&
                    data?.price !== "" && (
                      <React.Fragment key={index}>
                        <div className="input-values">
                          {renderValue(data?.rate) ? `${data.rate}%` : "N/A"}
                        </div>
                        <div className="input-values">
                          {renderValue(data?.price) ? `$${data.price}` : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
            </div>
          </div>

          <div className="field-container">
            <div className="field-name">
              Household Value
              <span></span>
            </div>
            <div className="header-labels">
              {houseHoldValue &&
                houseHoldValue.map(
                  (data, index) =>
                    data?.rate !== "" &&
                    data?.price !== "" && (
                      <React.Fragment key={index}>
                        <div className="input-values">
                          {renderValue(data?.rate) ? `${data.rate}%` : "N/A"}
                        </div>
                        <div className="input-values">
                          {renderValue(data?.price) ? `$${data.price}` : "N/A"}
                        </div>
                      </React.Fragment>
                    )
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">Financial Professional Fee Type</div>
            <div className="header-labels">
              {calculationData["FPfeeType"] &&
                calculationData["FPfeeType"].map((feeType, index) =>
                  feeType !== "" ? (
                    <div key={index} className="header-label three-column">
                      {feeType}
                    </div>
                  ) : null
                )}
            </div>
          </div>
          <div className="field-container">
            <div className="field-name">Program Selected</div>
            <div className="header-labels">
              {calculationData["paymentOption"] &&
                calculationData["paymentOption"].map((data, index) =>
                  data !== "" ? (
                    <div key={index} className="header-label three-column">
                      {data}
                    </div>
                  ) : null
                )}
            </div>
          </div>

          <div className="field-container">
            <div className="field-name">
              Financial Professional AUA discount applied
            </div>
            {calculationData["AdditionalDetails"] &&
              calculationData["AdditionalDetails"].map((data, index) =>
                data?.auaDiscount && calculationData["scenario-name"][index] ? (
                  <div key={index} className="header-labels">
                    <div className="header-label three-column">
                      {data.auaDiscount}
                    </div>
                  </div>
                ) : null
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
