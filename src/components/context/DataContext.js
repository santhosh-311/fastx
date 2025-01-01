import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);

  const [userDetails, setUserDetails] = useState(() => {
    const savedUserDetails = localStorage.getItem('userDetails');
    return savedUserDetails ? JSON.parse(savedUserDetails) : "";
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || "";
  });

  const [loginFlag, setLoginFlag] = useState(false);
  const [signupFlag, setSignupFlag] = useState(true);
  const [forgetFlag, setForgetFlag] = useState(false);

  const [routesFrom, setRoutesFrom] = useState([]);
  const [routesTo, setRoutesTo] = useState([]);

  const [userFlag, setUserFlag] = useState(false);
  const [opFlag, setOpFlag] = useState(false);
  const [adminFlag, setAdminFlag] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const BASE_URL = "http://localhost:8084";

  const logout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("token");
    setUserDetails("");
    setToken("");
    setLoginFlag(false);
    setUserFlag(false);
    setOpFlag(false);
    setAdminFlag(false);
    window.location.href = "/"; // Redirect to home or login page
  };

  const checkTokenExpiration = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decoded.exp < currentTime) {
        logout();
      } else {
        const timeUntilExpiration = (decoded.exp - currentTime) * 1000; // Milliseconds
        setTimeout(() => {
          logout();
        }, timeUntilExpiration);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      checkTokenExpiration(token);
    }
  }, [token]);

  return (
    <DataContext.Provider value={{
      buses, setBuses,
      userDetails, setUserDetails, token, setToken,
      loginFlag, setLoginFlag,
      signupFlag, setSignupFlag,
      userFlag, setUserFlag,
      opFlag, setOpFlag,
      adminFlag, setAdminFlag,
      routesFrom, setRoutesFrom,
      routesTo, setRoutesTo,
      forgetFlag, setForgetFlag,
      bookingDetails, setBookingDetails,
      BASE_URL,
      searchFlag, setSearchFlag,logout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
