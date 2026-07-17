import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MindCare</Link>
      </div>

      <nav className={menuOpen ? "nav active" : "nav"}>
        <Link to="/">Journaling</Link>
        <Link to="/listen">Exercitii</Link>
        <Link to="/vent">2AM buddy</Link>
      </nav>

      <button className="account-btn">
        <div className="circle"></div>
        <div className="circlejos"></div>
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