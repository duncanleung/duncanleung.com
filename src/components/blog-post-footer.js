import React from 'react'
import photoOfDuncan from '../images/duncan.jpg'

function BlogFooter() {
  return (
    <div style={{display: 'flex'}}>
      <div
        style={{
          paddingRight: 20,
        }}
      >
        <img
          src={photoOfDuncan}
          alt="Duncan Leung"
          style={{
            maxWidth: 80,
            borderRadius: '50%',
          }}
        />
      </div>
      <p>
        <strong>Duncan Leung</strong>
        {`
          is a JavaScript software engineer passionate about developing quality software products with maintainable practices. He lives with his wife and two kids in Irvine, California.
        `}
      </p>
    </div>
  )
}

export default BlogFooter
