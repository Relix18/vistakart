import React from "react";
import "../styles/Footer.scss";
import { FaGooglePlay } from "react-icons/fa";
import { FaAppStoreIos } from "react-icons/fa";
import logo from "../assets/LOGO_WHITE.png";

const Footer = () => {
  return (
    <footer id="Footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>App for Android and IOS.</p>
        <p>Coming Soon...</p>
        <FaGooglePlay />
        <FaAppStoreIos />
      </div>

      <div className="midFooter">
        <img src={logo} alt="logo" />
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; Relix</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/not_siddharth__/" target="_blank">
          Instagram
        </a>
        <a href="">Youtube</a>
        <a href="">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
