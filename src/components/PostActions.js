import React from "react";

const PostActions = ({ blogPostUrl, githubLink }) => {
  return (
    <div className='post-actions'>
      <a
        target="_blank"
        rel="noopener noreferrer"
        // using mobile.twitter.com because if people haven't upgraded
        // to the new experience, the regular URL wont work for them
        href={`https://mobile.twitter.com/search?q=${encodeURIComponent(
          blogPostUrl
        )}`}
      >
        Discuss on Twitter
      </a>
      <span css={{ marginLeft: 10, marginRight: 10 }}>{` • `}</span>
      <a target="_blank" rel="noopener noreferrer" href={githubLink}>
        Edit post on GitHub
      </a>
    </div>
  );
};

export default PostActions;
