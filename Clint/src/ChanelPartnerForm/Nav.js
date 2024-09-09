import React, { useState } from "react";
import "./Chanel.css";
import { Link, NavLink} from "react-router-dom";
 const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <Link to="https://wic.org.in/" className="title">
        <img  src="./wiclogo.png" alt="ll" />
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink onClick={() => setMenuOpen(!menuOpen)} className="link-font" to="https://wic.org.in/">HOME</NavLink>
        </li>
        <li>
          <NavLink onClick={() => setMenuOpen(!menuOpen)} className="link-font" to="https://wic.org.in/About-womeki-investors-club">ABOUT</NavLink>
        </li>
        <li>
          <NavLink onClick={() => setMenuOpen(!menuOpen)} className="link-font" to="https://wic.org.in//Projects">PROJECTS</NavLink>
        </li>
        <li>
          <NavLink onClick={() => setMenuOpen(!menuOpen)} className="link-font" to="https://wic.org.in//Gallery">GALLERY</NavLink>
        </li>
        <li>
          <NavLink onClick={() => setMenuOpen(!menuOpen)} className="link-font" to="https://wic.org.in//Contact">CONTACT</NavLink>
        </li>
        <li>
          <button onClick={() => setMenuOpen(!menuOpen)} className="link-font1" to="/Chanel-Partner-form">REGISTER</button>
        </li>
        <li>
        </li>
      </ul>
    </nav>
  );
};
export default Nav