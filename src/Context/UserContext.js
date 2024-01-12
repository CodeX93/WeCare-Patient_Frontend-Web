import React, { createContext, useState, useContext } from "react";

// Create the context
const UserContext = createContext();

// Provider component that wraps your app and makes the user object available to any child component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
