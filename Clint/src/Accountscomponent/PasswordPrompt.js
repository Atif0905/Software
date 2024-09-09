import React, { useState } from "react";
import './Accounts.css';
const PasswordPrompt = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };
  return (
    <div className="confirm-modal">
      <div className="confirm-modal-content">
        <h3>Enter Password</h3>
        <form onSubmit={handleSubmit}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="password-input"/>
          <div className="password-prompt-actions">
            <button type="submit" className="yesbutton">Submit</button>
            <button type="button" onClick={onClose} className="nobutton">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PasswordPrompt;