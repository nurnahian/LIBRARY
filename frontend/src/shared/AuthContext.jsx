import { createContext } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = import.meta.env.VITE_SESSION_KEY;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultAccounts = [];




const mapUserToFrontend = (user) => {
  if (!user) return null;
  return{
    id:user._id,
    name:user.name,

  }
};

export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
