import React from "react";
import { navitems } from "../../constants/navitems";
import "./nav.css";
function Navbar() {
  console.log("nav", navitems);
  return (
    <nav className="nav">
      <div>
        <img src="/vite.svg" alt="logo" />
      </div>
      <div>
        {navitems.map((nav) => (
          <span>{nav.name}</span>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
