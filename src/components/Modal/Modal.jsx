import React from "react";
import "./Modal.css";

const Modal = ({ show, onClose, children, providedName }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      {" "}
      <div className={`modal-overlay ${providedName ? providedName : ""}`}>
        <div className="modal">
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
