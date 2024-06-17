import CalculatorPage from "./pages/calculator/Calculator";
import { CalculationStorageProvider } from "./context/StorageContext";

import EstimatedResults from "./pages/EstimatedResults/EstimatedResults";
import ScenarioViewer from "./pages/ScenarioViewer/ScenarioViewer"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  
  return (
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
