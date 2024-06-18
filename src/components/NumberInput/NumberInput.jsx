import React, { useState } from "react";
import "./NumberInput.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const NumberInput = ({ value, onChange, placeholder, className, symbol,name }) => {
  const [isIncrementClicked, setIsIncrementClicked] = useState(false);
  const [isDecrementClicked, setIsDecrementClicked] = useState(false);
  const formatNumber = (num) => {    
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleIncrement = () => {
    const newValue = (parseFloat(value.replace(/,/g, "")) || 0) + 1;
    onChange({ target: { value: formatNumber(newValue),name:name } });
  };
  
  const handleDecrement = () => {
    const currentValue = parseFloat(value.replace(/,/g, "")) || 0;
    const newValue = currentValue > 1 ? currentValue - 1 : 0;
    onChange({ target: { value: formatNumber(newValue),name:name } });
  };
  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/,/g, "").replace(symbol, "");
    if (/^\d*\.?\d*$/.test(inputValue)) {
      onChange({ target: { value: formatNumber(inputValue),name:e.target.name } });
    }
  };

  return (
    <div className="custom-number-input">
      <div className="input-wrapper">
        <input
          type="text"
          name={name || ""}
          value={symbol === "%" ? `${value}%` : `$${value}`}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
        />
      </div>
      <div className="arrow-buttons">
        <button
          type="button"
          onMouseDown={() => setIsIncrementClicked(true)}
          onMouseUp={() => setIsIncrementClicked(false)}
          onMouseOut={() => setIsIncrementClicked(false)}
          className={`arrow-up ${isIncrementClicked ? "clicked" : ""}`}
          onClick={handleIncrement}
        >
          <ArrowDropUpIcon
            sx={{
              color: isIncrementClicked ? "white" : "#3E5463", // Change color based on state
              width: "18px",
              height: "18px",
            }}
          />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          onMouseDown={() => setIsDecrementClicked(true)}
          onMouseUp={() => setIsDecrementClicked(false)}
          onMouseOut={() => setIsDecrementClicked(false)}
          className={`arrow-down ${isDecrementClicked ? "clicked" : ""}`}
        >
          <ArrowDropDownIcon
            sx={{
              color: isDecrementClicked ? "white" : "#3E5463", // Change color based on state
              width: "18px",
              height: "18px",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
