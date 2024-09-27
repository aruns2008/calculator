import React from "react";
import "./Radio.css";

const CustomRadioInput = ({ selectedValue, value, onchange, name,placeholder }) => { 
  let formatedValue;
  if (typeof value === 'string' && value.includes('%')) {
    formatedValue = value.replace('%', '');
  } else {
    formatedValue = value;
  }
  const handleClick = () => { 
    onchange({ target: { name, value: formatedValue } });
  };

  return (
    <div className="radio-wrapper"><div className={`radio ${selectedValue === formatedValue ? 'checked' : ''}`} onClick={handleClick}>
      <div className="radio-button"></div>
    </div></div>
  );
};

export default CustomRadioInput;
