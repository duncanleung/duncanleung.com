import {graphql, useStaticQuery} from 'gatsby'

const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteLanguage
          title
          description
          author {
            name
          }
          keywords
        }
      }
    }
  `)

  return data.site.siteMetadata
}

export default useSiteMetadata
