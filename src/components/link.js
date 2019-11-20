import React from 'react'
import GatsbyLink from 'gatsby-link'
import styled from '@emotion/styled'

const Link = ({children, to, ...other}) => {
  const internal = /^\/(?!\/)/.test(to)

  if (internal) {
    return (
      <GatsbyLink to={to} {...other}>
        {children}
      </GatsbyLink>
    )
  }

  return (
    <a href={to} {...other}>
      {children}
    </a>
  )
}

const StyledLink = styled(Link)(({unstyled}) => {
  if (unstyled) {
    return {
      backgroundColor: 'unset',
      borderBottom: 'none',

      '&:hover,&:focus': {
        backgroundColor: 'unset',
        borderBottom: 'none',
      },
    }
  }
})

export default StyledLink
