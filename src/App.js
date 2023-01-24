import React, { useContext } from "react";
import AdminPanel from "./components/AdminPanel";
import { AuthForm } from "./components/AuthForm";
import { UserContext } from "./context/UserContextProvider";

const App = () => {
  const userCtx = useContext(UserContext);
  return <>{userCtx?.isAuth ? <AdminPanel /> : <AuthForm />}</>;
};

export default App;
