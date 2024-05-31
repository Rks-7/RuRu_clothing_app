import React from 'react'
import { PiBagSimpleBold } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";

import "./Navbar.css"


const Navbar = () => {
  return (
    <div>
      <div className="navbar">
        <a href="/" className="logo">
          <div>RuRu</div>
        </a>

        <div className="rightbtns">
          <div className="bag">
            <PiBagSimpleBold className="baglogo" />
          </div>
          <div className="account">
            <FiUser className="userlogo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar
