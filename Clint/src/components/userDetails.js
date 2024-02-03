import React, { useEffect, useState } from "react";
import axios from 'axios'; // Import Axios
import AdminDashboard from "../Home/AdminDashboard/AdminDashboard";
import UserDashBoard from "../Home/UserDashboard/UserDashBoard";

export default function UserDetails() {
  const [userData, setUserData] = useState({});
  const [admin, setAdmin] = useState(false);

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
      console.log(data, "userData");
      if (data.data && data.data.userType === "Admin") {
        setAdmin(true);
      }

      setUserData(data.data);

      if (data.data === "token expired") {
        alert("Token expired, please log in again");
        window.localStorage.clear();
        window.location.href = "./sign-in";
      }
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }, [userData]); // Include userData in the dependency array to refetch data when userData changes

  // Check if userData exists before rendering
  if (!userData) {
    return null; // or loading indicator
  }

  return admin ? <AdminDashboard /> : <UserDashBoard userData={userData} />;
}