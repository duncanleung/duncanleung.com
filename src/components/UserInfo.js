import React, { Component } from 'react'
import duncan from '../../content/images/duncan-thumbnail.jpg'
// import patreon from '../../content/thumbnails/patreon.png'
// import kofi from '../../content/thumbnails/kofi.png'

export default class UserInfo extends Component {
  render() {
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className="avatar" src={duncan} alt="Duncan Leung" />
            </div>
            <div>
              <p>
                👋 Hi, I’m Duncan Leung.
                <br /> I&apos;m a self taught software developer 👨🏻‍💻, and this is
                a place for me to <a href="/learn">📝&nbsp;learn in public</a>.
              </p>

              {/* <div className="flex">
                <a
                  href="https://ko-fi.com/taniarascia"
                  className="donate-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={kofi} className="coffee-icon" alt="Coffee icon" />
                  Buy me a coffee
                </a>
                <a
                  className="patreon-button"
                  href="https://www.patreon.com/taniarascia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={patreon} height="50" width="50" alt="Patreon" /> Become a Patron
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
