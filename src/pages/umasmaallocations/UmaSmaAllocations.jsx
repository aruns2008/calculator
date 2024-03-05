import Button from "../../components/button/Button";
import TabComponent from "../../components/tab/Tab";
import Styles from "./umasma.module.css";
import { useAppContext } from "../../context/AppContext";
import TextField from "../../components/textfield/TextField";
import { useNavigate } from "react-router-dom";

const UmaSmaAllocations = ({ onNavigate }) => {
  const {
    selectedMFEFTItems,
    setSelectedMFEFTItems,
    selectedEquitySMAItems,
    setSelectedEquitySMAItems,
  } = useAppContext();

  const umasmaAllocationArray = selectedMFEFTItems.concat(
    selectedEquitySMAItems
  );

  const onClickHandler = () => {
    onNavigate("AdditionalPage");
  };

  const onBackClickHandler = () => {
    onNavigate("StrategistFee");
  };
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.Container}>
        <div className={Styles.leftContainer}>
          <div className={Styles.navigator}>
            <div>
              <Button
                text="Back"
                onClick={onBackClickHandler}
                background="grey"
              ></Button>
            </div>
            <div>
              <Button
                onClick={onClickHandler}
                text="Next"
                background="grey"
              ></Button>
            </div>
            <div>
              <Button text="Reset" background="grey"></Button>
            </div>
          </div>
          <div className={Styles.fpFeeTitleAndHint}>
            <h1 className={Styles.title}>UMA/SMA Allocations</h1>
          </div>
          <div>
            <div className={Styles.statusContainer}>
              <p className={Styles.statusText}>Status:</p>
              <h4 className={Styles.statusValue}>Under Allocated</h4>
            </div>
            <div>
              {umasmaAllocationArray.map((item) => {
                return (
                  <div className={Styles.allocationDataContainer}>
                    <div className={Styles.allocTextContainer}>
                      <p className={Styles.allocLabel}>{item}</p>
                      <TextField></TextField>
                    </div>
                    <div className={Styles.allocValueContainer}>
                      <p className={Styles.allocLabel}>Value in $</p>
                      <p className={Styles.alocationValue}>Under Allocated</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={Styles.rightContainer}>
          <h2 className={Styles.rightTitle}>Estimated Results</h2>
          <TabComponent></TabComponent>
        </div>
      </div>
      <div className={Styles.nextBtnContainer}>
        <Button text="Next →" onClick={onClickHandler}></Button>
      </div>
    </div>
  );
};

export default UmaSmaAllocations;
