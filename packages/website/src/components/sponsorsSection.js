import React from 'react'
import { Modal } from 'react-bootstrap'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Sponsor from 'components/sponsor'
export default function SponsorsSection({ sponsors }) {
  const [showSponsor, setShowSponsor] = React.useState(false)
  const [currentSponsor, setCurrentSponsor] = React.useState({
    name: 'url',
    url: '',
    logoUrl: '',
    jobUrl: '',
    description: '',
    level: '',
    localFile: { childImageSharp: { fluid: {} } },
  })

  //TODO: move to modal sponsor
  const handleShowSponsor = (s, e) => {
    setShowSponsor(true)
    setCurrentSponsor(s)
    e.preventDefault()
    return false
  }
  const imgs = useStaticQuery(graphql`
    {
      sponser: file(relativePath: { eq: "sponser.png" }) {
        childImageSharp {
          fixed(width: 80, height: 80) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      amplify: file(relativePath: { eq: "gold1.png" }) {
        childImageSharp {
          fluid(maxWidth: 170) {
            ...GatsbyImageSharpFluid_withWebp
          }
          fixed(width: 200) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)
  return (
    <>
      <span id="sprs"></span>
      <section class="sponser" id="sponser">
        <div class="container">
          <div class="headings">
            <Img fixed={imgs.sponser.childImageSharp.fixed} />
            <h2>Our Sponsors</h2>
            <p>
              <a
                href="mailto:reacteurope@eventlama.com?subject=sponsoring react-europe 2020"
                class="spr-link"
                target="_blank"
              >
                <i class="fa fa-envelope"></i>&nbsp;Want to get involved and
                help support ReactEurope? We'd love to hear from you.
              </a>
            </p>
          </div>
          <Modal
            show={showSponsor}
            onHide={() => setShowSponsor(false)}
            id="sponser_popup"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    onClick={() => setShowSponsor(false)}
                  >
                    &times;
                  </button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-md-3">
                      <div class="sponser_popup_left">
                        <Img
                          className="no-animation"
                          fluid={currentSponsor.localFile.childImageSharp.fluid}
                          key={currentSponsor.id}
                        />
                        <div class="sponser_popup_link">
                          <a href={currentSponsor.url}>Website</a>
                          <a href={currentSponsor.jobUrl}>Work with us</a>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-9">
                      <div class="sponser_popup_right">
                        <h3>{currentSponsor.name}</h3>
                        <p>{currentSponsor.description}</p>
                      </div>
                    </div>
                    <div class="vertical_text">
                      <h3>{currentSponsor.level}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          {/* <div class="platinium_box d-none">
            <div class="row">
              <div class="col-md-6">
                <div class="spnser_box">
                  <div class="sponser_image">
                    <img
                      loading="lazy"
                      class="normal_image"
                      src="images/dazn.png"
                      alt=""
                    />
                    <img
                      class="hover_img"
                      src="images/sponser-hover.png"
                      alt=""
                    />
                  </div>
                  <div class="work_withweb">
                    <a href="#">Website</a>
                    <a href="#">Work with us</a>
                  </div>
                  <a
                    href="#"
                    class="read_more"
                    data-toggle="modal"
                    data-target="#sponser_popup"
                  >
                    Read More
                  </a>
                  <div class="mobile_icons">
                    <ul>
                      <li>
                        <a href="#">
                          <i class="fa fa-link" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-handshake-o" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#sponser_popup"
                        >
                          <i
                            class="fa fa-long-arrow-right"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="spnser_box">
                  <div class="sponser_image">
                    <img
                      loading="lazy"
                      class="normal_image"
                      src="images/ekino.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      class="hover_img"
                      src="images/ekino.png"
                      alt=""
                    />
                  </div>
                  <div class="work_withweb">
                    <a href="#">Website</a>
                    <a href="#">Work with us</a>
                  </div>
                  <a href="#" class="read_more">
                    Read More
                  </a>
                  <div class="mobile_icons">
                    <ul>
                      <li>
                        <a href="#">
                          <i class="fa fa-link" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-handshake-o" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#sponser_popup"
                        >
                          <i
                            class="fa fa-long-arrow-right"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="vertical_text">
                <h3>PLATINUM</h3>
              </div>
            </div>
          </div> */}
          <div class="platinium_box gold_box">
            <div class="row">
              {sponsors.gold.map(sponsor =>
                sponsor.name !== '' ? (
                  <div class="col-md-4" key={sponsor.id}>
                    <Sponsor
                      imgs={imgs}
                      sponsor={sponsor}
                      handleShowSponsor={handleShowSponsor}
                      key={sponsor.id}
                    />
                  </div>
                ) : null
              )}
              <p className="d-none">
                <a
                  href="mailto:reacteurope@eventlama.com?subject=sponsoring react-europe 2020"
                  class="spr-link"
                  target="_blank"
                >
                  <i class="fa fa-envelope"></i>&nbsp; If you would like to
                  sponsor us, we'd love to hear from you.
                </a>
              </p>
              <div class="vertical_text gold">
                <h3>GOLD</h3>
              </div>
            </div>
          </div>
          <div class="platinium_box gold_box">
            <div class="row">
              {sponsors.silver.map(sponsor =>
                sponsor.name !== '' ? (
                  <div class="col-md-4" key={sponsor.id}>
                    <Sponsor
                      key={sponsor.id}
                      imgs={imgs}
                      sponsor={sponsor}
                      handleShowSponsor={handleShowSponsor}
                    />
                  </div>
                ) : null
              )}
              <p className="d-none">
                <a
                  href="mailto:reacteurope@eventlama.com?subject=sponsoring react-europe 2020"
                  class="spr-link"
                  target="_blank"
                >
                  <i class="fa fa-envelope"></i>&nbsp; If you would like to
                  sponsor us, we'd love to hear from you.
                </a>
              </p>
              <div class="vertical_text brunse">
                <h3>SILVER</h3>
              </div>
            </div>
          </div>{' '}
          {/* <div class="platinium_box gold_box brunse_box d-none">
            <div class="row">
              <div class="col-md-4">
                <div class="spnser_box">
                  <div class="sponser_image">
                    <img
                      loading="lazy"
                      class="normal_image"
                      src="images/brunse1.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      class="hover_img"
                      src="images/brunse1.png"
                      alt=""
                    />
                  </div>
                  <div class="work_withweb">
                    <a href="https://aws-amplify.github.io/?utm_source=reacteurope&utm_medium=banner&utm_campaign=reacteurope-sponsor-banner">
                      Website
                    </a>
                    <a href="https://www.amazon.jobs/en/business_categories/amazon-web-services?utm_source=reacteurope&utm_medium=banner&utm_campaign=reacteurope-sponsor-banner">
                      Work with us
                    </a>
                  </div>
                  <a href="#" class="read_more d-none">
                    Read More
                  </a>
                  <div class="mobile_icons">
                    <ul>
                      <li>
                        <a href="https://aws-amplify.github.io/?utm_source=reacteurope&utm_medium=banner&utm_campaign=reacteurope-sponsor-banner">
                          <i class="fa fa-link" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.amazon.jobs/en/business_categories/amazon-web-services?utm_source=reacteurope&utm_medium=banner&utm_campaign=reacteurope-sponsor-banner">
                          <i class="fa fa-handshake-o" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li class="d-none">
                        <a href="#">
                          <i
                            class="fa fa-long-arrow-right"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="spnser_box">
                  <div class="sponser_image">
                    <img
                      loading="lazy"
                      class="normal_image"
                      src="images/brunse2.png"
                      alt=""
                    />
                    <img
                      loading="lazy"
                      class="hover_img"
                      src="images/brunse2.png"
                      alt=""
                    />
                  </div>
                  <div class="work_withweb">
                    <a href="#">Website</a>
                    <a href="#">Work with us</a>
                  </div>
                  <a href="#" class="read_more">
                    Read More
                  </a>
                  <div class="mobile_icons">
                    <ul>
                      <li>
                        <a href="#">
                          <i class="fa fa-link" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-handshake-o" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            class="fa fa-long-arrow-right"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="vertical_text gold">
                <h3>BRUNSE</h3>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </>
  )
}
