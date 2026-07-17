import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { CiUser } from "react-icons/ci";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MindCare</Link>
      </div>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <Link to="/journal">Journaling</Link>
        <Link to="/calm">Exercitii</Link>
        <Link to="/listen">2AM buddy</Link>
      </nav>

       <button className="account-btn">
        <CiUser className="icon" />
      </button>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </header>
  );
}

export default Header;