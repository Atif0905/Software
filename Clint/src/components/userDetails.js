import React, { useEffect, useState } from "react";
import axios from 'axios';
import AdminDashboard from "../Home/AdminDashboard/AdminDashboard";
import AccountsDashboard from "../Home/AdminDashboard/AccountsDashboard";
import UserDashBoard from "../Home/UserDashboard/UserDashBoard";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [dashboard, setDashboard] = useState(null); // Track which dashboard to show

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_URL}/userData`, {
      token: window.localStorage.getItem("token"),
    }, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then((response) => {
      const data = response.data;
      
      if (data.data === "token expired") {
        alert("Token expired, please log in again");
        window.localStorage.clear();
        window.location.href = "./sign-in";
        return;
      }

      setUserData(data.data);

      switch (data.data?.userType) {
        case "Admin":
          setDashboard(<AdminDashboard />);
          break;
        case "Accounts":
          setDashboard(<AccountsDashboard userData={data.data} />);
          break;
        case "User":
          setDashboard(<UserDashBoard userData={data.data} />);
          break;
        default:
          console.error("Unknown userType:", data.data?.userType);
      }
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }, []);

  if (!userData) {
    return null; 
  }

  return dashboard;  
}
