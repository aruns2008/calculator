import React, { useState } from "react";
import "./AdditionalDetail.css";
import { useCalculationStorage } from "../../context/StorageContext";
import Radio from "../Radio/Radio";
import NumberInput from "../../components/NumberInput/NumberInput";
// import { Radio } from "@mui/material";
const AdditionalDetail = ({
  handleChange,
  getCalculationDataValue,
  setCalculationData,
  calculationData,
}) => {
  const { index, setIndex, formatCurrency } = useCalculationStorage();

  // State for the WealthPort AUA discount selection
  const [selectedDiscount, setSelectedDiscount] = useState(
    getCalculationDataValue("AdditionalDetails")[index]?.auaDiscount
  );
  const [fundExpenses, setFundExpenses] = useState(
    getCalculationDataValue("AdditionalDetails")[index]?.fundExpenses
  );
  const [fpPayOut, setFpPayOut] = useState(
    getCalculationDataValue("AdditionalDetails")[index]?.fpPayOut
  );
  const [houseHoldValue, setHouseHoldValue] = useState(
    getCalculationDataValue("AdditionalDetails")[index]?.houseHoldValue || ""
  );

  const handleDiscountChange = (event) => {    
    const { name, value } = event.target;    
    const formated_input = value;
    // Temporary variables to hold the updated values
    let updatedSelectedDiscount = selectedDiscount;
    let updatedFundExpenses = fundExpenses;
    let updatedFpPayOut = fpPayOut;
    let updatedHouseHoldValue = houseHoldValue;

    // Update the temporary variables based on the input change
    if (name === "auaDiscount") {
      updatedSelectedDiscount = value;
      setSelectedDiscount(value);
    } else if (name === "fundExpenses") {
      updatedFundExpenses = formated_input;
      setFundExpenses(formated_input);
    } else if (name === "fpPayOut") {
      updatedFpPayOut = formated_input;
      setFpPayOut(formated_input);
    } else if (name === "houseHoldValue") {
      updatedHouseHoldValue = formated_input;
      setHouseHoldValue(formated_input);
    }

    // Create and send custom event object with the updated values
    const eventObject = {
      target: {
        name: "AdditionalDetails",
        value: {
          fundExpenses: updatedFundExpenses.replace(/[^\d.]/g, ""),
          fpPayOut: updatedFpPayOut.replace(/[^\d.]/g, ""),
          auaDiscount: updatedSelectedDiscount.replace(/[^\d.]/g, ""),
          houseHoldValue: updatedHouseHoldValue.replace(/[^\d.]/g, ""),
        }, 
      },
    };
    handleChange(eventObject);
  };

  return (
    <div className="additional-detail-container">
      <div className="header">Additional Detail (Optional)</div>
      <div className="description">
        Enter additional details to help capture all fees and discounts that may
        apply to the client account in this illustration.
      </div>
      <div className="section">
        <div className="subsection">
          <div className="subsection-header">Fund Expenses</div>
          {/* <div className="input-group"> */}
            {/* <input
              onChange={handleDiscountChange}
              name="fundExpenses"
              type="text"
              placeholder="%"
              className="input-field"
              value={formatCurrency(fundExpenses, "%")}
              min="0"
            /> */}
            <NumberInput              
              name={"fundExpenses"}
              value={fundExpenses}
              onChange={handleDiscountChange}              
              className="scenario-input"
              symbol={"%"}
            />
          {/* </div> */}
        </div>
        <div className="subsection">
          <div className="subsection-header">Financial Professional Payout</div>
          {/* <div className="input-group"> */}
            {/* <input
              onChange={handleDiscountChange}
              name="fpPayOut"
              type="text"
              placeholder="%"
              className="input-field"
              value={formatCurrency(fpPayOut, "%")}
              min="0"
            /> */}
            <NumberInput
              value={fpPayOut}
              onChange={handleDiscountChange}              
              className="scenario-input"
              symbol={"%"}
              name="fpPayOut"
            />
          {/* </div> */}
        </div>
      </div>
      <div className="subsection household">
        <div className="subsection-header">Household Value</div>
        {/* <div className="input-group"> */}
          {/* <input
            onChange={handleDiscountChange}
            name="houseHoldValue"
            type="text"
            placeholder="$"
            className="input-field"
            value={formatCurrency(houseHoldValue, "$")}
            min="0"
          /> */}
          <NumberInput
              name="houseHoldValue"
              value={houseHoldValue}
              onChange={handleDiscountChange}              
              className="scenario-input"
              symbol={"$"}
            />
        {/* </div> */}
      </div>
      <div className="title">WealthPort AUA Discount</div>
      <div className="sub-description">
        Enter WealthPort AUA Discount (if applicable)
      </div>
      <div className="discounts">
        {["0%", "10%", "15%", "20%", "25%"].map((discount) => (
          <label key={discount} className="discount-item">
            <Radio              
              selectedValue={selectedDiscount}
              value={discount}
              onchange={handleDiscountChange}
              name="auaDiscount"             
            />
            {/* <input type="radio" id="Red" name="colors" value="Red"></input> */}
            <span className="discount-value">{discount}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdditionalDetail;
