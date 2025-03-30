import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GhibliArtApp from "./GhibliArtApp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GhibliArtApp />} />
      </Routes>
    </Router>
  );
}
