const path = require('path')
const config = require('./config/website')
// const proxy = require('http-proxy-middleware')

const here = (...p) => path.join(__dirname, ...p)

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = config.siteUrl,
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env
const isNetlifyProduction = NETLIFY_ENV === 'production'
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL

module.exports = {
  developMiddleware: () => {
    // app.use(
    //   '/.netlify/functions/',
    //   proxy({
    //     target: 'http://localhost:9000',
    //     pathRewrite: {
    //       '/.netlify/functions/': '',
    //     },
    //   }),
    // )
  },
  siteMetadata: {
    siteUrl,
    siteLanguage: config.siteLanguage,
    title: config.siteTitle,
    twitterHandle: config.twitterHandle,
    description: config.siteDescription,
    keywords: config.keywords,
    canonicalUrl: siteUrl,
    image: config.siteLogo,
    author: {
      name: config.author,
      minibio: config.minibio,
    },
    organization: {
      name: config.organization,
      url: siteUrl,
      logo: config.siteLogo,
    },
    social: {
      twitter: config.twitterHandle,
      fbAppID: '',
    },
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/blog`,
        name: 'blog',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/writing-blog`,
        name: 'writing-blog',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/workshops`,
        name: 'workshops',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/podcast`,
        name: 'podcast',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src`,
        name: 'src',
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: here('./src/templates/markdown-page.js'),
        },
        extensions: ['.mdx', '.md', '.markdown'],
        gatsbyRemarkPlugins: [
          {resolve: 'gatsby-remark-copy-linked-files'},
          {
            resolve: 'gatsby-remark-images',
            options: {
              backgroundColor: '#fafafa',
              maxWidth: 1035,
            },
          },
          {resolve: 'gatsby-remark-embedder'},
        ],
      },
    },
    {
      resolve: 'gatsby-remark-images',
      options: {
        backgroundColor: '#fafafa',
        maxWidth: 1035,
      },
    },
    'gatsby-plugin-twitter',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-emotion',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: 'white',
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.siteTitle,
        short_name: config.siteTitleShort,
        description: config.siteDescription,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icons: [
          {
            src: '/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          getBlogFeed({
            filePathRegex: `//content/blog//`,
            blogUrl: 'https://duncanleung.com/blog',
            output: '/blog/rss.xml',
            title: 'Duncan Leung Blog RSS Feed',
          }),
          getBlogFeed({
            filePathRegex: `//content/writing-blog//`,
            blogUrl: 'https://duncanleung.com/writing/blog',
            output: '/writing/blog/rss.xml',
            title: `Duncans Writing Blog RSS Feed`,
          }),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-62924965-1`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/lib/typography`,
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{userAgent: '*'}],
          },
          'branch-deploy': {
            policy: [{userAgent: '*', disallow: ['/']}],
            sitemap: null,
            host: null,
          },
          'deploy-preview': {
            policy: [{userAgent: '*', disallow: ['/']}],
            sitemap: null,
            host: null,
          },
        },
      },
    },
    'gatsby-plugin-sitemap',
  ],
}

function getBlogFeed({filePathRegex, blogUrl, ...overrides}) {
  return {
    serialize: ({query: {allMdx}}) => {
      const stripSlash = slug => (slug.startsWith('/') ? slug.slice(1) : slug)
      return allMdx.edges.map(edge => {
        const url = `${siteUrl}/${stripSlash(edge.node.fields.slug)}`
        // TODO: clean this up... This shouldn't be here and it should be dynamic.
        const footer = `
          <div style="width: 100%; margin: 0 auto; max-width: 800px; padding: 40px 40px;">
            <div style="display: flex;">
              <div style="padding-right: 20px;">
                <img
                  src="https://duncanleung.com/images/small-circular-kent.png"
                  alt="Duncan Leung"
                  style="max-width: 80px; border-radius: 50%;"
                />
              </div>
              <p>
                <strong>Duncan Leung</strong> is a JavaScript software engineer passionate about developing quality software products with maintainable practices. He lives with his wife and two kids in Irvine, California.
              </p>
            </div>
          </div>
        `

        const postText = `<div>${footer}</div><div style="margin-top=55px; font-style: italic;">(This article was posted to my blog at <a href="${blogUrl}">${blogUrl}</a>. You can <a href="${url}">read it online by clicking here</a>.)</div>`

        // Hacky workaround for https://github.com/gaearon/overreacted.io/issues/65
        const html = (edge.node.html || ``)
          .replace(/href="\//g, `href="${siteUrl}/`)
          .replace(/src="\//g, `src="${siteUrl}/`)
          .replace(/"\/static\//g, `"${siteUrl}/static/`)
          .replace(/,\s*\/static\//g, `,${siteUrl}/static/`)

        return {
          ...edge.node.frontmatter,
          description: edge.node.excerpt,
          date: edge.node.fields.date,
          url,
          guid: url,
          custom_elements: [
            {
              'content:encoded': `<div style="width: 100%; margin: 0 auto; max-width: 800px; padding: 40px 40px;">
                ${html}
                ${postText}
              </div>`,
            },
          ],
        }
      })
    },
    query: `
     {
       site {
         siteMetadata {
           title
           description
         }
       }

       allMdx(
         limit: 1000,
         filter: {
           frontmatter: {published: {ne: false}}
           fileAbsolutePath: {regex: "${filePathRegex}"}
         }
         sort: { order: DESC, fields: [frontmatter___date] }
       ) {
         edges {
           node {
             excerpt(pruneLength: 250)
             html
             fields {
               slug
               date
             }
             frontmatter {
               title
             }
           }
         }
       }
     }
   `,
    ...overrides,
  }
}
