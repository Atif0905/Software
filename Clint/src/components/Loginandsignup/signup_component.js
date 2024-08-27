import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === "Admin" && secretKey !== "Womeki") {
      alert("Invalid Admin");
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        fname,
        lname,
        email,
        password,
        userType,
      }, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      })
      .then((response) => {
        const data = response.data;
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("Registration Successful");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <div>
            Register As
            <div className="d-flex justify-content-between">
              <div>
            <input
              type="radio"
              name="UserType"
              value="User"
              onChange={(e) => setUserType(e.target.value)}
            />
            User
            </div>
            <div>
            <input
              type="radio"
              name="UserType"
              value="Accounts"
              onChange={(e) => setUserType(e.target.value)}
            />
            Accounts</div>
            <div>
            <input
              type="radio"
              name="UserType"
              value="Admin"
              onChange={(e) => setUserType(e.target.value)}
            />
            Admin</div>
            </div>
          </div>
          {userType === "Admin" && (
            <div className="mb-3">
              <label>Secret Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          )}
          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
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