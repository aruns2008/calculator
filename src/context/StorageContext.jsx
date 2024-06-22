import React, { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
const CalculationStorageContext = createContext();

// Create the provider component
const CalculationStorageProvider = ({ children }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [stepsCompleted, setStepsCompleted] = useState(false);
  const navigate = useNavigate();

  // Calculation details

  const [tierValueSum, setTierValueSum] = useState([
    { doller: "", percentage: "" },
  ]);
  const [breakPointValueSum, setBreakPointValueSum] = useState([
    { doller: "", percentage: "" },
  ]);
  const [accountValue, setAccountValue] = useState([{ rate: "", price: "" }]);
  const [fundExpenses, setFundExpenses] = useState([{ rate: "", price: "" }]);
  const [fpPayout, setFpPayout] = useState([{ rate: "", price: "" }]);
  const [houseHoldValue, setHouseHoldValue] = useState([
    { rate: "", price: "" },
  ]);
  const [feeType, setFeeType] = useState([""]);
  const [programFee, setProgramFee] = useState([""]);
  const [programFeeValues, setProgramFeeValues] = useState([
    { rate: "", price: "" },
  ]);
  const [strategistFeeValues, setStrategistFeeValues] = useState([
    { rate: "", price: "" },
  ]);
  const [totalAccountFeeValues, setTotalAccountFeeValues] = useState([
    { rate: "", price: "" },
  ]);
  const [grossAnnualFeeValues, setgrossAnnualFeeValues] = useState([
    { rate: "", price: "" },
  ]);
  const [netAnnualFeeValues, setNetAnnualFeeValues] = useState([
    { rate: "", price: "" },
  ]);
  const [totalClientFeeValues, setTotalClientFeeValues] = useState([
    { rate: "", price: "" },
  ]);
  const [fpValues, setFpValues] = useState([{ rate: "", price: "" }]);
  // Index

  const [index, setIndex] = useState(0);
  const [originalIndex, setOriginalIndex] = useState(null);

  // User Inputs

  const [calculationData, setCalculationData] = useState({
    currentDate: [""],
    "scenario-name": [""],
    "account-value": [""],
    FPfee: [{}],
    AdditionalDetails: [
      { auaDiscount: "0", fpPayOut: "", fundExpenses: "", houseHoldValue: "" },
      { auaDiscount: "0", fpPayOut: "", fundExpenses: "", houseHoldValue: "" },
      { auaDiscount: "0", fpPayOut: "", fundExpenses: "", houseHoldValue: "" },
    ],
    paymentOption: ["", "", ""],
    programOption: [""],
    "UMA-SMA-Strategist-Fee": [[], [], []],
    FPfeeType: [""],
    FPfeeTiers: [
      {
        tier1: {
          amount: "",
          percentage: "",
        },
        tier2: {
          amount: "",
          percentage: "",
        },
      },
      {
        tier1: {
          amount: "",
          percentage: "",
        },
        tier2: {
          amount: "",
          percentage: "",
        },
      },
      {
        tier1: {
          amount: "",
          percentage: "",
        },
        tier2: {
          amount: "",
          percentage: "",
        },
      },
    ],
    FPfeeBreakPoints: [
      {
        breakpoint1: {
          amount: "",
          percentage: "",
        },
        breakpoint2: {
          amount: "",
          percentage: "",
        },
      },
      {
        breakpoint1: {
          amount: "",
          percentage: "",
        },
        breakpoint2: {
          amount: "",
          percentage: "",
        },
      },
      {
        breakpoint1: {
          amount: "",
          percentage: "",
        },
        breakpoint2: {
          amount: "",
          percentage: "",
        },
      },
    ],
    FPfeeFixed: [""],
    FPfeeFlat: [""],
    strategistFeeCaap: [{}, {}, {}],
    strategistFeeCaapSmallAccount: [{}, {}, {}],
    teamDirectedInput: [],
  });
  // Function to format the number with commas
  const formatNumberWithCommas = (value) => {
    if (value === "" || value === "N/A" || value === undefined || value === NaN ) return "";
    const number = value.split(",").join("");
    if (!number || isNaN(number) || Number(number) < 0) {
      return "";
    }
    return Number(number).toLocaleString();
  };
  const formatCurrency = (value, icon) => {    
    if (value === "" || value === "N/A" || value === undefined || value === NaN ) return "";
    const number = parseFloat(value).toString();
    if (icon == "%") {
      return `${number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%`;
    } else {
      return `$${number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newArray = [...calculationData[name]];
    newArray[index] = value;
    setCalculationData((prev) => ({ ...prev, [name]: newArray }));
  };
  const getCalculationDataValue = (key) => {
    return calculationData[key];
  };

  const handleEdit = (currentIndex) => {
    setOriginalIndex(index);
    setIndex(currentIndex);
    navigate("/");
  };
  const handleDelete = (currentIndex) => {
    setCalculationData((prevData) => {
      const updatedData = { ...prevData };

      // Handle simple arrays
      const simpleArrays = [
        "scenario-name",
        "account-value",
        "paymentOption",
        "programOption",
        "FPfeeType",
        "FPfeeFixed",
        "FPfeeFlat",
        "teamDirectedInput",
      ];

      simpleArrays.forEach((key) => {
        if (
          Array.isArray(updatedData[key]) &&
          currentIndex < updatedData[key].length
        ) {
          updatedData[key][currentIndex] = "";
        }
      });

      // Handle arrays of objects
      const objectArrays = [
        "AdditionalDetails",
        "UMA-SMA-Strategist-Fee",
        "FPfeeTiers",
        "FPfeeBreakPoints",
        "strategistFeeCaap",
        "strategistFeeCaapSmallAccount",
      ];

      objectArrays.forEach((key) => {
        if (
          Array.isArray(updatedData[key]) &&
          currentIndex < updatedData[key].length
        ) {
          const obj = updatedData[key][currentIndex];
          for (const prop in obj) {
            if (typeof obj[prop] === "object" && obj[prop] !== null) {
              for (const subProp in obj[prop]) {
                obj[prop][subProp] = "";
              }
            } else {
              obj[prop] = "";
            }
          }
        }
      });

      return updatedData;
    });

    handleReplaceValue("tierValueSum", currentIndex);
    handleReplaceValue("breakPointValueSum", currentIndex);
    handleReplaceValue("accountValue", currentIndex);
    handleReplaceValue("fundExpenses", currentIndex);
    handleReplaceValue("fpPayout", currentIndex);
    handleReplaceValue("houseHoldValue", currentIndex);
    handleReplaceValue("grossAnnualFeeValues", currentIndex);
    handleReplaceValue("fpValues", currentIndex);
    handleReplaceValue("netAnnualFeeValues", currentIndex);
    handleReplaceValue("feeType", currentIndex);
    handleReplaceValue("programFee", currentIndex);
    handleReplaceValue("programFeeValues", currentIndex);
    handleReplaceValue("strategistFeeValues", currentIndex);
    handleReplaceValue("totalAccountFeeValues", currentIndex);
    handleReplaceValue("totalClientFeeValues", currentIndex);
  };

  const replaceValueAtIndex = (stateArray, setStateFunction, index) => {
    setStateFunction((prevState) => {
      if (!Array.isArray(prevState)) {
        console.error("Expected state to be an array");
        return prevState;
      }

      return prevState.map((item, i) => {
        if (i !== index) {
          return item;
        }

        if (item === null || item === undefined) {
          // Handle null or undefined items
          return "";
        } else if (typeof item === "object" && !Array.isArray(item)) {
          // If item is an object (and not an array), replace its properties with empty strings
          return Object.keys(item).reduce((acc, key) => {
            acc[key] = "";
            return acc;
          }, {});
        } else if (Array.isArray(item)) {
          // If item is an array, replace its elements with empty strings
          return item.map(() => "");
        } else if (typeof item === "string") {
          // If item is a string, replace it with an empty string
          return "";
        } else {
          return item;
        }
      });
    });
  };

  // Create an object to map state arrays and their corresponding state update functions
  const stateHandlers = {
    tierValueSum: [tierValueSum, setTierValueSum],
    breakPointValueSum: [breakPointValueSum, setBreakPointValueSum],
    accountValue: [accountValue, setAccountValue],
    fundExpenses: [fundExpenses, setFundExpenses],
    fpPayout: [fpPayout, setFpPayout],
    houseHoldValue: [houseHoldValue, setHouseHoldValue],
    feeType: [feeType, setFeeType],
    programFee: [programFee, setProgramFee],
    programFeeValues: [programFeeValues, setProgramFeeValues],
    strategistFeeValues: [strategistFeeValues, setStrategistFeeValues],
    totalAccountFeeValues: [totalAccountFeeValues, setTotalAccountFeeValues],
    grossAnnualFeeValues: [grossAnnualFeeValues, setgrossAnnualFeeValues],
    fpValues: [fpValues, setFpValues],
    netAnnualFeeValues: [netAnnualFeeValues, setNetAnnualFeeValues],
    totalClientFeeValues: [totalClientFeeValues, setTotalClientFeeValues],
  };

  // Generic function to handle replacement based on key
  const handleReplaceValue = (key, index) => {
    if (!stateHandlers[key]) {
      console.error(`No state handler found for key: ${key}`);
      return;
    }

    const [stateArray, setStateFunction] = stateHandlers[key];

    if (!stateArray || !setStateFunction) {
      console.error(`Invalid state array or state function for key: ${key}`);
      return;
    }

    replaceValueAtIndex(stateArray, setStateFunction, index);
  };

  useEffect(() => {
    console.log(calculationData);
  }, [calculationData]);
  useEffect(() => {
    console
      .log
      (//   tierValueSum,
      //   breakPointValueSum,
      //    accountValue,
      //   fundExpenses,
      //   fpPayout,
      //   houseHoldValue,
      //   feeType,
      //   programFee,
      //   programFeeValues,
        // strategistFeeValues,
        // totalAccountFeeValues,
      //   grossAnnualFeeValues,
      //   fpValues,
      //   netAnnualFeeValues,
      //totalClientFeeValues
      );
  }, [
    tierValueSum,
    breakPointValueSum,
    accountValue,
    fundExpenses,
    fpPayout,
    houseHoldValue,
    feeType,
    programFee,
    programFeeValues,
    strategistFeeValues,
    totalAccountFeeValues,
    grossAnnualFeeValues,
    fpValues,
    netAnnualFeeValues,
    totalClientFeeValues,
  ]);

  return (
    <CalculationStorageContext.Provider
      value={{
        calculationData,
        setCalculationData,
        handleChange,
        getCalculationDataValue,
        programFeeValues,
        setProgramFeeValues,
        strategistFeeValues,
        setStrategistFeeValues,
        totalAccountFeeValues,
        setTotalAccountFeeValues,
        totalClientFeeValues,
        setTotalClientFeeValues,
        grossAnnualFeeValues,
        setgrossAnnualFeeValues,
        netAnnualFeeValues,
        setNetAnnualFeeValues,
        fpValues,
        setFpValues,
        accountValue,
        setAccountValue,
        fundExpenses,
        setFundExpenses,
        fpPayout,
        setFpPayout,
        houseHoldValue,
        setHouseHoldValue,
        feeType,
        setFeeType,
        programFee,
        setProgramFee,
        stepsCompleted,
        setStepsCompleted,
        errorMessages,
        setErrorMessages,
        tierValueSum,
        setTierValueSum,
        breakPointValueSum,
        setBreakPointValueSum,
        index,
        setIndex,
        originalIndex,
        setOriginalIndex,
        handleEdit,
        handleDelete,
        formatNumberWithCommas,
        formatCurrency,
      }}
    >
      {children}
    </CalculationStorageContext.Provider>
  );
};

// Create a custom hook to use the context
const useCalculationStorage = () => {
  return useContext(CalculationStorageContext);
};

export { CalculationStorageProvider, useCalculationStorage };
