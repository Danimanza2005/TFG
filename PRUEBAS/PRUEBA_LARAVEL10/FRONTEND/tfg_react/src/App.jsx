import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./componentes/Registro";
import Login from "./componentes/Login";
import Dashboard from "./componentes/Dashboard";
import ProtectedRoute from "./protegida/ProtectedRoute";
import Navbar from "./protegida/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
