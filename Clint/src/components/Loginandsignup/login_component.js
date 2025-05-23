import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginLoader from "../../Confirmation/LoginLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState(""); // State for company name
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const navigate = useNavigate();

  const attemptLogin = async (url) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${url}`,
        { email, password, companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Network error. Please try again.";
      return { status: "error", error: errorMsg };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true); // Show loader

    if (!email || !password || !companyName) {
      setError("Please fill in all fields.");
      setIsLoading(false); // Hide loader
      return;
    }

    const userResponse = await attemptLogin("/login-user");
    if (userResponse.status === "ok") {
      handleLoginSuccess(userResponse);
    } else {
      const subAdminResponse = await attemptLogin("/SubAdminLogin");
      if (subAdminResponse.status === "ok") {
        handleLoginSuccess(subAdminResponse);
      } else {
        setError(subAdminResponse.error || "Invalid credentials.");
        setIsLoading(false); // Hide loader
      }
    }
  };

  const handleLoginSuccess = (data) => {
    setSuccess("Login successful");
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("email", email);
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("loggedIn", true);
    setTimeout(() => navigate("/DashBoard"), 2000);
  };

  const handleClick = () => setClicked(true);

  return (
    <div className="white1">

        <div>
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
  {isLoading ? (
    <LoginLoader />
  ) : (
    <form onSubmit={handleSubmit} className={`login ${clicked ? "clicked" : ""}`}>
      {error && <MessageBox message={error} type="error" />}
      {success && <MessageBox message={success} type="success" />}
      <h3 className="welcomehead1">WELCOME USER</h3>
      <div className="mb-3">
        <input
          type="text"
          className="login-input"
          placeholder="Enter Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
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
  )}
</div>

        </div>
    </div>
  );
}

function MessageBox({ message, type }) {
  return (
    <div className={`confirm-modal1 modalbox ${type} animate mb-3`}>
      <h5>{message}</h5>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg fill="#000000" width="20px" height="20px" viewBox="0 0 24 24">
      <path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/>
    </svg>
  );
}


function EyeSlashIcon() {
  return (
    <svg fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M10.94,6.08A6.93,6.93,0,0,1,12,6c3.18,0,6.17,2.29,7.91,6a15.23,15.23,0,0,1-.9,1.64,1,1,0,0,0-.16.55,1,1,0,0,0,1.86.5,15.77,15.77,0,0,0,1.21-2.3,1,1,0,0,0,0-.79C19.9,6.91,16.1,4,12,4a7.77,7.77,0,0,0-1.4.12,1,1,0,1,0,.34,2ZM3.71,2.29A1,1,0,0,0,2.29,3.71L5.39,6.8a14.62,14.62,0,0,0-3.31,4.8,1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20a9.26,9.26,0,0,0,5.05-1.54l3.24,3.25a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Zm6.36,9.19,2.45,2.45A1.81,1.81,0,0,1,12,14a2,2,0,0,1-2-2A1.81,1.81,0,0,1,10.07,11.48ZM12,18c-3.18,0-6.17-2.29-7.9-6A12.09,12.09,0,0,1,6.8,8.21L8.57,10A4,4,0,0,0,14,15.43L15.59,17A7.24,7.24,0,0,1,12,18Z"/></svg>
  );
}
