import React from "react";
import UploadedProjects from "../AdminDashboard/ShowProjects";

const UserDashBoard = ({userData}) => {
    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./sign-in";
      };
  return (
    <div>
 
     <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          Name<h1>{userData.fname}</h1>
      <br/>
          <UploadedProjects/>
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default UserDashBoard