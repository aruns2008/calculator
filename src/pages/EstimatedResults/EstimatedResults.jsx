import React, { useEffect, useState, useRef } from "react";
import estimatedResults from "./EstimatedResults.css";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter/StepFooter";
import { useCalculationStorage } from "../../context/StorageContext";
import Comparison from "../../components/Comparison/Comparison";
import Modal from "../../components/Modal/Modal";
import ExportToPDF from "../../components/ExportToPDF/ExportToPDF";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { storeData, retrieveData } from "../../utils/dynamoDB";
import formatDate from "../../utils/dateFormatter";
import { useParams } from "react-router-dom";
const EstimatedResults = () => {  
  const navigate = useNavigate();
  const { scenarioId } = useParams();
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
  } = useCalculationStorage();

  const [dates, setDates] = useState([]);
  const tablesIndex = [0, 1, 2];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [showShareModal, setShareModal] = useState(false);
  const [shareDate, setShareDate] = useState();
  const [link, setLink] = useState("");
  useEffect(() => {
    const fetchedDates = getCalculationDataValue("currentDate");
    setDates(fetchedDates);
  }, [getCalculationDataValue("currentDate")]);

  const componentRef = useRef(null);

  const handleViewComparison = () => {
    componentRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const numberToArray = (index) => {
    return Array.from({ length: index + 1 }, (_, i) => i);
  };
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {})
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleNewEstimate = () => {
    const accountValues = getCalculationDataValue("account-value") || [];
    const calculationLength = accountValues.length;
    if (index < 2) {     
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
    // if (index < 2) {
    //   setIndex(index + 1);
    //   navigate("/");
    // }
  };

  const tableArray = numberToArray(index);
  const handleRedirect = () => {
    navigate("/");
  };

  const handleOpenModal = (index) => {
    setShowDeleteModal(true);
    setDeleteIndex(index);
  };

  const handleCloseModal = (text) => {
    if (text == "confirm") {
      handleDelete(deleteIndex);
    }
    setShowDeleteModal(false);
    setShowPDFModal(false);
    setDeleteIndex("");
    setShareModal(false);
  };
  const handleOpenPDFModal = (index) => {
    setShowPDFModal(true);
    setPdfIndex(index);
  };
  const [showPdf, setShowPdf] = useState(false);
  const [pdfType, setPdfType] = useState("");
  const [pdfIndex, setPdfIndex] = useState();
  const [shareIndex, setShareIndex] = useState();
  const [shareType, setShareType] = useState();
  const handlePdfGeneration = (type, index) => {
    setShowPdf(true);
    setPdfType(type);
    setShowPDFModal(false);
  };
  const formatId = (name) => name.replace(/\s+/g, "");

  // const handleShare = async (index, type) => {
  //   setShareIndex(index);
  //   setShareType(type);
  //   const currentDate = new Date();
  //   setShareDate(formatDate(currentDate));
  //   const scenarioName =
  //     getCalculationDataValue("scenario-name")[index] || "test";
  //   setLink(
  //     `http://localhost:3001/scenario-viewer?scenarioId=${formatId(
  //       scenarioName
  //     )}`
  //   );
  //   setShareModal(true);
  // };

  const handleShare = async (index, type) => {
    setShareIndex(index);
    setShareType(type);
    const currentDate = new Date();
    setShareDate(formatDate(currentDate));  
    const scenarioName = getCalculationDataValue("scenario-name")[index] || "test";
    const baseURL = window.location.origin;
    const shareLink = `${baseURL}/scenario-viewer?scenarioId=${formatId(scenarioName)}`;
    setLink(shareLink);
    setShareModal(true);
  };
  

  const handleAgreeAndContinue = async () => {    
    let scenarioName = "";
    let data = {};
    if (shareType === "group-scenario") {
      scenarioName = getCalculationDataValue("scenario-name")[0] || "test";
      const AUAdiscount = getCalculationDataValue("AdditionalDetails");
      const scenarioNames = getCalculationDataValue("scenario-name");
      const formattedId = formatId(scenarioName);
      data = {
        name: scenarioName,
        id: formattedId,
        fpValues: fpValues,
        scenarios: scenarioNames,
        accountValue: accountValue,
        fundExpenses: fundExpenses,
        fpPayout: fpPayout,
        houseHoldValue: houseHoldValue,
        feeType: feeType,
        programFee: programFee,
        programFeeValues: programFeeValues,
        strategistFeeValues: strategistFeeValues,
        totalAccountFeeValues: totalAccountFeeValues,
        totalClientFeeValues: totalClientFeeValues,
        grossAnnualFeeValues: grossAnnualFeeValues,
        netAnnualFeeValues: netAnnualFeeValues,
        AUAdiscount: AUAdiscount,
      };
    } else {
      scenarioName =
        getCalculationDataValue("scenario-name")[shareIndex] || "test";
      const formattedId = formatId(scenarioName);
      data = {
        name: scenarioName,
        id: formattedId,
        fpValues: fpValues[shareIndex],
        scenarios: scenarioName,
        accountValue: accountValue[shareIndex],
        fundExpenses: fundExpenses[shareIndex],
        fpPayout: fpPayout[shareIndex],
        houseHoldValue: houseHoldValue[shareIndex],
        feeType: feeType[shareIndex],
        programFee: programFee[shareIndex],
        programFeeValues: programFeeValues[shareIndex],
        strategistFeeValues: strategistFeeValues[shareIndex],
        totalAccountFeeValues: totalAccountFeeValues[shareIndex],
        totalClientFeeValues: totalClientFeeValues[shareIndex],
        grossAnnualFeeValues: grossAnnualFeeValues[shareIndex],
        netAnnualFeeValues: netAnnualFeeValues[shareIndex],
      };
    }

    await storeData(data);
    setShareModal(false);
  };
  return (
    <div className="estimated-results">
      <div className="headerContainer">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/16a0bf8ee9915a3c1274ab46ee5f5cd31e6b2e149ae5785312a1e6ed4b606161?apiKey=f95b5ca361ef4526b1cb461f7b2405ea&"
          className="logoImage"
        />
      </div>
      <div className="results-section">
        <div className="pdf-sectionn">
          <ExportToPDF
            dates={dates}
            showPdf={showPdf}
            pdfType={pdfType}
            pdfIndex={pdfIndex}
            setShowPdf={setShowPdf}
            setPdfType={setPdfType}
            setPdfIndex={setPdfIndex}
          />
        </div>
        <div className="section-container">
          <div className="left-subSection">
            <div className="breadcrumb">
              <span className="breadcrumb-item">WealthPort</span>
              <span className="breadcrumb-separator">{">"}</span>
              <span className="breadcrumb-item" onClick={handleRedirect}>
                WealthPort Calculator
              </span>
              <span className="breadcrumb-separator">{">"}</span>
              <span className="breadcrumb-item active">Estimated Results</span>
            </div>
            <div className="heading-section">
              <p>Estimated Results</p>
              <div className="heading-buttons">
                <Button
                  text={"Create New Estimate"}
                  configuresStyles={"result-button"}
                  onClick={handleNewEstimate}
                ></Button>
                <Button
                  text={"View Comparison"}
                  configuresStyles={"result-button"}
                  onClick={handleViewComparison}
                ></Button>
              </div>
            </div>
            {tablesIndex.map((table, index) => (
              <div
                key={table}
                className={`investment-container ${
                  accountValue[index] && accountValue[index].price !== ""
                    ? "active"
                    : ""
                }`}
              >
                <div className="header">
                  <div className="title-block">
                    <h1>
                      {getCalculationDataValue("scenario-name")[index] ||
                        "Investment Account Fee Estimate 1"}
                    </h1>
                    <p>As of Date: {dates[index] ? dates[index] : ""}</p>
                  </div>
                  <div className="actions">
                    <Button
                      onClick={() => handleEdit(index)}
                      text={"Edit"}
                      configuresStyles={"result-button action-button"}
                    ></Button>
                    <Button
                      onClick={() => {
                        handleOpenModal(index);
                      }}
                      text={"Delete"}
                      configuresStyles={"result-button action-button"}
                    ></Button>
                    <Button
                      text={"Share"}
                      onClick={() => handleShare(index, "individual-scenario")}
                      configuresStyles={"result-button action-button"}
                    ></Button>
                    <Button
                      text={"Export ▼"}
                      onClick={() => handleOpenPDFModal(index)}
                      configuresStyles={"result-button action-button"}
                    ></Button>
                  </div>
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
                  <div className="estimated-results-item">
                    <div className="label">Financial Professional Fee</div>
                    <div className="value-container">
                      <div className="value">
                        {fpValues[index]?.rate
                          ? `${fpValues[index]?.rate}%`
                          : "N/A"}
                      </div>
                      <div className="value">
                        {fpValues[index]?.price
                          ? `$${Number(
                              fpValues[index]?.price
                            ).toLocaleString()}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="estimated-results-item">
                    <div className="label">Program Fee</div>

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
                  <div className="estimated-results-item">
                    <div className="label">Strategist Fee (if applicable)</div>

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
                  <div className="estimated-results-item">
                    <div className="label">Total Account Fee (annualized)</div>

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
                  <div className="estimated-results-item">
                    <div className="label">
                      Total Client Fees (including Fund Expenses)
                    </div>

                    <div className="value-container">
                      <div className="value">
                        {/* {totalClientFeeValues[index]?.rate */}
                        {totalClientFeeValues[index]?.rate &&
                        !isNaN(totalClientFeeValues[index]?.rate) &&
                        totalClientFeeValues[index]?.rate !== ""
                          ? `${Number(
                              totalClientFeeValues[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
                      <div className="value">
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
                  <div className="estimated-results-item">
                    <div className="label">
                      Gross Annual Fee to Financial Professional
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {grossAnnualFeeValues[index]?.rate &&
                        !isNaN(grossAnnualFeeValues[index]?.rate) &&
                        grossAnnualFeeValues[index]?.rate !== ""
                          ? `${Number(
                              grossAnnualFeeValues[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
                      <div className="value">
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
                  <div className="estimated-results-item">
                    <div className="label">
                      Net Annual Fee to Financial Professional
                    </div>
                    <div className="value-container">
                      <div className="value">
                        {netAnnualFeeValues[index]?.rate &&
                        netAnnualFeeValues[index]?.rate !== "N/A"
                          ? `${Number(
                              netAnnualFeeValues[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
                      <div className="value">
                        {netAnnualFeeValues[index]?.price &&
                        netAnnualFeeValues[index]?.price !== "N/A"
                          ? `$${Number(
                              netAnnualFeeValues[index]?.price
                            ).toLocaleString()}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="estimated-results-item">
                    <div className="label">Account Value</div>
                    <div className="value-container">
                      <div className="value">
                        {accountValue[index]?.rate
                          ? `${Number(
                              accountValue[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
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
                  <div className="estimated-results-item">
                    <div className="label">Fund Expenses</div>
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
                  <div className="estimated-results-item">
                    <div className="label">Financial Professional Payout</div>
                    <div className="value-container">
                      <div className="value">
                        {fpPayout[index]?.rate
                          ? `${Number(fpPayout[index]?.rate).toLocaleString()}%`
                          : "N/A"}
                      </div>
                      <div className="value">N/A</div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="estimated-results-item">
                    <div className="label">Household Value</div>
                    <div className="value-container">
                      <div className="value">
                        {houseHoldValue[index]?.rate
                          ? `${Number(
                              houseHoldValue[index]?.rate
                            ).toLocaleString()}%`
                          : "N/A"}
                      </div>
                      <div className="value">N/A</div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                  <div className="estimated-results-item">
                    <div className="label">Fee Type</div>
                    <div className="value-container types">
                      <div className="value">{feeType[index] || "N/A"}</div>
                    </div>
                  </div>
                  <div className="results-divider"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="right-sub-section">
            <div className="sub-section">
              <p className="get-started-heading">Ready to get started?</p>
              <p className="get-started-paragraph">
                WealthPort gives the financial professional the ability to serve
                their clients according to their unique business model while
                choosing from, and using, multiple management styles based on
                their investing clients preference. WealthPort also provides a
                suite of technology solutions to support these choices.
              </p>
              <p className="get-started-paragraph tail-end">
                Questions? Contact the Advisory Solutions Team
                (advisory.solutions@cir2.com) at 800-777-6080.
              </p>

              <button className="get-started-button">Contact Us</button>
            </div>
          </div>
        </div>
        <div ref={componentRef} className="bottom-section">
          <Comparison
            handleShare={handleShare}
            handlePdfGeneration={handlePdfGeneration}
          />
        </div>
      </div>

      <Modal
        show={showShareModal}
        onClose={handleCloseModal}
        providedName={"share-modal"}
      >
        <div className="modal-content">
          <h2 className="modal-title">Save Estimate</h2>
          <h4 className="modal-subtitle">Public server acknowledgment</h4>
          <div className="notification">
            <CheckCircleOutlineIcon
              sx={{ fill: "white", width: "20px", height: "20px" }}
            />
            <p className="modal-notification-message">
              Your "My Estimate" has been saved successfully. Last update:
              <span>{shareDate}</span>
            </p>
          </div>
          <div className="share-link">
            <label className="modal-share-link-label">Public Share Link:</label>
            <p className="modal-notification-link-message">
              Public Share Link Copy and save or bookmark this link for your
              records. You must use the link below to retrieve your estimate.
              This link will expire after 1 year.
            </p>
            <div className="share-link-section">
              <input type="text" value={link} readOnly />
              <button className="copy-button" onClick={handleCopyLink}>
                Copy Public Link
              </button>
            </div>
          </div>
          <div className="actions">
            <button className="cancel-button" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="agree-button" onClick={handleAgreeAndContinue}>
              Agree and Continue
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        show={showPDFModal}
        providedName={"pdf-modal"}
        onClose={handleCloseModal}
      >
        <span className="line"></span>
        <p className="pdf-modal-heading">DOWNLOAD YOUR RESULTS</p>
        <p
          className="pdf-modal-desc"
          onClick={() => handlePdfGeneration("internal", index)}
        >
          Download your results to PDF, including FP payout information not
          intended for client use
        </p>
        <p className="pdf-modal-heading">SHARE WITH A CLIENT</p>
        <p
          className="pdf-modal-desc"
          onClick={() => handlePdfGeneration("client", index)}
        >
          Download a Printable PDF that can be shared with a client
        </p>
      </Modal>
      <Modal show={showDeleteModal} onClose={handleCloseModal}>
        <p className="modal-heading">Confirm Delete ?</p>
        <p className="modal-desc">
          Scenario Name :{" "}
          {getCalculationDataValue("scenario-name")[deleteIndex]}
        </p>
        <div className="modal-buttons">
          <button
            className="confirm-button"
            onClick={() => {
              handleCloseModal("confirm");
            }}
          >
            Confirm
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              handleCloseModal("cancel");
            }}
          >
            Close
          </button>
        </div>
      </Modal>

      <div className="footer-container">
        <StepFooter from={"estimated-results"}></StepFooter>
      </div>
    </div>
  );
};

export default EstimatedResults;
