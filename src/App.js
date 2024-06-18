import React from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import CalculatorPage from "./pages/calculator/Calculator";
import { CalculationStorageProvider } from "./context/StorageContext";
import EstimatedResults from "./pages/EstimatedResults/EstimatedResults";
import ScenarioViewer from "./pages/ScenarioViewer/ScenarioViewer";

function App() {
  return (
    <Router basename="/">
      <CalculationStorageProvider>
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/results" element={<EstimatedResults />} />
          <Route path="/scenario-viewer" element={<ScenarioViewer />} />
        </Routes>
      </CalculationStorageProvider>
    </Router>
  );
}

export default App;
