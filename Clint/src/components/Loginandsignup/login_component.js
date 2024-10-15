import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const attemptLogin = async (url) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${url}`,
        { email, password }, // Fix: Correct payload structure
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response.data); // Debugging response
      return response.data;
    } catch (err) {
      if (err.response) {
        return { status: "error", error: err.response.data.error };
      }
      return { status: "error", error: "Network error. Please try again." };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter a valid Email ID and Password.");
      return;
    }

    const loginUserResponse = await attemptLogin("/login-user");

    if (loginUserResponse.status !== "ok") {
      const subAdminResponse = await attemptLogin("/SubAdminLogin");
      handleResponse(subAdminResponse);
    } else {
      handleResponse(loginUserResponse);
    }
  };

  const handleResponse = (data) => {
    console.log(data); // Debugging: Inspect response structure

    if (data.status === "ok" && data.data?.token) {
      setSuccess("Login successful");
      window.localStorage.setItem("token", data.data.token);
      window.localStorage.setItem("email", email);
      window.localStorage.setItem("loggedIn", true);
      setTimeout(() => navigate("/DashBoard"), 2000);
    } else {
      setError(data.error || "Enter the correct password.");
    }
  };

  const handleClick = () => setClicked(true);

  return (
    <div className="white1">
      <div>
        <img
          src="./signinimg.webp"
          className={`background ${clicked ? "clicked" : ""}`}
          alt="CRM background"
        />
        <div className="container">
          <h3 className={`loginhead ${clicked ? "clicked" : ""}`}>CRM</h3>
          <h3 className={`loginsubhead ${clicked ? "clicked" : ""}`}>
            Customer Relationship Management
          </h3>
          <p className={`logintext ${clicked ? "clicked" : ""}`}>
            A CRM system helps businesses manage customer interactions, track
            sales, and streamline operations.
          </p>
          <p className={`clickhere ${clicked ? "clicked" : ""}`}>
            Click Here &gt;&gt;
          </p>
        </div>
        <div className={`auth-wrapper ${clicked ? "clicked" : ""}`}>
          <div className="slidewhite">
            <div className="slideblue">
              <img
                src="./Trust.webp"
                className={`slidingimg ${clicked ? "rotate" : ""}`}
                alt="Trust"
                onClick={handleClick}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="offset-6 col-6">
        <form
          onSubmit={handleSubmit}
          className={`login ${clicked ? "clicked" : ""}`}
        >
          {error && <MessageBox message={error} type="error" />}
          {success && <MessageBox message={success} type="success" />}
          <h3 className="welcomehead1">WELCOME USER</h3>
          <div className="mb-3">
            <input
              type="email"
              className="login-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="position-absolute"
              style={{ right: "15px", top: "8px", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
          <div className="mb-3">
            <div className="checkbox-wrapper-33">
              <label className="checkbox">
                <input
                  className="checkbox__trigger visuallyhidden"
                  type="checkbox"
                />
                <span className="checkbox__symbol">
                  <svg
                    aria-hidden="true"
                    className="icon-checkbox"
                    width="28px"
                    height="28px"
                    viewBox="0 0 28 28"
                  >
                    <path d="M4 14l8 7L24 7"></path>
                  </svg>
                </span>
                <p className="checkbox__textwrapper">Remember Me</p>
              </label>
            </div>
          </div>
          <div className="center">
            <button type="submit" className="loginbutt">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MessageBox({ message, type }) {
  return (
    <div className={`confirm-modal modalbox ${type} animate mb-3`}>
      <h5>{message}</h5>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      className="eye"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 576 512"
    >
      <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32z" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg
      className="eye-slash"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 640 512"
    >
      <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4..." />
    </svg>
  );
}
