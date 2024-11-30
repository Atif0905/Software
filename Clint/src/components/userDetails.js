import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Initialize the navigation hook

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      alert("Token is missing or invalid. Please log in again.");
      window.localStorage.clear();
      navigate("/sign-in"); // Redirect to login page
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/userData`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data;

        if (data.data === "Token expired") {
          alert("Token expired, please log in again.");
          window.localStorage.clear();
          navigate("/sign-in"); // Redirect to login page
          return;
        }

        setUserData(data.data);

        // Redirect based on userType
        switch (data.data?.userType) {
          case "Admin":
            navigate("/AdminDashboard");
            break;
          case "Accounts":
            navigate("/AccountsDashboard");
            break;
          case "User":
            navigate("/UserDashboard");
            break;
          case "SubAdmin":
            navigate("/SubAdminDashboard");
            break;
          default:
            console.error("Unknown userType received:", data.data?.userType);
            alert("Unauthorized access.");
            navigate("/sign-in"); // Redirect to login page for safety
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response from API:", error.response.data);
        } else {
          console.error("Error making request:", error.message);
        }
        alert("There was an error fetching your data. Please try again.");
        navigate("/sign-in"); // Redirect to login page
      });
  }, [navigate]); // Add navigate to dependencies

  return null; // No UI needed here as redirection handles everything
}
