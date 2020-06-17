import React from 'react'
import Img from 'gatsby-image'
import { useStaticQuery, graphql } from 'gatsby'
import { Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import videoMP4 from './video/paul.mp4'

export default function CollaboratorsSection({ collaborators = [] }) {
  const [show, setShow] = React.useState(false)
  const [collaboratorProps, setCollaboratorProps] = React.useState({
    name: '',
    twitter: '',
    github: '',
    url: '',
    shortBio: '',
    bio: '',
    avatarUrl: '',
    localFile: {
      childImageSharp: {
        fluid: null,
      },
    },
  })

  const data = useStaticQuery(graphql`
    {
      people: file(relativePath: { eq: "people.png" }) {
        childImageSharp {
          fixed(width: 80, height: 80) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }

      head2: file(relativePath: { eq: "head-2.png" }) {
        childImageSharp {
          fixed(width: 80, height: 80) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      collaborator_placeholder: file(relativePath: { eq: "you-round.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      pt: file(relativePath: { eq: "pt.png" }) {
        childImageSharp {
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      pi: file(relativePath: { eq: "pi.png" }) {
        childImageSharp {
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      pl: file(relativePath: { eq: "pl.png" }) {
        childImageSharp {
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  return (
    <section class="people-behind" id="people-behind">
      <div class="container">
        <div class="headings">
          <Img fixed={data.people.childImageSharp.fixed} />
          <h2>People Behind ReactEurope</h2>
        </div>
        <div class="speaker_profile">
          <div class="row">
            {collaborators.map((collaborator, index) => {
              return (
                <div class="col-md-3 col-sm-4 col-xs-12" key={index}>
                  <div
                    class={`speaker_box ${
                      index % 2 == 0 ? 'left_box' : 'right_box'
                    }`}
                  >
                    <div class="profile_image">
                      <Img
                        fluid={collaborator.localFile.childImageSharp.fluid}
                      />
                    </div>
                    <div
                      class="profile_content"
                      style={{ background: 'white' }}
                    >
                      <h3 class="speaker-name">
                        {collaborator.firstName} {collaborator.lastName}
                      </h3>
                      <span>{collaborator.role}</span>
                      <ul>
                        <li>
                          <a
                            href={`https://twitter.com/${collaborator.twitter}`}
                            class="icon-social-button"
                          >
                            <i class="fa fa-twitter icon-twitter"></i>
                            <span />
                          </a>
                        </li>
                        <li>
                          <a
                            href={`https://github.com/${collaborator.github}`}
                            class="icon-social-button"
                          >
                            <i class="fa fa-github icon-github"></i>
                            <span />
                          </a>
                        </li>
                        {collaborator.url ? (
                          <li>
                            <a
                              href={collaborator.url}
                              class="icon-social-button"
                            >
                              <i class="fa fa-link icon-link"></i>
                            </a>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div class="get_your_ticket">
            <a href="#tickets">Get Your Ticket</a>
          </div>
        </div>
      </div>
    </section>
  )
}
