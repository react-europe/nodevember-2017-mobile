import React from 'react'

export default class HTML extends React.Component {
  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            property="og:title"
            content="ReactEurope - The original European React.js &amp; Native conference on May 2020 in Paris, France"
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.react-europe.org" />
          <meta
            property="og:image"
            content="https://www.react-europe.org/images/reacteurope.png"
          />
          <meta
            property="og:description"
            content="ReactEurope is back on May 2020 to bring you the best and most passionate people from the very core teams to the coolest people from the community we love. The conference aims to give talks that inspire and explore new futuristic ideas dealing with all the techs we enjoy from the React ecosystem such as React.js, React Native, GraphQL, Relay, Universal apps, ReasonML,  Webpack, inline CSS and more."
          />
          {this.props.headComponents}
          <link
            href="/img/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="180x180"
          />
          <link href="/img/favicon.ico" rel="icon" type="image/x-icon" />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            type="image/png"
            href="images/logo_icon.png?x=4"
          />
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}
