import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "../Home/AdminDashboard/AdminDashboard";
import AccountsDashboard from "../Home/AdminDashboard/AccountsDashboard";
import UserDashBoard from "../Home/UserDashboard/UserDashBoard";
import Sidebar from "../Sidebar/Sidebar";
import AccountsSidebar from "../Sidebar/AccountsSidebar";
import SubAdminDash from "../Home/SubAdminDashboard/SubAdminDash";
import SubAdmin from "../Sidebar/SubAdmin";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [dashboard, setDashboard] = useState(null); // Track which dashboard to show

  useEffect(() => {
    // Get the token from localStorage
    const token = window.localStorage.getItem("token");

    console.log("Token from localStorage:", token); // Log the token for debugging

    // Check if the token is available
    if (!token) {
      console.error("No token found in localStorage.");
      alert("Token is missing or invalid. Please log in again.");
      window.localStorage.clear();
      window.location.href = "./sign-in"; // Redirect to login if no token
      return;
    }

    // If token is available, log it
    console.log("Token being sent:", token); // Log token before making request

    // Make the API request with the token
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/userData`,
        { token }, // Sending token in request body
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data;

        // Handle expired token or invalid session
        if (data.data === "Token expired") {
          console.warn("Token expired detected from server response.");
          alert("Token expired, please log in again.");
          window.localStorage.clear();
          window.location.href = "./sign-in"; // Redirect to login page
          return;
        }

        // Set the user data and determine the appropriate dashboard
        setUserData(data.data);

        // Log the received user data for debugging
        console.log("User data received from API:", data.data);

        // Set the appropriate dashboard based on user type
        switch (data.data?.userType) {
          case "Admin":
            setDashboard(
              <div>
                <Sidebar />
                <AdminDashboard />
              </div>
            );
            break;
          case "Accounts":
            setDashboard(
              <div>
                <AccountsSidebar />
                <AccountsDashboard userData={data.data} />
              </div>
            );
            break;
          case "User":
            setDashboard(<UserDashBoard userData={data.data} />);
            break;
          case "SubAdmin":
            setDashboard(
              <div>
                <SubAdmin />
                <SubAdminDash userData={data.data} />
              </div>
            );
            break;
          default:
            console.error("Unknown userType received:", data.data?.userType);
        }
      })
      .catch((error) => {
        // Check for errors and log them
        if (error.response) {
          console.error("Error response from API:", error.response.data);
        } else {
          console.error("Error making request:", error.message);
        }

        // Provide user-friendly error message
        alert("There was an error fetching your data. Please try again.");
      });
  }, []); // Empty array means this effect runs only once after the first render

  if (!userData) {
    return null; // Show nothing while data is being fetched
  }

  return dashboard; // Render the appropriate dashboard based on user type
}
