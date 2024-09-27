import React, { useEffect, useState } from "react";
import "./StrategistFee.css";
import Select from "react-select";
import CircularProgress from "../CircularProgress/CircularProgress";
import { useCalculationStorage } from "../../context/StorageContext";
import Radio from "../Radio/Radio";
import NumberInput from "../../components/NumberInput/NumberInput";
import SelectComponent from "../SelectComponent/SelectComponent";
import {
  StrategistCaapSassConst,
  StrategistCaapConst,
  strategistMFETF,
  EquitySma,
  MFEFT,
} from "../../constants/Constants";

const strategistEquitySMA = [
  { value: "3edge", label: "3EDGE Asset Management" },
  {
    value: "american-standard",
    label: "American Funds - Standard & Tax-aware",
  },
  { value: "american-retirement", label: "American Funds - Retirement Income" },
];

const StrategistFee = ({
  handleChange,
  getCalculationDataValue,
  setCalculationData,
  calculationData,
}) => {
  const { index, setIndex, formatNumberWithCommas, formatCurrency } =
    useCalculationStorage();

  const [inputValue, setInputValue] = useState(
    getCalculationDataValue("teamDirectedInput")[index] || ""
  );

  // useEffect to initialize the input value
  // useEffect(() => {
  //   let value = getCalculationDataValue("teamDirectedInput")[index] || "";
  //   let numericValue = value.replace(/\D/g, "");
  //   const formattedValue = formatNumberWithCommas(numericValue);
  //   setInputValue(formattedValue ? `$${formattedValue}` : "");
  // }, [getCalculationDataValue("teamDirectedInput")[index]]);

  const [feeType, setFeeType] = useState(
    getCalculationDataValue("paymentOption")[index] || ""
  );
  useEffect(() => {
    setFeeType(getCalculationDataValue("paymentOption")[index] || "");
  }, [calculationData]);

  const [selectedMFOptions, setSelectedMFOptions] = useState();
  // const [selectedOption, setSelectedOption] = useState();

  const [showCalculation, setShowCalculation] = useState(false);
  const initialOptions =
    getCalculationDataValue("UMA-SMA-Strategist-Fee")[index] || [];
  const initialEquitySMA =
    initialOptions &&
    initialOptions.filter((option) => option.type === "Equity");
  const initialMFETF =
    initialOptions &&
    initialOptions.filter((option) => option.type === "MFEFT");

  const [selectedEquitySMA, setSelectedEquitySMA] = useState(initialEquitySMA);
  const [selectedMFETF, setSelectedMFETF] = useState(initialMFETF);
  const [editingStrategist, setEditingStrategist] = useState(null);
  const handleFocus = (selected) => {       
    setEditingStrategist(selected.label);
  };

  const strategistOptions = Object.keys(StrategistCaapConst).map((key) => ({
    value: StrategistCaapConst[key],
    key: key,
  }));

  const strategistSaasOptions = Object.keys(StrategistCaapSassConst).map(
    (key) => ({
      value: StrategistCaapSassConst[key],
      key: key,
    })
  );

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    const paymentOption = getCalculationDataValue("paymentOption")[index] || "";
    const selectedLabel =
      strategistOptions.find((option) => option.key == selectedValue) ||
      selectedValue;
    const selectedLabel2 =
      strategistSaasOptions.find((option) => option.key == selectedValue) ||
      selectedValue;
    const isCaap = paymentOption === "caap";
    const name = isCaap ? "strategistFeeCaap" : "strategistFeeCaapSmallAccount";
    let selectedOptionValue = isCaap
      ? selectedLabel.value
      : selectedLabel2.value;
    handleChange({
      target: {
        name,
        value: {
          name: selectedValue,
          value: selectedOptionValue,
        },
      },
    });
  };

  const handleTeamDirected = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const formated_input = value.replace(/[^\d.]/g, "");
    handleChange({
      target: { name: "teamDirectedInput", value: formated_input },
    });
  };

  // Toggle visibility for calculation details
  const toggleCalculation = () => {
    setShowCalculation((prev) => !prev);
  };

  const handleMFETFChange = (selectedOptions, type) => {
    setSelectedMFETF(selectedOptions || []);

    // Convert the selected options to the format expected by the state
    const updatedOptions = selectedOptions.map((option) => ({
      name: option.label,
      label: option.label,
      inputValue: "",
      value: option.data_value,
      dollarValue: "",
      type: type,
    }));

    // Update calculationData considering the type of strategist at a specific index
    setCalculationData((prevData) => {
      // First, ensure that the array is large enough to include the index
      let updatedArray = prevData["UMA-SMA-Strategist-Fee"].slice();

      const allEmpty = updatedArray.every((element) => element === "");

      if (index >= updatedArray.length && !allEmpty) {
        // If the index is out of bounds, fill the array with empty arrays up to the required index
        updatedArray = [
          ...updatedArray,
          ...Array(index - updatedArray.length + 1).fill([]),
        ];
      }

      // Extract options of the same type and those of different types at the given index
      const sameTypeOptions =
        updatedArray[index]?.filter((opt) => opt.type === type) || [];
      const differentTypeOptions =
        updatedArray[index]?.filter((opt) => opt.type !== type) || [];

      // Filter out options that are no longer selected of the same type
      const retainedOptions = sameTypeOptions.filter((option) =>
        updatedOptions.some(
          (updatedOption) => updatedOption.name === option.name
        )
      );

      // Add new options of the same type not already in the list
      const newOptions = updatedOptions.filter(
        (updatedOption) =>
          !sameTypeOptions.find(
            (existingOption) => existingOption.name === updatedOption.name
          )
      );

      // Replace the list at the specific index with the combined retained and new options of the same type, and the untouched different type options
      updatedArray[index] = [
        ...differentTypeOptions,
        ...retainedOptions,
        ...newOptions,
      ];

      return {
        ...prevData,
        "UMA-SMA-Strategist-Fee": updatedArray,
      };
    });
  };

  const handleEquitySMAChange = (selectedOptions, type) => {
    setSelectedEquitySMA(selectedOptions || []);
    // Convert the selected options to the format expected by the state
    const updatedOptions = selectedOptions.map((option) => ({
      name: option.label,
      inputValue: "",
      label: option.label,
      value: option.data_value,
      dollarValue: "",
      type: type,
    }));

    // Update calculationData considering the type of strategist at a specific index
    setCalculationData((prevData) => {
      // Ensure the array is large enough to include the index
      let updatedArray = prevData["UMA-SMA-Strategist-Fee"].slice();
      if (index >= updatedArray.length) {
        updatedArray = [
          ...updatedArray,
          ...Array(index - updatedArray.length + 1).fill([]),
        ];
      }

      // Extract options of the same type and those of different types at the given index
      const sameTypeOptions =
        updatedArray[index]?.filter((opt) => opt.type === type) || [];
      const differentTypeOptions =
        updatedArray[index]?.filter((opt) => opt.type !== type) || [];

      // Filter out options that are no longer selected of the same type
      const retainedOptions = sameTypeOptions.filter((option) =>
        updatedOptions.some(
          (updatedOption) => updatedOption.name === option.name
        )
      );

      // Add new options of the same type not already in the list
      const newOptions = updatedOptions.filter(
        (updatedOption) =>
          !sameTypeOptions.find(
            (existingOption) => existingOption.name === updatedOption.name
          )
      );

      // Replace the list at the specific index with the combined retained and new options of the same type, and the untouched different type options
      updatedArray[index] = [
        ...differentTypeOptions,
        ...retainedOptions,
        ...newOptions,
      ];

      return {
        ...prevData,
        "UMA-SMA-Strategist-Fee": updatedArray,
      };
    });
  };

  const handleStrategistInput = (e, type, data_value,label,selected) => {
    const { name, dataset, key } = e.target;
    const formated_input = e.target.value.replace(/[^\d.]/g, "");
    const userInputValue = formated_input;
    const value = data_value;
    const strategistName = label;
    const accountValue =
      parseFloat(calculationData["account-value"][index]) || 0;
    const UMA_SMA_Strategist_Fee =
      getCalculationDataValue("UMA-SMA-Strategist-Fee")[index] || {};
    const dollarValue =
      accountValue !== 0 || accountValue !== null && value !== undefined
        ? (accountValue * value) / 100
        : 0;
    const roundedValue = Math.ceil(dollarValue);
    if (type === "Equity") {
      setSelectedEquitySMA((prev) =>
        prev.map((item) =>
          item.label === strategistName
            ? { ...item, dollarValue: roundedValue , inputValue: userInputValue,}
            : item
        )
      );
    } else if (type === "MFEFT") {
      setSelectedMFETF((prev) =>
        prev.map((item) =>
          item.label === strategistName
            ? { ...item, dollarValue: roundedValue, inputValue: userInputValue, }
            : item
        )
      );
    }

    // Update the strategist fee array at the specified index
    const updatedStrategists = UMA_SMA_Strategist_Fee.map((strategist) => {      
      if (strategist.name === strategistName) {
        return {
          ...strategist,
          inputValue: userInputValue,
          dollarValue: roundedValue,
        };
      }
      return strategist;
    });

    setCalculationData((prevData) => {
      const updatedArray = [...prevData["UMA-SMA-Strategist-Fee"]];
      updatedArray[index] = updatedStrategists;
      return {
        ...prevData,
        "UMA-SMA-Strategist-Fee": updatedArray,
      };
    });
  };

  // Function to render selected strategists with input fields for fee and value
  const renderSelectedStrategists = (selectedList) =>
    selectedList.map((selected) => (
      <div key={selected.value} className="strategist-item">
        <div className="strategist-info">
          {/* <input
            type="radio"
            checked={editingStrategist === selected.value}
            onChange={() => setEditingStrategist(selected.value)}
          /> */}
          <Radio
            selectedValue={selected.label}
            value={editingStrategist}
            // onchange={setEditingStrategist}
            name="paymentOption"    
            placeholder={"hello"}        
          />          
          {/* <span type="radio"
            checked={editingStrategist === selected.value}
            onChange={() => setEditingStrategist(selected.value)} /> */}
          <div className="strategist-icon" />
          <div className="strategist-name">{selected.label}</div>
        </div>
        <div className="strategist-input-container">
          <div className="strategist-fee">
            {/* <input
              onFocus={() => handleFocus(selected)}
              onChange={(e) => {
                handleStrategistInput(e, selected.type, selected.data_value);
              }}
              data-label={selected.label}
              data-name={selected.type}
              name={selected.value}
              type="number"
              placeholder="%"
              className="fee-input"
               value={selected.inputValue}
              // value={`%${formatNumberWithCommas(selected.inputValue)}`}
            /> */}
            <NumberInput
              onFocus={() => handleFocus(selected)}
              onChange={(e) => {
                handleStrategistInput(e, selected.type, selected.value,selected.label,selected);
              }}
              data-label={selected.label}
              data-name={selected.type}
              name={selected.value}
              placeholder="%"
              className="fee-input"
              symbol="%"
              value={selected.inputValue || 0}
            />
          </div>
          <div className="fee-dollar-value">{`$${
            selected.dollarValue || 0
          }`}</div>
        </div>
      </div>
    ));

  // Render the appropriate fee content based on the selected fee type
  if (feeType === "advisor-directed") {
    return null; // No content for Advisor-directed
  }

  if (feeType === "team-directed") {
    return (
      <div className="fee-container">
        <div className="fee-title">Strategist Fee</div>
        <div className="fee-type">Team-directed</div>
        <div className="fee-info">Maximum Team-directed fee is 3%</div>
        <div className="fee-input-label">Enter Flat Fee (%)</div>
        {/* <input
          onChange={handleTeamDirected}
          type="text"
          placeholder="%"
          className="scenario-input"
          value={inputValue || ""}
        /> */}
        <NumberInput
          value={inputValue}
          onChange={handleTeamDirected}
          // placeholder="$ "
          className="scenario-input"
          symbol={"%"}
        />
      </div>
    );
  }
  const selectedOption_strategistFeeCaap = getCalculationDataValue("strategistFeeCaap")[index]?.name || '';
  const selectedOption_strategistFeeCaapSmallAccount = getCalculationDataValue("strategistFeeCaapSmallAccount")[index]?.name || '';

  if (feeType === "caap" || feeType === "caap-small-account") {
    const title = feeType === "caap" ? "CAAP" : "CAAP Small Account Solutions";
    return (
      <div className="strategist-fee-container">
        <div className="strategist-fee-title">Strategist Fee</div>
        <div className="strategist-fee-type">{title}</div>
        <div className="strategist-fee-description">
          The Strategist Fee covers costs associated with asset allocation and
          model trading services. Applicable to CAAP, UMA, and Team-directed.
        </div>
        <div className="strategist-fee-input-label">{`Strategist ${title}`}</div>
        {getCalculationDataValue("paymentOption")[index] === "caap" ? (
          <select
            className="strategist-dropdown scenario-input"
            value={selectedOption_strategistFeeCaap}
            onChange={handleOptionChange}
          >
            <option value="" disabled>
              Select a strategist option
            </option>
            {strategistOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.key}
              </option>
            ))}
          </select>
          
        ) : getCalculationDataValue("paymentOption")[index] ===
          "caap-small-account" ? (
          <select
            className="strategist-dropdown scenario-input"
            onChange={handleOptionChange}
            value={selectedOption_strategistFeeCaapSmallAccount}
          >
            <option value="" disabled>
              Select a strategist option
            </option>
            {strategistSaasOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.key}
              </option>
            ))}
          </select>
        ) : null}
        <div className="strategist-divider" />
        <div className="strategist-accordion">
          <div className="show-calculation" onClick={toggleCalculation}>
            {/* <span>Show Calculation</span> */}
            {/* <span className="accordion-icon">{showCalculation ? '▼' : '▶'}</span> */}
          </div>
          {showCalculation && (
            <div className="calculation-details">
              // Calculations shown here
            </div>
          )}
        </div>
      </div>
    );
  }

  if (feeType === "uma-sma") {
    return (
      <div className="strategist-fee-container">
        <div className="strategist-fee-title">Strategist Fee</div>
        <div className="strategist-fee-type">UMA/SMA</div>
        <div className="progress-fp">
          <div className="strategist-fee-description">
            The Strategist Fee covers costs associated with asset allocation and
            model trading services. Applicable to CAAP, UMA, and Team-directed.
          </div>{" "}
          {/* <CircularProgress percentage={0} /> */}
        </div>
        <div className="strategist-select-section">
          <div className="strategist-select-title">
            Select MF/ETF Strategists
          </div>
          <Select
            isMulti
            options={MFEFT.map((option) => ({
              label: option.name,
              data_value: option.data_value,
              value: option.value,
              type: option.type,
            }))}
            key="MF/ETF Strategists"
            value={selectedMFETF}
            onChange={(e) => handleMFETFChange(e, "MFEFT")}
            className="strategist-select"
            data-label="Select MF/ETF Strategists"
          />
        </div>
        <div className="strategist-table">
          <div className="strategist-table-header">
            <div className="strategist-name-header">Strategist</div>
            <div className="strategist-fee-header">% Fee</div>
            <div className="strategist-value-header">Value in $</div>
          </div>
          {renderSelectedStrategists(selectedMFETF)}
        </div>

        <div className="strategist-select-section">
          <div className="strategist-select-title">
            Select Equity/SMA Strategists
          </div>
          <Select
            isMulti
            options={EquitySma.map((option) => ({
              label: option.name,
              data_value: option.data_value,
              value: option.value,
              type: option.type,
            }))}
            value={selectedEquitySMA}
            key="Equity/SMA Strategists"
            onChange={(e) => handleEquitySMAChange(e, "Equity")}
            className="strategist-select"
            data-label="Select Equity/SMA Strategists"
          />
        </div>
        <div className="strategist-table">
          <div className="strategist-table-header">
            <div className="strategist-name-header">Strategist</div>
            <div className="strategist-fee-header">% Fee</div>
            <div className="strategist-value-header">Value in $</div>
          </div>
          {renderSelectedStrategists(selectedEquitySMA)}
        </div>
      </div>
    );
  }

  return null;
};

export default StrategistFee;
