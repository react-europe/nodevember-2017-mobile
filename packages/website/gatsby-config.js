module.exports = {
  siteMetadata: {
    title:
      'ReactEurope - The original European React.js &amp; Native conference on May 14-15th, 2020 in Paris, France',
    description:
      'ReactEurope - The original European React.js &amp; Native conference on May 14-15th, 2020 in Paris, France',
    siteUrl: 'https://www.react-europe.org',
    author: 'ReactEurope',
    twitter: 'ReactEurope',
    'og:title':
      'ReactEurope - The original European React.js &amp; Native conference on May 14-15th, 2020 in Paris, France',
    'og:type': 'website',
    'og:image': 'https://www.react-europe.org/images/reacteurope.png',
  },
  pathPrefix: '/',
  plugins: [
    'gatsby-plugin-svgr',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/images/`,
        name: 'images',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 750,
              linkImagesToOriginal: false,
              wrapperStyle: 'margin-bottom: 1.0725rem;',
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          `gatsby-remark-lazy-load`,
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-42478610-5',
      },
    },
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        mergeSecurityHeaders: true,
        mergeLinkHeaders: true,
        mergeCachingHeaders: true,
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        // This type will contain remote schema Query type
        typeName: 'Eventlama',
        // This is the field under which it's accessible
        fieldName: 'eventlama',
        // URL to query from
        url: 'https://api.eventlama.com/gql',
        refetchInterval: 60,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'ReactEurope',
        short_name: 'ReactEurope',
        description:
          'The original European React.js & Native conference on May 14-15th, 2020 in Paris, France',
        homepage_url: 'https://www.react-europe.org',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        icons: [
          {
            src: '/img/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-twitter',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        // tailwind: true, // Enable tailwindcss support
        whitelist: [
          '.headroom',
          '.headroom--unfixed header',
          '.headroom--unfixed header.desktop_header',
          '.headroom--unfixed header.desktop_header',
          'header.fixed-header',
          'header.fixed-header a.nav-link',
          'header.fixed-header li.nav-item.active a.nav-link',
          'alert-info',
          'alert-warning',
          'allert-success',
          'alert-danger',
          '.alert-info',
          '.alert-warning',
          '.allert-success',
          '.alert-danger',
        ], // Don't remove this selector
        ignore: ['style.scss'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      },
    },
  ],
}
