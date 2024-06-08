import React from 'react';
import { FaLinkedinIn } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import "./Footer.css"

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>
              We are a team dedicated to providing the best products and
              services.
            </p>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>Email: rugvedscindia@gmail.com</p>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <br />
            <a
              href="https://www.linkedin.com/in/rugved-shinde-04ab2417b/"
              target="_blank"
            >
              <FaLinkedinIn />
            </a>
            <a href="https://twitter.com/Rugved71" target="_blank">
              <FaXTwitter />
            </a>
            <a href="https://github.com/Rks-7" target="_blank">
              <FaGithub />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} RuRu Clothing. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Footer
