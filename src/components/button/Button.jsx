import Styles from "./button.module.css";
import React from "react";

const Button = ({ text, onClick, configuresStyles }) => {
  return (
    <button className={configuresStyles} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
