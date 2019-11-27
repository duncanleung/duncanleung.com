import React from "react";
import twitter from '../images/twitter.png'

const Share = ({ twitterHandler }) => (
  <div className="share">
    <div className="divider" />
    <span>Share article</span>
    <a
      className="twitter-link"
      href={twitterHandler}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={twitter} alt="Share on Twitter" />
    </a>
  </div>
);

export default Share;
