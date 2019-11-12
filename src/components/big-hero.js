import React from 'react'
import {css} from '@emotion/core'
import theme from '../../config/theme'
import {bpMaxMD, bpMaxSM} from '../lib/breakpoints'
import {rhythm, fonts} from '../lib/typography'
import Markdown from 'react-markdown'
import Container from 'components/container'

import photoOfDuncan from '../images/hero/duncan.jpg'

function Hero({
  children,
  title = `Hi, I'm Duncan Leung. I'm a Javascript Engineer passionate about developing quality software products with maintainable practices.`,
  text,
  image = `${photoOfDuncan}`,
}) {
  return (
    <section
      css={css`
        * {
          color: ${theme.colors.white};
        }
        width: 100%;
        background: ${theme.colors.black};
        background-position: center right, center left;
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 0;
        position: relative;
        align-items: center;
        display: flex;
        padding-top: 40px;

        ${bpMaxMD} {
          background-size: cover;
        }
        ${bpMaxSM} {
          padding-top: 60px;
        }
      `}
    >
      {children}
      <Container
        css={css`
          display: flex;
          flex-direction: row;
          align-items: end;
          justify-content: space-between;
          padding-bottom: 0;
          ${bpMaxMD} {
            flex-direction: column;
            align-items: center;
          }
        `}
      >
        <div
          css={css`
            display: none;
            visibility: hidden;
            ${bpMaxMD} {
              display: block;
              visibility: visible;
              width: 250px;
              height: 250px;
              ${image === photoOfDuncan &&
                `
                width: 160px;
              height: 160px;
              overflow: 'hidden';
              border-radius: 50%;
              `}
              background-image: url(${image});
              background-size: cover;
              background-repeat: no-repeat;
              margin-bottom: 25px;
            }
          `}
        />
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <h1
            css={css`
              position: relative;
              z-index: 5;
              line-height: 1.5;
              margin: 0;
              max-width: ${rhythm(17)};
              font-size: 30px;
              height: 100%;
              display: flex;
              padding-bottom: ${image === photoOfDuncan ? '40px' : '0'};
            `}
          >
            {title}
          </h1>
          {text && (
            <Markdown
              css={css`
                padding-bottom: 30px;
                p {
                  color: hsla(255, 100%, 100%, 0.9);
                  font-family: ${fonts.light};
                }
                max-width: 400px;
                margin-top: ${rhythm(0.5)};
                a {
                  text-decoration: underline;
                  color: hsla(255, 100%, 100%, 1);
                  :hover {
                    color: hsla(255, 100%, 100%, 0.9);
                  }
                }
              `}
            >
              {text}
            </Markdown>
          )}
        </div>
        <div
          css={{
            marginRight: '-60px',
            width: 230,
            height: 230,
            display: 'flex',
            [bpMaxMD]: {
              display: 'none',
              visibility: 'hidden',
            },
          }}
        >
          <img
            src={image}
            alt="Duncan Leung"
            css={{
              maxWidth: '100%',
              maxHeight: '100%',
              marginBottom: 0,
              borderRadius: '50%',
            }}
          />
        </div>
      </Container>
    </section>
  )
}

export default Hero
