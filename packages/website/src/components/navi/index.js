import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

export default function Navi() {
  const imgs = useStaticQuery(graphql`
    {
      logo: file(relativePath: { eq: "Logo.png" }) {
        childImageSharp {
          fixed(height: 60) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      logo_icon: file(relativePath: { eq: "logo_icon.png" }) {
        childImageSharp {
          fixed(width: 46, height: 46) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      pin: file(relativePath: { eq: "pin.png" }) {
        childImageSharp {
          fixed(width: 14, height: 14) {
            base64
          }
        }
      }
    }
  `)
  return (
    <>
      <header className="desktop_header">
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <a className="navbar-brand" href="#">
              <Img
                className="no-animation"
                style={{ verticalAlign: 'middle' }}
                fixed={imgs.logo.childImageSharp.fixed}
              />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="nav_icon"></span>
              <span className="nav_icon"></span>
              <span className="nav_icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#speakers"
                    id="speaker-top-title"
                  >
                    Speakers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#schedule">
                    Schedule
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#tickets">
                    Tickets
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#sprs">
                    Sponsors
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#location">
                    Location
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="https://jobs.react-europe.org"
                    target="_blank"
                  >
                    Jobs
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="https://learn.react-europe.org"
                    target="_blank"
                  >
                    Learn
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <header className="Mobile_header">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-2">
              <div className="logo">
                <a href="#">
                  <Img
                    className="no-animation"
                    style={{ verticalAlign: 'middle' }}
                    fixed={imgs.logo_icon.childImageSharp.fixed}
                  />
                </a>
              </div>
            </div>
            <div className="col-md-9 col-sm-10">
              <div className="navigation">
                <ul>
                  <li>
                    <a href="#speakers">speakers</a>
                  </li>
                  <li>
                    <a href="#schedule">schedule</a>
                  </li>
                  <li>
                    <a href="#tickets">tickets</a>
                  </li>
                  <li>
                    <a href="#location">
                      <img
                        src={imgs.pin.childImageSharp.fixed.base64}
                        alt="location pin image"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#subscribe">contact</a>
                  </li>
                  <li>
                    <a href="https://jobs.react-europe.org" target="_blank">
                      jobs
                    </a>
                  </li>
                  <li>
                    <a href="https://learn.react-europe.org" target="_blank">
                      learn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
