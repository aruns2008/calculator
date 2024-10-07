import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ExportToPDF.css";
import { useCalculationStorage } from "../../context/StorageContext";

const ExportToPDF = ({
  dates,
  showPdf,
  pdfType,
  pdfIndex,
  setShowPdf,
  setPdfType,
  setPdfIndex,
}) => {
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
    calculationData,
  } = useCalculationStorage();
  const index = pdfIndex;
  const printRef = useRef();

  useEffect(() => {
    if (showPdf === true) {
      handlePrint();
    }
  }, [showPdf]);

  const handlePrint = () => {
    const input = printRef.current;
    const originalDisplay = input.style.display;
    input.style.display = "block";
    input.style.padding = "20px";
    input.style.width = "100%";
    input.style.maxWidth = "800px";
    input.style.margin = "auto";

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("download.pdf");

      // Revert the styles back to original
      input.style.display = originalDisplay;
      input.style.padding = "";
      input.style.width = "";
      input.style.margin = "";

      setShowPdf(false);
      setPdfType("");
      setPdfIndex("");
    });
  };

  const renderValue = (value) => {
    if (value)
      return (
        value !== undefined && value !== null && value !== "" && value !== "N/A"
      );
  };

  const getCurrentDate = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const safeIndex =
    Array.isArray(getCalculationDataValue("scenario-name")) &&
    index < getCalculationDataValue("scenario-name").length
      ? index
      : null;
  const safeDateIndex =
    Array.isArray(dates) && index < dates.length ? index : null;

  const formatNumber = (number) => {
    if (typeof number === "number" || !isNaN(Number(number))) {
      return Number(number).toLocaleString("en-US");
    }
    return number;
  };
  return (
    <div>
      <div ref={printRef} style={{ display: "none" }}>
        <div className="pdf-container">
          <div className="header">
            <div className="title-block">
              <h1>
                {(safeIndex !== null &&
                  getCalculationDataValue("scenario-name")[safeIndex]) ||
                  "Investment Account Fee Estimate 1"}
              </h1>
              <p>
                As of Date:{" "}
                {safeDateIndex !== null && dates[safeDateIndex]
                  ? dates[safeDateIndex]
                  : getCurrentDate()}
              </p>
            </div>
            <div className="actions">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/16a0bf8ee9915a3c1274ab46ee5f5cd31e6b2e149ae5785312a1e6ed4b606161?apiKey=f95b5ca361ef4526b1cb461f7b2405ea&"
                className="logoImage"
              />
            </div>
          </div>
          <div className="fee-details">
            {pdfType === "comparison" ? (
              <div className="comparison-pdf">
                <div className="table-wrapper">
                  <div className="field-container rate-doller">
                    <div className="field-name"></div>
                    {calculationData["scenario-name"] &&
                      calculationData["scenario-name"].map((scenario, idx) =>
                        calculationData["scenario-name"][idx] !== "" ? (
                          <div key={idx} className="header-labels">
                            <div className="header-label">Rate (%)</div>
                            <div className="header-label">Price ($)</div>
                          </div>
                        ) : null
                      )}
                  </div>
                  <div className="field-container black-section">
                    <div className="field-name">Scenario Name</div>

                    <div key={index} className="header-labels">
                      {calculationData["scenario-name"] &&
                        calculationData["scenario-name"].map((name, idx) =>
                          renderValue(calculationData["scenario-name"][idx]) ? (
                            <div
                              key={idx}
                              className="header-label three-column"
                            >
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
                            <div
                              key={idx}
                              className="header-label three-column"
                            >
                              {`$${formatNumber(value)}`}
                            </div>
                          ) : null
                        )}
                    </div>
                  </div>
                  <div className="field-container">
                    <div className="field-name">Financial Professional Fee</div>
                    {fpValues.length > 0 && (
                      <div key={index} className="header-labels">
                        {fpValues.map(
                          (value, idx) =>
                            value.rate !== "" &&
                            value.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {renderValue(value.rate)
                                    ? `${Number(value.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {renderValue(value.price)
                                    ? `$${Number(value.price).toLocaleString()}`
                                    : "N/A"}
                                </div>
                              </React.Fragment>
                            )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="field-container">
                    <div className="field-name">Program Fee</div>
                    <div className="header-labels">
                      {programFeeValues &&
                        programFeeValues.map(
                          (value, idx) =>
                            value.rate !== "" &&
                            value.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {value && renderValue(value.rate)
                                    ? `${Number(value.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {value && renderValue(value.price)
                                    ? `$${Number(value.price).toLocaleString()}`
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
                    </div>
                    <div className="header-labels">
                      {calculationData["account-value"] &&
                        calculationData["account-value"].map(
                          (accValue, idx) => {
                            if (accValue === "") return null;
                            const feeValue = strategistFeeValues[idx] || {
                              rate: "N/A",
                              price: "N/A",
                            };

                            return (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {feeValue.rate && feeValue.rate !== "N/A"
                                    ? `${Number(
                                        feeValue.rate
                                      ).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {feeValue.price && feeValue.price !== "N/A"
                                    ? `$${Number(
                                        feeValue.price
                                      ).toLocaleString()}`
                                    : "N/A"}
                                </div>
                              </React.Fragment>
                            );
                          }
                        )}
                    </div>
                  </div>

                  <div className="field-container">
                    <div className="field-name">
                      Total Account Fee (annualized)
                    </div>
                    <div className="header-labels">
                      {calculationData["account-value"] &&
                        calculationData["account-value"].map(
                          (accValue, idx) => {
                            if (accValue === "") return null;
                            const feeValue = totalAccountFeeValues[idx] || {
                              rate: "N/A",
                              price: "N/A",
                            };

                            return (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {feeValue.rate && feeValue.rate !== "N/A"
                                    ? `${Number(
                                        feeValue.rate
                                      ).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {feeValue.price && feeValue.price !== "N/A"
                                    ? `$${Number(
                                        feeValue.price
                                      ).toLocaleString()}`
                                    : "N/A"}
                                </div>
                              </React.Fragment>
                            );
                          }
                        )}
                    </div>
                  </div>
                  <div className="field-container">
                    <div className="field-name">Fund Expenses**</div>
                    <div className="header-labels">
                      {fundExpenses &&
                        fundExpenses.map(
                          (data, idx) =>
                            data?.rate !== "" &&
                            data?.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {renderValue(data?.rate)
                                    ? `${Number(data.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {renderValue(data?.price)
                                    ? `$${Number(data.price).toLocaleString()}`
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
                          (data, idx) =>
                            data?.rate !== "" &&
                            data?.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {renderValue(data?.rate)
                                    ? `${Number(data.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {renderValue(data?.price)
                                    ? `$${Number(data.price).toLocaleString()}`
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
                          (data, idx) =>
                            data?.rate !== "" &&
                            data?.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {renderValue(data?.rate)
                                    ? `${Number(data.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {renderValue(data?.price)
                                    ? `$${Number(data.price).toLocaleString()}`
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
                          (data, idx) =>
                            data?.rate !== "" &&
                            data?.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {renderValue(data?.rate)
                                    ? `${Number(data.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {renderValue(data?.price)
                                    ? `$${Number(data.price).toLocaleString()}`
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
                          (data, idx) =>
                            data?.rate !== "" &&
                            data?.price !== "" && (
                              <React.Fragment key={idx}>
                                <div className="input-values">
                                  {renderValue(data?.rate)
                                    ? `${Number(data.rate).toLocaleString()}%`
                                    : "N/A"}
                                </div>
                                <div className="input-values">
                                  {renderValue(data?.price)
                                    ? `$${Number(data.price).toLocaleString()}`
                                    : "N/A"}
                                </div>
                              </React.Fragment>
                            )
                        )}
                    </div>
                  </div>
                  <div className="field-container">
                    <div className="field-name">
                      Financial Professional Fee Type
                    </div>
                    <div className="header-labels">
                      {calculationData["FPfeeType"] &&
                        calculationData["FPfeeType"].map((feeType, index) =>
                          feeType !== "" ? (
                            <div
                              key={index}
                              className="header-label three-column"
                            >
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
                            <div
                              key={index}
                              className="header-label three-column"
                            >
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
                        data?.auaDiscount &&
                        calculationData["scenario-name"][index] ? (
                          <div key={index} className="header-labels">
                            <div className="header-label three-column">
                              {data.auaDiscount}%
                            </div>
                          </div>
                        ) : null
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="left-section-heading">
                  <div className="section-title">Fee Type </div>
                  <div className="section-title-icons">
                    <span className="section-title icons">Rate (%)</span>
                    <span className="section-title icons">Price ($)</span>
                  </div>
                </div>
                <div className="results-divider sub"></div>
                <div className="row">
                  <div className="label">
                    Financial Professional Fee
                    <span>
                      Amount charged by your Financial Professional for
                      investment advisory services
                    </span>
                  </div>
                  <div className="value-container">
                    <div className="value">
                      {fpValues[index]?.rate
                        ? `${Number(fpValues[index]?.rate).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value">
                      {fpValues[index]?.price
                        ? `$${Number(fpValues[index]?.price).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label">
                    Program Fee
                    <span>
                      Covers operating and administrative costs associated with
                      investment program
                    </span>
                  </div>

                  <div className="value-container">
                    <div className="value">
                      {programFeeValues[index]?.rate
                        ? `${Number(
                            programFeeValues[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value">
                      {programFeeValues[index]?.price
                        ? `$${Number(
                            programFeeValues[index]?.price
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label">
                    Strategist Fee (if applicable)
                    <span>
                      A fee that may be charged by the Strategist for asset
                      allocation
                    </span>
                  </div>

                  <div className="value-container">
                    <div className="value">
                      {strategistFeeValues[index]?.rate &&
                      strategistFeeValues[index]?.rate !== "N/A"
                        ? `${Number(
                            strategistFeeValues[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value">
                      {strategistFeeValues[index]?.price &&
                      strategistFeeValues[index]?.price !== "N/A"
                        ? `$${Number(
                            strategistFeeValues[index]?.price
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label">
                    Total Account Fee (annualized)
                    <span>
                      A fee that may be charged by the Strategist for asset
                      allocation
                    </span>
                  </div>

                  <div className="value-container">
                    <div className="value">
                      {totalAccountFeeValues[index]?.rate &&
                      totalAccountFeeValues[index]?.rate !== "N/A"
                        ? `${Number(
                            totalAccountFeeValues[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value">
                      {totalAccountFeeValues[index]?.price &&
                      totalAccountFeeValues[index]?.price !== "N/A"
                        ? `$${Number(
                            totalAccountFeeValues[index]?.price
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label">
                    Fund Expenses***
                    <span>
                      Annual sum of the Financial Professional Fee, Program Fee,
                      and Strategist Fee debited from your account
                    </span>
                  </div>
                  <div className="value-container">
                    <div className="value">
                      {fundExpenses[index]?.rate
                        ? `${Number(
                            fundExpenses[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value">N/A</div>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label total_client_fee">
                    *Total Client Fees
                  </div>

                  <div className="value-container ">
                    <div className="value total_client_fee">
                      {totalClientFeeValues[index]?.rate &&
                      !isNaN(totalClientFeeValues[index]?.rate) &&
                      totalClientFeeValues[index]?.rate !== ""
                        ? `${Number(
                            totalClientFeeValues[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value total_client_fee">
                      {totalClientFeeValues[index]?.rate &&
                      !isNaN(totalClientFeeValues[index]?.rate) &&
                      totalClientFeeValues[index]?.rate !== ""
                        ? `$${Number(
                            totalClientFeeValues[index]?.price
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="results-divider"></div>
              </>
            )}

            {pdfType === "internal" && (
              <>
                <div className="left-section-heading optional">
                  <div className="section-title">
                    Financial Professional Payout
                  </div>
                  <div className="section-title-icons">
                    <span className="section-title icons">Rate (%)</span>
                    <span className="section-title icons">Price ($)</span>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label">
                    Gross Annual Fee to Financial Professional
                  </div>
                  <div className="value-container">
                    <div className="value second-table">
                      {grossAnnualFeeValues[index]?.rate &&
                      !isNaN(grossAnnualFeeValues[index]?.rate) &&
                      grossAnnualFeeValues[index]?.rate !== ""
                        ? `${Number(
                            grossAnnualFeeValues[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value second-table">
                      {grossAnnualFeeValues[index]?.price &&
                      !isNaN(grossAnnualFeeValues[index]?.price) &&
                      grossAnnualFeeValues[index]?.price !== ""
                        ? `$${Number(
                            grossAnnualFeeValues[index]?.price
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="results-divider"></div>
                <div className="row">
                  <div className="label second-table">
                    Net - Program fee paid by client was selected
                  </div>
                  <div className="value-container">
                    <div className="value second-table">
                      {netAnnualFeeValues[index]?.rate &&
                      netAnnualFeeValues[index]?.rate !== "N/A"
                        ? `${Number(
                            netAnnualFeeValues[index]?.rate
                          ).toLocaleString()}%`
                        : "N/A"}
                    </div>
                    <div className="value second-table">
                      {netAnnualFeeValues[index]?.price &&
                      netAnnualFeeValues[index]?.price !== "N/A"
                        ? `$${Number(
                            netAnnualFeeValues[index]?.price
                          ).toLocaleString()}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="results-divider"></div>

            {pdfType !== "comparison" && (
              <div className="pdf-bottom-section-parent">
                <div className="pdf-bottom-left">
                  <span className="bottom-section-heading">
                    Scenario Assumptions
                  </span>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Account Value
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {accountValue[index]?.price
                          ? `$${Number(
                              accountValue[index]?.price
                            ).toLocaleString()}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      WealthPort Household value
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {houseHoldValue[index]?.rate
                          ? `${Number(
                              houseHoldValue[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Financial Professional Fee Type
                    </div>
                    <div className="value-container types">
                      <div className="value">{feeType[index] || "N/A"}</div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Program Selected
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {calculationData["paymentOption"] &&
                        calculationData["paymentOption"][index]
                          ? calculationData["paymentOption"][index]
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Financial Professional AUA discount applied
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {calculationData["AdditionalDetails"][index] &&
                        calculationData["AdditionalDetails"][index]?.auaDiscount
                          ? calculationData["AdditionalDetails"][index]
                              ?.auaDiscount
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                </div>
                <div className="pdf-bottom-right">
                  <span className="bottom-section-heading">
                    Program Fee Schedule (UMA/SMA)
                  </span>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Account Value
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {accountValue[index]?.price
                          ? `$${Number(
                              accountValue[index]?.price
                            ).toLocaleString()}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      WealthPort Household value
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {houseHoldValue[index]?.rate
                          ? `${Number(
                              houseHoldValue[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Financial Professional Fee Type
                    </div>
                    <div className="value-container types">
                      <div className="value">{feeType[index] || "N/A"}</div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Program Selected
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {calculationData["paymentOption"] &&
                        calculationData["paymentOption"][index]
                          ? calculationData["paymentOption"][index]
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="row">
                    <div className="label pdf-bottom-section">
                      Financial Professional AUA discount applied
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {calculationData["AdditionalDetails"][index] &&
                        calculationData["AdditionalDetails"][index]?.auaDiscount
                          ? calculationData["AdditionalDetails"][index]
                              ?.auaDiscount
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                </div>
              </div>
            )}
            <div className="comparison-paragraph">
              <span>
                *The fee information displayed is a point-in-time estimate based
                on the information provided for this illustration and may vary
                from an actual account. Any fees represented in this tool are
                for illustrative purposes only and actual account fees will
                fluctuate over time depending on many factors including but not
                limited to, account value over time and any changes to
                investment strategy. Discounts displayed in this illustration
                may not apply initially or over time if qualifying requirements
                are not met or maintained. An undiscounted Program Fee Schedule
                can be located at the end of this document. This estimate does
                not constitute an agreement and does not supersede any client
                agreements or new account documentation. Client agreements and
                new account documentation should be reviewed with your financial
                professional to understand applicable fees and how they are
                assessed on an account. Strategist Fees are subject to change.
                Fees are shown annualized, however, will be charged at intervals
                throughout the year. **Fund expenses are operating costs
                incurred and charged by the investment companies that provide
                certain types of investment products. These expenses are not
                debited directly from an investment account, but do impact the
                performance of the investment product and therefore are
                important to consider when investing. Fund expenses displayed
                are an estimate and may change over time. Consult your financial
                professional to understand the impact these expenses may have on
                your account. CAAP® is a registered mark of Cambridge Investment
                Research, Inc. for its program for investment managers. CAAP and
                UMA have an annual minimum Program Fee of $250.00. There is no
                annual minimum Program Fee for CAAP Small Account Solutions.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportToPDF;
