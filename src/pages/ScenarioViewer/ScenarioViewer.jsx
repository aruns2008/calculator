import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/button/Button";
import StepFooter from "../../components/StepFooter/StepFooter";
import Modal from "../../components/Modal/Modal";
import ExportToPDF from "../../components/ExportToPDF/ExportToPDF";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { retrieveData } from "../../utils/dynamoDB";
import formatDate from "../../utils/dateFormatter";

const ScenarioViewer = () => {  
  const navigate = useNavigate();
  const location = useLocation();

  // Function to parse query parameters
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const query = useQuery();
  const scenarioId = query.get("scenarioId");

  const [retrievedData, setRetrievedData] = useState(null);

  useEffect(() => {
    if (scenarioId) {
      const fetchData = async () => {
        const data = await retrieveData(scenarioId);
        setRetrievedData(data);
      };
      fetchData();
    }
  }, [scenarioId]);

  if (!retrievedData) {
    return <div>No Data Found</div>;
  }

  const {
    name,
    fpValues,
    accountValue,
    fundExpenses,
    fpPayout,
    houseHoldValue,
    feeType,
    programFeeValues,
    strategistFeeValues,
    totalAccountFeeValues,
    totalClientFeeValues,
    grossAnnualFeeValues,
    netAnnualFeeValues,
  } = retrievedData;

  const renderValue = (value) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "N/A" &&
      value !== ""
    ) {
      return value;
    }
    return "N/A";
  };

  const renderTableWrapper = () => (
    <div className="table-wrapper">
      <div className="title-block">
        <h1>Investment Account Fee Estimate</h1>
        <p>As of Date: {renderValue(formatDate(new Date()))}</p>
      </div>
      <div className="field-container rate-dollar">
        <div className="field-name"></div>
       
           {accountValue.map(
              (value, idx) =>
                value.rate !== "" &&
                value.price !== "" && (
                  <React.Fragment key={idx}>
                     <div key={idx} className="header-labels">
                <div className="header-label">Rate (%)</div>
                <div className="header-label">Price ($)</div>
              </div>
                  </React.Fragment>
                )
            )}
      </div>
      <div className="field-container black-section">
        <div className="field-name">Fee Details and Scenario Assumptions</div>
        {retrievedData.scenarios &&
          retrievedData.scenarios.map((name, idx) =>
            renderValue(retrievedData.scenarios[idx]) ? (
              <div key={idx} className="header-label three-column">
                {retrievedData.scenarios[idx]}
              </div>
            ) : null
          )}
      </div>
      <div className="field-container">
        <div className="field-name">Account Value</div>
        {fpValues.length > 0 && (
          <div className="header-labels">
            {accountValue.map(
              (value, idx) =>
                value.rate !== "" &&
                value.price !== "" && (
                  <React.Fragment key={idx}>
                    <div className="input-values">
                      {renderValue(value.rate) !== "N/A"
                        ? `${value.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(value.price) !== "N/A"
                        ? `$${value.price}`
                        : "N/A"}
                    </div>
                  </React.Fragment>
                )
            )}
          </div>
        )}
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
          <div className="header-labels">
            {fpValues.map(
              (value, idx) =>
                value.rate !== "" &&
                value.price !== "" && (
                  <React.Fragment key={idx}>
                    <div className="input-values">
                      {renderValue(value.rate) !== "N/A"
                        ? `${value.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(value.price) !== "N/A"
                        ? `$${value.price}`
                        : "N/A"}
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
            Covers operating and administrative costs associated with investment
            program
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
                      {renderValue(value.rate) !== "N/A"
                        ? `${value.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(value.price) !== "N/A"
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
                  {renderValue(value?.rate) !== "N/A"
                    ? `${renderValue(value?.rate)}%`
                    : "N/A"}
                </div>
                <div className="input-values">
                  {renderValue(value?.price) !== "N/A"
                    ? `$${renderValue(value?.price)}`
                    : "N/A"}
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
                  {renderValue(value?.rate) !== "N/A"
                    ? `${renderValue(value?.rate)}%`
                    : "N/A"}
                </div>
                <div className="input-values">
                  {renderValue(value?.price) !== "N/A"
                    ? `$${renderValue(value?.price)}`
                    : "N/A"}
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
                      {renderValue(data?.rate) !== "N/A"
                        ? `${data.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(data?.price) !== "N/A"
                        ? `$${data.price}`
                        : "N/A"}
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
                      {renderValue(data?.rate) !== "N/A"
                        ? `${data.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(data?.price) !== "N/A"
                        ? `$${data.price}`
                        : "N/A"}
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
                      {renderValue(data?.rate) !== "N/A"
                        ? `${data.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(data?.price) !== "N/A"
                        ? `$${data.price}`
                        : "N/A"}
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
                      {renderValue(data?.rate) !== "N/A"
                        ? `${data.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(data?.price) !== "N/A"
                        ? `$${data.price}`
                        : "N/A"}
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
                      {renderValue(data?.rate) !== "N/A"
                        ? `${data.rate}%`
                        : "N/A"}
                    </div>
                    <div className="input-values">
                      {renderValue(data?.price) !== "N/A"
                        ? `$${data.price}`
                        : "N/A"}
                    </div>
                  </React.Fragment>
                )
            )}
        </div>
      </div>
      <div className="field-container">
        <div className="field-name">Financial Professional Fee Type</div>
        <div className="header-labels">
          {retrievedData["feeType"] &&
            retrievedData["feeType"].map((feeType, index) =>
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
          {retrievedData["programFee"] &&
            retrievedData["programFee"].map((data, index) =>
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
        {retrievedData.AUAdiscount &&
          retrievedData.AUAdiscount.map((data, index) =>
            data?.auaDiscount  ? (
              <div key={index} className="header-labels">
                <div className="header-label three-column">
                  {data.auaDiscount >= 0 ? `${data.auaDiscount}%` :data.auaDiscount }
                </div>
              </div>
            ) : null
          )}
      </div>
    </div>
  );

  return (
    <div className="scenario-viewer">
      <>
        <div className="headerContainer">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/16a0bf8ee9915a3c1274ab46ee5f5cd31e6b2e149ae5785312a1e6ed4b606161?apiKey=f95b5ca361ef4526b1cb461f7b2405ea&"
            className="logoImage"
          />
        </div>
      </>
      <div className="result-section-container">
        {Array.isArray(accountValue) ? (
          renderTableWrapper()
        ) : (
          <div className="investment-container active">
            <div className="header">
              <div className="title-block">
                <h1>
                  {renderValue(name) || "Investment Account Fee Estimate 1"}
                </h1>
                <p>As of Date: {renderValue(formatDate(new Date()))}</p>
              </div>
              <div className="actions"></div>
            </div>
            <div className="fee-details">
              <div className="left-section-heading">
                <div className="section-title">
                  Financial Professional Payout
                </div>
                <div className="section-title-icons">
                  <span className="section-title icons">Rate (%)</span>
                  <span className="section-title icons">Price ($)</span>
                </div>
              </div>
              <div className="results-divider sub"></div>
              <div className="results-item">
                <div className="label">Financial Professional Fee</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(fpValues?.rate) !== "N/A"
                      ? `${renderValue(fpValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(fpValues?.price) !== "N/A"
                      ? `$${renderValue(fpValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Program Fee</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(programFeeValues?.rate) !== "N/A"
                      ? `${renderValue(programFeeValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(programFeeValues?.price) !== "N/A"
                      ? `$${renderValue(programFeeValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Strategist Fee (if applicable)</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(strategistFeeValues?.rate) !== "N/A"
                      ? `${renderValue(strategistFeeValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(strategistFeeValues?.price) !== "N/A"
                      ? `$${renderValue(strategistFeeValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Total Account Fee (annualized)</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(totalAccountFeeValues?.rate) !== "N/A"
                      ? `${renderValue(totalAccountFeeValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(totalAccountFeeValues?.price) !== "N/A"
                      ? `$${renderValue(totalAccountFeeValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">
                  Total Client Fees (including Fund Expenses)
                </div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(totalClientFeeValues?.rate) !== "N/A"
                      ? `${renderValue(totalClientFeeValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(totalClientFeeValues?.price) !== "N/A"
                      ? `$${renderValue(totalClientFeeValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">
                  Gross Annual Fee to Financial Professional
                </div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(grossAnnualFeeValues?.rate) !== "N/A"
                      ? `${renderValue(grossAnnualFeeValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(grossAnnualFeeValues?.price) !== "N/A"
                      ? `$${renderValue(grossAnnualFeeValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">
                  Net Annual Fee to Financial Professional
                </div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(netAnnualFeeValues?.rate) !== "N/A"
                      ? `${renderValue(netAnnualFeeValues?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(netAnnualFeeValues?.price) !== "N/A"
                      ? `$${renderValue(netAnnualFeeValues?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Account Value</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(accountValue[0]?.rate) !== "N/A"
                      ? `${renderValue(accountValue[0]?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">
                    {renderValue(accountValue[0]?.price) !== "N/A"
                      ? `$${renderValue(accountValue[0]?.price)}`
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Fund Expenses</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(fundExpenses?.rate) !== "N/A"
                      ? `${renderValue(fundExpenses?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">N/A</div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Financial Professional Payout</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(fpPayout?.rate) !== "N/A"
                      ? `${renderValue(fpPayout?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">N/A</div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Household Value</div>
                <div className="value-container">
                  <div className="value">
                    {renderValue(houseHoldValue?.rate) !== "N/A"
                      ? `${renderValue(houseHoldValue?.rate)}%`
                      : "N/A"}
                  </div>
                  <div className="value">N/A</div>
                </div>
              </div>
              <div className="results-divider"></div>
              <div className="results-item">
                <div className="label">Fee Type</div>
                <div className="value-container types">
                  <div className="value">{renderValue(feeType) || "N/A"}</div>
                </div>
              </div>
              <div className="results-divider"></div>
            </div>
          </div>
        )}
      </div>

      <div className="footer-container">
        <StepFooter from={"scenario-viewer"}></StepFooter>
      </div>
    </div>
  );
};

export default ScenarioViewer;
