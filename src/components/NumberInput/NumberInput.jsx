import React, { useState } from "react";
import "./NumberInput.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NumberInput = ({ value, onChange, placeholder, className, symbol, name,onFocus }) => {
  const [isIncrementClicked, setIsIncrementClicked] = useState(false);
  const [isDecrementClicked, setIsDecrementClicked] = useState(false);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseValue = (value) => {
    if (typeof value === "string") {
      return parseFloat(value.replace(/,/g, "").replace(symbol, "")) || 0;
    }
    return parseFloat(value) || 0;
  };

  const handleIncrement = () => {
    const numericValue = parseValue(value);
    const newValue = numericValue + 1;
    onChange({ target: { value: formatNumber(newValue), name: name } });
  };

  const handleDecrement = () => {
    const numericValue = parseValue(value);
    const newValue = numericValue > 1 ? numericValue - 1 : 0;
    onChange({ target: { value: formatNumber(newValue), name: name } });
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/,/g, "").replace(symbol, "");
    if (/^\d*\.?\d*$/.test(inputValue)) {
      onChange({ target: { value: formatNumber(inputValue), name: e.target.name } });
    }
  };

  const formattedValue = formatNumber(parseValue(value));

  return (
    <div className="custom-number-input">
      <div className="input-wrapper">
        <input
          type="text"
          name={name || ""}
          value={symbol === "%" ? `${formattedValue}%` : `$${formattedValue}`}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
          onFocus={onFocus}
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
              color: isIncrementClicked ? "white" : "#3E5463",
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
              color: isDecrementClicked ? "white" : "#3E5463",
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
