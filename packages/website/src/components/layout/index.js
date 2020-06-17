import React from 'react'
import emergence from 'emergence.js'
import Navi from 'components/navi'
import Headroom from 'react-headroom'
import { useStaticQuery, graphql } from 'gatsby'

import 'modern-normalize/modern-normalize.css'
import 'prismjs/themes/prism.css'
import 'scss/gatstrap.scss'
import 'animate.css/animate.css'
import 'font-awesome/css/font-awesome.css'
import '../../scss/style.scss'

export default function Layout({ children, ...rest }) {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  React.useEffect(() => {
    emergence.init()
  }, [])

  return (
    <div>
      <Headroom>
        <Navi title={data.site.siteMetadata.title} {...rest} />
      </Headroom>
      {children}
    </div>
  )
}
