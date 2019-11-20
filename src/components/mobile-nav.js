import React, {useState} from 'react'
import {css} from '@emotion/core'
import styled from '@emotion/styled'
import theme from '../../config/theme'
import Container from './container'
import {Link} from 'gatsby'

const MenuLink = styled(Link)`
  background-color: unset;
  borderBottom: ${theme.colors.black};

  &:hover,
  &:focus {
    color: ${theme.colors.link_color_hover};
    background-color: unset;
    border-bottom: 1px solid ${theme.brand.primary};
  },
`

const Toggle = ({color = 'white'}) => {
  const [isToggledOn, setToggle] = useState(false)
  const toggle = () => setToggle(!isToggledOn)

  return (
    <div className="mobile-nav">
      <button
        onClick={toggle}
        aria-label={`${isToggledOn ? 'close menu' : 'open menu'}`}
        css={css`
          z-index: 30;
          top: -5px;
          position: relative;
          background: transparent;
          border: none;
          :hover:not(.touch),
          :focus {
            background: transparent;
            border: none;
            outline: none;
          }
        `}
      >
        <div
          css={css`
            width: 24px;
            height: 2px;
            background: ${color};
            position: absolute;
            left: 0;
            ${isToggledOn ? 'background: transparent' : `background: ${color}`};
            transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1);
            ::before {
              content: '';
              top: -8px;
              width: 24px;
              height: 2px;
              background: ${isToggledOn ? 'white' : `${color}`};
              position: absolute;
              left: 0;
              ${isToggledOn
                ? 'transform: rotate(45deg); top: 0; '
                : 'transform: rotate(0)'};
              transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1);
            }
            ::after {
              top: 8px;
              content: '';
              width: 24px;
              height: 2px;
              background: ${isToggledOn ? 'white' : `${color}`};
              position: absolute;
              left: 0;
              ${isToggledOn
                ? 'transform: rotate(-45deg); top: 0;'
                : 'transform: rotate(0)'};
              transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1);
            }
          `}
        />
      </button>
      {isToggledOn && (
        <div
          css={css`
            position: absolute;
            z-index: 20;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            background: ${theme.colors.black};
          `}
        >
          <Container
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-evenly;
              a {
                color: ${theme.brand.primary};
                font-size: 22px;
                margin: 10px 0;
                padding: 10px;
                :hover {
                  // background: rgba(0, 0, 0, 0.2);
                }
              }
              .active {
                // background: rgba(0, 0, 0, 0.2);
              }
            `}
          >
            {/* <Link
              aria-label="View talks page"
              to="/talks"
              activeClassName="active"
            >
              Talks
            </Link>
            <Link
              aria-label="View workshops page"
              to="/workshops"
              activeClassName="active"
            >
              Workshops
            </Link>
            <Link
              aria-label="View podcast page"
              to="/chats-with-kent-podcast/seasons/01"
              activeClassName="active"
            >
              Podcast
            </Link> */}
            <MenuLink
              aria-label="View blog page"
              to="/blog"
              activeClassName="active"
            >
              Blog
            </MenuLink>
            <MenuLink
              aria-label="View about page"
              to="/about"
              activeClassName="active"
            >
              About
            </MenuLink>
          </Container>
        </div>
      )}
    </div>
  )
}

export default Toggle
