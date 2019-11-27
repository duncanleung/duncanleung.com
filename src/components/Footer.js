import React from "react";
import netlify from "../images/netlify.png";
import github from "../images/github.png";
import gatsby from "../images/gatsby.png";

const Footer = () => {
  return (
    <footer className="footer container">
      <div>
        <a
          href="https://www.duncanleung.com/rss.xml"
          rel="noopener noreferrer"
          target="_blank"
        >
          RSS
        </a>
      </div>
      <div>
        <a
          href="https://github.com/duncanleung"
          rel="noopener noreferrer"
          target="_blank"
          title="Open-source on GitHub"
        >
          <img src={github} className="footer-img" alt="GitHub" />
        </a>
        <a
          href="https://www.netlify.com/"
          rel="noopener noreferrer"
          target="_blank"
          title="Hosted by Netlify"
        >
          <img src={netlify} className="footer-img" alt="GitHub" />
        </a>
        <a
          href="https://www.gatsbyjs.org/"
          rel="noopener noreferrer"
          target="_blank"
          title="Built with Gatsby"
        >
          <img src={gatsby} className="footer-img" alt="GitHub" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
