import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [companyName, setCompanyName] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [UniqueID, setUniqueID] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((userType === "Admin" || userType === "SuperAdmin") && secretKey !== "Admin") {
      alert("Invalid Admin");
    } else if (!companyName.trim()) {
      alert("Company name is required");
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/register`,
          {
            companyName, fname, lname, email, password, userType,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((response) => {
          const data = response.data;
          console.log(data, "userRegister");
          if (data.status === "ok") {
            alert(`Registration successful! Database created for ${companyName}`);
          } else if (data.error) {
            alert(data.error);
          } else {
            alert("Something went wrong");
          }
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          alert("Error occurred during registration. Check console for details.");
        });
    }
  };

  return (
    <div className="p-5">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Company Name</label>
            <input type="text" className="form-control" placeholder="Enter company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div>
            Register As
            <div className="d-flex justify-content-between">
              <div>
                <input type="radio" name="UserType" value="User" onChange={(e) => setUserType(e.target.value)} />
                User
              </div>
              <div>
                <input type="radio" name="UserType" value="Accounts" onChange={(e) => setUserType(e.target.value)} />
                Accounts
              </div>
              <div>
                <input type="radio" name="UserType" value="Admin" onChange={(e) => setUserType(e.target.value)} />
                Admin
              </div>
              <div>
                <input type="radio" name="UserType" value="SuperAdmin" onChange={(e) => setUserType(e.target.value)} />
                SuperAdmin
              </div>
            </div>
          </div>
          {(userType === "Admin" || userType === "SuperAdmin") && (
            <div className="mb-3">
              <label>Secret Key</label>
              <input type="text" className="form-control" placeholder="Secret Key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
            </div>
          )}
          <div className="mb-3">
            <label>First name</label>
            <input type="text" className="form-control" placeholder="First name" value={fname} onChange={(e) => setFname(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label>Last name</label>
            <input type="text" className="form-control" placeholder="Last name" value={lname} onChange={(e) => setLname(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>UniqueID</label>
            <input type="UniqueID" className="form-control" placeholder="Enter UniqueID" value={UniqueID} onChange={(e) => setUniqueID(e.target.value)}/>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <Link to="/sign-in">sign in?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
