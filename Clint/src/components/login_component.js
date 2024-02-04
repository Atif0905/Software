import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import axios from 'axios'; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  function handleSubmit(e) {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_URL}/login-user`, {
      email,
      password,
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
        alert("login successful");
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);
        navigate("/userDetails");
      }
      else {
        setError(data.error || "Login failed");
      }
    })
    .catch((error) => {
      console.error('Error logging in:', error);
    });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>

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

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <a href="/sign-up">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
