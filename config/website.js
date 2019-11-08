module.exports = {
  siteTitle: 'Duncan Leung', // Navigation and Site Title
  siteTitleAlt: 'The personal website of Duncan Leung', // Alternative Site title for SEO
  siteTitleShort: 'duncanleung', // short_name for manifest
  siteUrl: process.env.ROOT_URL || 'https://duncanleung.com', // Domain of your site. No trailing slash!
  siteLanguage: 'en', // Language Tag on <html> element
  siteLogo: 'images/logo.png', // Used for SEO and manifest, path to your image you placed in the 'static' folder
  siteDescription: 'Duncan Leung - Javascript Engineer.',
  minibio: `
    <strong>Duncan Leung</strong> is a JavaScript software engineer passionate about developing quality software products with maintainable practices. He lives with his wife and two kids in Irvine, California.
  `,
  author: 'Duncan Leung', // Author for schemaORGJSONLD
  organization: 'Duncan Leung',

  // siteFBAppID: '123456789', // Facebook App ID - Optional
  userTwitter: '@leungd', // Twitter Username
  ogSiteName: 'Duncan Leung', // Facebook Site Name
  ogLanguage: 'en_US',
  googleAnalyticsID: 'UA-11663860-1',

  // Manifest and Progress color
  themeColor: '#4147DC',
  backgroundColor: '#231C42',

  // Social component
  twitter: 'https://twitter.com/leungd/',
  twitterHandle: '@leungd',
  github: 'https://github.com/duncanleung/',
  linkedin: 'https://www.linkedin.com/in/duncanleung/',
  youtube: 'https://www.youtube.com/',
  rss: 'https://duncanleung.com/blog/rss.xml',
}
