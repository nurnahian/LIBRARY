import { createContext, useState } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = import.meta.env.VITE_SESSION_KEY;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultAccounts = [];

const mapUserToFrontend = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    department: user.department || "General",
    stream: user.stream || "General",
    academicYear: user.year || "1st Year",
    semester: user.semester || "Semester 1",
    rollNumber: user.rollNo || "",
    studentId: user.studentId || `ST-${user._id.slice(-6)}`,
    createAt: user.createAt,
  };
};

export const AuthProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  //if user is admin then fetch all register user
  const fetchRegistereUsers = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.users)) {
          const fetchedAccounts = data.users
            .map(mapUserToFrontend)
            .sort(
              (a, b) =>
                new Date(b.createAt ?? 0).getDate() -
                new Date(a.createAt ?? 0).getDate(),
            );
          setAccounts((current) => {
            const merged = [...fetchedAccounts];
            defaultAccounts.forEach((account) => {
              const exists = merged.some((item) => {
                item.email.toLowerCase() === account.email.toLowerCase();
              });
              if (!exists) {
                merged.push(account);
              }
            });
            return merged;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching users from backend:", error);
    }
  };

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
