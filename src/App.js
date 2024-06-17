import CalculatorPage from "./pages/calculator/Calculator";
import { CalculationStorageProvider } from "./context/StorageContext";

import EstimatedResults from "./pages/EstimatedResults/EstimatedResults";
import ScenarioViewer from "./pages/ScenarioViewer/ScenarioViewer"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  // const [currentPage, setCurrentPage] = useState('HomePage');
  // const navigate = (page) => {
  //   setCurrentPage(page); 
  // };
  return (
    // <div className={Styles.appContainer}>
    // <StepIndicator currentStep={currentPage}></StepIndicator>
    // <AppProvider>
    // {currentPage === 'HomePage' && <HomePage onNavigate={navigate} />}
    // {currentPage === 'FpFee' && <Fpfee onNavigate={navigate} />}
    // {currentPage === 'ProgramFee' && <ProgramFee onNavigate={navigate} />}
    // {currentPage === 'StrategistFee' && <Strategist onNavigate={navigate} />}
    // {currentPage === 'UmaSma' && <UmaSmaAllocations onNavigate={navigate} />}
    // {currentPage === 'AdditionalPage' && <AdditionalPage onNavigate={navigate} />}
    // {currentPage === 'ResultPage' && <ResultPage onNavigate={navigate} />}
    // </AppProvider>
    // </div>
    // <CalculationStorageProvider>
    //   <CalculatorPage />
    // </CalculationStorageProvider>
    <Router basename="/calculator">
      <CalculationStorageProvider>
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/results" element={<EstimatedResults />} />
          <Route path="/scenario-viewer/" element={<ScenarioViewer />} />
        </Routes>
      </CalculationStorageProvider>
    </Router>
  );
}

export default App;
