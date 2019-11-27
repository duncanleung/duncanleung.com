import React, { Component } from "react";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
// import SimpleListing from '../components/SimpleListing'
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
// import speaking from '../../data/speaking'
import duncan from "../../content/images/duncan-hero.jpg";
// import patreon from '../../content/thumbnails/patreon.png'
import github from "../../content/thumbnails/github.png";

export default class Index extends Component {
  render() {
    const { data } = this.props;

    const latestPostEdges = data.latest.edges;
    // const popularPostEdges = data.popular.edges

    return (
      <Layout>
        <Helmet title={`${config.siteTitle} – Javascript Engineer`} />
        <SEO />
        <div className="container">
          <div className="lead">
            <div className="elevator">
              <div
                className="lead-container"
              >
                <img
                  src={duncan}
                  alt="Duncan Leung"
                />
                <h1>👋 Hi, I&apos;m Duncan&nbsp;Leung</h1>
              </div>
              <p>
                I&apos;m a front end web engineer and former product manager. I
                write about JavaScript, React, and web development.
              </p>
              <p>
                I&apos;m a self taught software developer 👨🏻‍💻, and this is a
                place for me to <a href="/learn"> 📝 learn in public</a>.
              </p>
              <div className="social-buttons">
                {/* <a
                  className="patreon-button"
                  href="https://www.patreon.com/taniarascia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={patreon} height="50" width="50" alt="Patreon" />
                </a> */}
                <a
                  className="github-button"
                  href="https://github.com/duncanleung"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={github} height="50" width="50" alt="GitHub" />
                </a>
              </div>
            </div>
            {/* <div className="newsletter-section">
              <img src={tania} className="newsletter-avatar" alt="Tania" />
              <div>
                <h3>Get updates</h3>
                <p>Open source projects and development tutorials</p>
                <a className="button" href="https://taniarascia.substack.com">
                  Subscribe
                </a>
              </div>
            </div> */}
          </div>
        </div>

        <div className="container front-page">
          <section className="section">
            <h2>
              Latest Articles
              <Link to="/blog" className="view-all">
                View all
              </Link>
            </h2>
            <PostListing simple postEdges={latestPostEdges} />
          </section>

          {/* <section className="section">
            <h2>
              Most Popular
              <Link to="/categories/popular" className="view-all">
                View all
              </Link>
            </h2>
            <PostListing simple postEdges={popularPostEdges} />
          </section> */}

          {/* <section className="section">
            <h2>Talks</h2>
            <SimpleListing simple data={speaking} />
          </section> */}
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    latest: allMarkdownRemark(
      limit: 6
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
    popular: allMarkdownRemark(
      limit: 7
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { categories: { eq: "Popular" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
  }
`;
