import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./componentesSesion/Registro";
import Login from "./componentesSesion/Login";
import Dashboard from "./componentesSesion/Dashboard";
import ProtectedRoute from "./protegida/ProtectedRoute";
import Navbar from "./protegida/Navbar";
import CrearLiga from "./componentes/CrearLiga";
import CrearPartidoLiga from "./componentes/CrearPartidoLiga";
import CrearPartidoAmistoso from "./componentes/CrearPartidoAmistoso";
import Inicio from "./componentes/Inicio";
import UltimosPartidos from "./componentes/UltimosPartidos";
import './App.css';

function App() {
  return (
    <Router>
      <div className="contenedor">
        <Navbar />
        <div className="contenido">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path="/" element={<Inicio />}></Route>

            <Route path="/ligas" element={<ProtectedRoute><CrearLiga /></ProtectedRoute>} />
            <Route path="/ligas/:id/crear-partido" element={<ProtectedRoute><CrearPartidoLiga /></ProtectedRoute>} />

            <Route path="/amistosos" element={<ProtectedRoute><CrearPartidoAmistoso /></ProtectedRoute>} />

            <Route path="/ultimos-partidos" element={<ProtectedRoute><UltimosPartidos /></ProtectedRoute>} />

            {/*Para que si no existe la ruta te redirija al login*/}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </div>


    </Router>
  );
}

export default App;
