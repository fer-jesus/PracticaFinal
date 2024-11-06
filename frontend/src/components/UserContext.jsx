import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nombreCompleto, setNombreCompleto] = useState("");

  useEffect(() => {
    // Cargar el nombre del usuario de localStorage al iniciar la aplicación
    const nombres = localStorage.getItem("nombres");
    const apellidos = localStorage.getItem("apellidos");
    if (nombres && apellidos) {
      setNombreCompleto(`${nombres} ${apellidos}`);
    }
  }, []);

  const loginUser = (nombres, apellidos) => {
    localStorage.setItem("nombres", nombres);
    localStorage.setItem("apellidos", apellidos);
    setNombreCompleto(`${nombres} ${apellidos}`);
  };

  const logoutUser = () => {
    localStorage.removeItem("nombres");
    localStorage.removeItem("apellidos");
    setNombreCompleto("");
  };

  return (
    <UserContext.Provider value={{ nombreCompleto, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;