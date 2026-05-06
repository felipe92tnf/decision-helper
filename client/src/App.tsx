import { BrowserRouter, Route, Routes } from "react-router-dom";
import DecisionsPage from "./pages/DecisionsPage";
import DecisionDetailPage from "./pages/DecisionDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DecisionsPage />} />
        <Route path="/decisions/:id" element={<DecisionDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;