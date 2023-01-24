import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const value = {
    isAuth,
    setIsAuth,
    currentUser,
    setCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
