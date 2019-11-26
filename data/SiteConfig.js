const config = {
  siteTitle: "Duncan Leung",
  siteTitleShort: "Duncan Leung",
  siteTitleAlt: "Duncan Leung",
  siteLogo: "/logos/logo-1024.png",
  siteUrl: "https://www.duncanleung.com",
  repo: "https://github.com/duncanleung/duncanleung.com",
  pathPrefix: "",
  dateFromFormat: "YYYY-MM-DD",
  dateFormat: "MMMM Do, YYYY",
  siteDescription:
    "Duncan Leung is a front end web engineer and writer specializing in JavaScript, React, and web development.",
  siteRss: "/rss.xml",
  googleAnalyticsID: "UA-42068444-1",
  postDefaultCategoryID: "Tech",
  newsletter: "https://duncanleung.substack.com",
  newsletterEmbed: "https://duncanleung.substack.com/embed",
  // userName: 'Duncan',
  userEmail: "duncan@leung.house",
  userTwitter: "leungd",
  menuLinks: [
    {
      name: "Me",
      link: "/me/"
    },
    {
      name: "Articles",
      link: "/blog/"
    },
    {
      name: "Contact",
      link: "/contact/"
    }
  ],
  themeColor: "#FFD700", // Used for setting manifest and progress theme colors.
  backgroundColor: "#ffffff"
};

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/') config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/') config.siteRss = `/${config.siteRss}`

module.exports = config
