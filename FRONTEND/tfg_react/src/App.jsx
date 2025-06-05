import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./componentesSesion/Registro";
import Login from "./componentesSesion/Login";
import Dashboard from "./componentesSesion/Dashboard";
import ProtectedRoute from "./protegida/ProtectedRoute";
import Navbar from "./protegida/Navbar";
import CrearPartido from "./componentes/CrearPartido";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/crear-partido"
          element={
            <ProtectedRoute>
              <CrearPartido />
            </ProtectedRoute>
          }
        />

        {/*Para que si no existe la ruta te redirija al login*/}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
