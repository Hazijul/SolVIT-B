import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import FoundPage from "./FoundPage";
import LostPage from "./LostPage";
import SellPage from "./SellPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/found" element={<FoundPage />} />
        <Route path="/lost" element={<LostPage />} />
        <Route path="/sell" element={<SellPage />} />
      </Routes>
    </Router>
  );
}

export default App;
