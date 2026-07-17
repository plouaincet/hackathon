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
        <Link to="/">Acasă</Link>
        <Link to="/listen">Ascultă</Link>
        <Link to="/vent">Vent</Link>
      </nav>

      <button className="account-btn">
        Account
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