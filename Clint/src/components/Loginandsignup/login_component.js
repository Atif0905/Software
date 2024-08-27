import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function ShowPassword() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/login-user`,
        {
          email,
          password,
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
        if (data.status === "ok") {
          setSuccess("Login successful");
          setError("");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          setTimeout(() => {
            navigate("/userDetails");
          }, 2000);
        } else {
          setError(data.error || "Login failed");
          setSuccess("");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("An error occurred. Please try again later.");
        setSuccess("");
      });
  }

  return (
    <div className="background mt-5">
      <div className="container">
        <div className="auth-wrapper">
          <div className="auth-inner">
            {error && (
              <div className=".confirm-modal modalbox error animate mb-3">
                <h1>Oh no!</h1>
                <p>
                  Oops! Something went wrong,
                  <br /> you should try again.
                </p>
              </div>
            )}
            {success && (
              <div className=" .confirm-modal modalbox success animate mb-3">
                <div className="icon">
                  <span className="glyphicon glyphicon-ok"></span>
                </div>
                <h1>Success!</h1>
                <p>You have Logged in Successfully</p>
              </div>
            )}
            
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
                  id="myInput"
                />
                <br />
                <input type="checkbox" onClick={ShowPassword} />
                <label className="custom-control-label">Show Password</label>
              </div>
              <div className="mb-3">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customCheck1"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
