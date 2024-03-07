import React from "react";
import UserDashBoard from "../Home/UserDashboard/UserDashBoard";

export default function UserHome({ userData }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  return (
    <div className="auth-wrapper">
     <UserDashBoard/>
    </div>
  );
}
