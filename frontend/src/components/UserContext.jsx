import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nombreCompleto, setNombreCompleto] = useState("");

  const loginUser = (nombres, apellidos) => {
    setNombreCompleto(`${nombres} ${apellidos}`);
  };

  const logoutUser = () => {
    setNombreCompleto("");  // Vaciar el nombre completo al cerrar sesión
  };

  return (
    <UserContext.Provider value={{ nombreCompleto, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
