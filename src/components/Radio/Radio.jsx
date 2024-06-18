import React from "react";
import "./Radio.css";

const CustomRadioInput = ({ selectedValue, value, onchange, name }) => {   
  const handleClick = () => { 
    let formatedValue;
    
    if (typeof value === 'string' && value.includes('%')) {
      formatedValue = value.replace('%', '');
    } else {
      formatedValue = value;
    }
  
    onchange({ target: { name, value: formatedValue } });
  };
  

  return (
    <div className="radio-wrapper"><div className={`radio ${selectedValue === value ? 'checked' : ''}`} onClick={handleClick}>
      <div className="radio-button"></div>
    </div></div>
  );
};

export default CustomRadioInput;
