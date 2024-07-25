import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MenuPage from "./pages/menu";
import ActivosPage from "./pages/activos";
import PendientesPage from "./pages/pendientes";
import FinalizadosPage from "./pages/finalizados";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Página de inicio */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/activos" element={<ActivosPage />} />
        <Route path="/pendientes" element={<PendientesPage />} />
        <Route path="/finalizados" element={<FinalizadosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
export default App;
