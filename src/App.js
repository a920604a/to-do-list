import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <Router basename="/to-do-list">
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;