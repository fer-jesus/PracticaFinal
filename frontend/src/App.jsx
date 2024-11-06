import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MenuPage from "./pages/menu";
import ActivosPage from "./pages/activos";
import PendientesPage from "./pages/pendientes";
import FinalizadosPage from "./pages/finalizados";
import "./index.css";
import "./styles/responsive.css";

const App = () => {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/activos" element={<ActivosPage />} />
        <Route path="/pendientes" element={<PendientesPage />} />
        <Route path="/finalizados" element={<FinalizadosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};
export default App;
