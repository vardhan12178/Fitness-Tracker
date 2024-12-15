import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import "./SocialSharing.css";

const SocialSharing = () => {
  const shareUrl = window.location.href;
  const title = "Check out my fitness progress!";

  return (
    <div className="social-sharing">
      <h2>Share Your Progress</h2>
      <div className="share-buttons">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default SocialSharing;
