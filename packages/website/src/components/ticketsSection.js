import React from 'react'
import IframeResizer from 'iframe-resizer-react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

export default function TicketsSection() {
  const [isFrench, setIsFrench] = React.useState(false)
  const [isPL, setIsPL] = React.useState(false)

  const imgs = useStaticQuery(graphql`
    {
      ticket: file(relativePath: { eq: "ticket.png" }) {
        childImageSharp {
          fixed(width: 80, height: 80) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  React.useEffect(() => {
    fetch('https://api.eventlama.com/geoip')
      .then(res => res.json())
      .then(json => {
        if (json.CountryCode === 'FR') {
          setIsFrench(true)
        }
        if (json.CountryCode === 'PL') {
          setIsPL(true)
        }
      })
      .catch(err => {})
  }, [])
  return (
    <>
      <a id="tickets"></a>
      <section class="book_ticket" id="book_ticket">
        <div class="container">
          <div class="container">
            <div class="headings">
              <Img fixed={imgs.ticket.childImageSharp.fixed} />
              <h2>Get Your Tickets</h2>
              {isFrench ? (
                <h4>
                  <a
                    href="https://www.oxiane.com/oxiane-partenaire-formation-reacteurope-2020-la-conference-europeenne-sur-reactjs-et-react-native/"
                    target="_blank"
                  >
                    🇫🇷 Si vous êtes français et que vous souhaitez utiliser
                    votre budget de formation professionnelle pour financer
                    votre inscription, contactez notre partenaire Oxiane
                  </a>
                </h4>
              ) : null}
              <h3>
                Tickets are now available for both conference and workshops.
              </h3>
              {!isFrench && !isPL && false ? (
                <h4>
                  Limited offer: Are you a team of 4 or more people going to the
                  conference? Use this 10% discount on all your Round 1
                  conference tickets: <strong>10pc-4-teams</strong>{' '}
                </h4>
              ) : null}{' '}
              <h3 class="d-none">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSejydjRdhyxE5sbzRqT93aHhx0PosforW88yZdem7HejNl-yA/viewform">
                  Don't miss our tickets release by subscribing here.
                </a>
              </h3>
              <IframeResizer
                log
                src="https://www.react-europe.org?iframe=true"
                style={{
                  width: '1px',
                  minWidth: '100%',
                  border: '0px',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
