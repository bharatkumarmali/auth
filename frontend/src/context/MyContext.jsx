import React, { createContext, useEffect, useState } from "react";
import { getUserDetails } from "../api/api";

// Create a context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [loggedInUserData, setLoggedInUserData] = useState({});

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setLoggedInUserData(user);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("user", JSON.stringify(loggedInUserData));
    } catch (error) {
      console.error("Failed to save user data to localStorage:", error);
    }
  }, [loggedInUserData]);

  // useEffect(() => {
  //   gettUserDetailsAPI(); // get user detials API
  // }, []);

  // get user detials
  // const gettUserDetailsAPI = async () => {
  //   const res = await getUserDetails();
  //   if (res.status === 200) {
  //     setLoggedInUserData(res.data.data);
  //     localStorage.setItem("user", JSON.stringify(res.data.data));
  //   }
  //   try {
  //   } catch (error) {
  //     console.error("Get user details API error", error);
  //   }
  // };

  return (
    <MyContext.Provider
      value={{
        loggedInUserData,
        setLoggedInUserData,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
