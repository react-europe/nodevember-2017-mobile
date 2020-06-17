import React from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image/withIEPolyfill'
import './index.css'

function Caroussel() {
  const data = useStaticQuery(query)

  const [show, setShow] = useState(false)
  const [eventProps, setEventProps] = useState({
    title: '',
    date: '',
    description: '',
    hours: '',
    pictures: [],
  })
  const handleClose = () => setShow(false)
  const handleShow = event => {
    setShow(true)
    setEventProps(event)
  }
  return (
    <div class="conference_slider">
      <Modal show={show} onHide={handleClose} id="event_popup">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                onClick={handleClose}
                type="button"
                class="close"
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-5">
                  <div class="event_popup_content">
                    <h3 id="event-date-popup">{eventProps.date}</h3>
                    <h4>MAY</h4>
                    <h5 id="event-title-popup">{eventProps.title}</h5>
                    <h6>
                      {' '}
                      <span id="event-hours-popup">{eventProps.hours}</span>
                    </h6>
                    <p id="event-description-popup">{eventProps.description}</p>
                  </div>
                </div>
                <div class="col-md-7">
                  <div class="event_popup_images">
                    <ul>
                      <li>
                        <Img
                          objectFit="cover"
                          objectPosition="50% 50%"
                          fluid={eventProps.pictures[0]}
                        />
                      </li>
                      <li>
                        <Img
                          objectFit="cover"
                          objectPosition="50% 50%"
                          fluid={eventProps.pictures[1]}
                        />
                      </li>
                      <li>
                        <Img
                          objectFit="cover"
                          objectPosition="50% 50%"
                          fluid={eventProps.pictures[2]}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div className="caroussel" style={{ height: '100%' }}>
        <div className="horizontal-carousel">
          <div
            className="App-slide"
            style={{
              marginBottom: 45,
              marginRight: 25,
            }}
            onClick={() => {
              handleShow({
                pictures: [
                  data.workshop1.childImageSharp.fluid,
                  data.event_popup_2.childImageSharp.fluid,
                  data.event_popup_3.childImageSharp.fluid,
                ],
                date: '12th-13th',
                description:
                  '2 days to learn from the best ranging from topics such as React.js, SSR, hooks, suspense, graphql, TypeScript, React Native, Animations, next.js amplify and more!',
                title: '2-DAY WORKSHOPS',
                hours: '8:45am to 5:30pm',
              })
            }}
          >
            <div class="slider_box">
              <h3>12th-13th</h3>
              <h4>MAY</h4>
              <Img
                objectFit="contain"
                objectPosition="50% 50%"
                fixed={data.slide1.childImageSharp.fixed}
              />
              <h5>2-DAY WORKSHOPS</h5>
              <h6>Palace of Paris-Est Congress</h6>
              <p>8:45am to 5:30pm</p>
            </div>
          </div>
          <div
            key={1}
            className="App-slide"
            style={{ marginBottom: '45px', marginRight: '25px' }}
            onClick={() => {
              handleShow({
                pictures: [
                  data.bar1.childImageSharp.fluid,
                  data.bar2.childImageSharp.fluid,
                  data.bar3.childImageSharp.fluid,
                ],
                date: '13th',
                description:
                  'A great occasion for people to meet, socialize and get to know each other before the conference. It will offer both alcoholic and non alcoholic drinks as well as food. The party will start at 18:45 Paris time just after our workshops. Location to be announced soon.',
                title: 'BAR NIGHT',
                hours: '6:45pm',
              })
            }}
          >
            <div class="slider_box">
              <h3>13th</h3>
              <h4>MAY</h4>
              <Img
                objectFit="contain"
                objectPosition="50% 50%"
                fixed={data.slide2.childImageSharp.fixed}
              />
              <h5>BAR NIGHT</h5>
              <h6 class="">More details coming soon. Stay tuned.</h6>
              <p>6:45pm</p>
            </div>
          </div>
          <div
            key={2}
            className="App-slide"
            style={{ marginBottom: '45px', marginRight: '25px' }}
            onClick={() => {
              handleShow({
                pictures: [
                  data.event_popup_1.childImageSharp.fluid,
                  data.conf2.childImageSharp.fluid,
                  data.conf3.childImageSharp.fluid,
                ],
                date: '14th-15th',
                description:
                  'At this conference, you will learn how new projects such as ReasonML will bring web and mobile React Native apps to the next level and how projects such as React Native Web, React Primitive and Expo make it easy to write, deploy and share code on all platforms quickly. The conference aims to give talks that inspire and explore new futuristic ideas dealing with all the techs we enjoy from the React ecosystem such as React.js, React Native, GraphQL, Relay, Universal apps, ReasonML, Webpack, inline CSS and more.',
                title: '2-DAY CONFERENCE',
                hours: '8:30am to 7:00pm',
              })
            }}
          >
            <div class="slider_box">
              <h3>14th-15th</h3>
              <h4>MAY</h4>
              <Img
                objectFit="contain"
                objectPosition="50% 50%"
                fixed={data.slide3.childImageSharp.fixed}
              />
              <h5>2-DAY CONFERENCE</h5>
              <h6>Palace of Paris-Est Congress</h6>
              <p> 8:30am to 7:00pm</p>
            </div>
          </div>
          <div
            key={3}
            className="App-slide"
            style={{ marginBottom: '45px', marginRight: '25px' }}
            onClick={() => {
              handleShow({
                pictures: [
                  data.food1.childImageSharp.fluid,
                  data.food2.childImageSharp.fluid,
                  data.food3.childImageSharp.fluid,
                ],
                date: '12th-15th',
                description:
                  'During the whole week you will be enjoying quality buffets of delicious French food and more. Our French breakfasts include croissants but also scrambled eggs with bacon, fruits, cheese, yogurt and more. Our lunches include delicious French quiches, salades, smoked salmons, French cheese selection, charcuterie, sandwiches, mini-burgers with meat or veggies, sushi, belgium-style waffles, crepes, macarons, French pasteries and more. We also offer vegan and gluten free options! We also have a dinner on the 14th and a drinkup on the 15th. Last but not least, water and coffee will be flowing all day long. French wine and beer will also be available.',
                title: 'Delicious food',
                hours: 'all workshops and conf days',
              })
            }}
          >
            <div class="slider_box">
              <h3>12th-15th</h3>
              <h4>MAY</h4>
              <Img
                objectFit="contain"
                objectPosition="50% 50%"
                fixed={data.food.childImageSharp.fixed}
              />
              <h5>Delicious food buffets</h5>
              <h6>Palace of Paris-Est Congress</h6>
              <p> During conf &amp; workshops</p>
            </div>
          </div>
          <div
            key={4}
            className="App-slide"
            style={{ marginBottom: '45px', marginRight: '25px' }}
            onClick={() => {
              handleShow({
                pictures: [
                  data.event_popup_1.childImageSharp.fluid,
                  data.conf2.childImageSharp.fluid,
                  data.conf3.childImageSharp.fluid,
                ],
                date: '14th-15th',
                description:
                  'Lightning talks are a great occasion to discover new ideas or projects in a short amount of time. Many of our earlier lightning talks speakers turned into great member of the community including Sunil Pai now part of the React core team or Brandon Dail now on the FE at Facebook.',
                title: 'Lightning talks',
                hours: 'during conference days',
              })
            }}
          >
            <div class="slider_box">
              <h3>14th-15th</h3>
              <h4>MAY</h4>
              <Img
                objectFit="contain"
                objectPosition="50% 50%"
                fixed={data.lightnings.childImageSharp.fixed}
              />
              <h5>Lightning talks</h5>
              <h6>Palace of Paris-Est Congress</h6>
              <p> During conference days</p>
            </div>
          </div>
          <div
            key={5}
            className="App-slide"
            style={{ marginBottom: '45px', marginRight: '25px' }}
            onClick={() => {
              handleShow({
                pictures: [
                  data.workshop1.childImageSharp.fluid,
                  data.event_popup_2.childImageSharp.fluid,
                  data.event_popup_3.childImageSharp.fluid,
                ],
                date: '16th',
                description:
                  '1 day of hackathon fun and workshops to learn from the best ranging from topics such as Relay with concurent mode, porting your React app to TypeScript and more!',
                title: 'Hackathon and Workshops',
                hours: 'on Saturday 16th',
              })
            }}
          >
            <div class="slider_box">
              <h3>16th</h3>
              <h4>MAY</h4>
              <Img
                objectFit="contain"
                objectPosition="50% 50%"
                fixed={data.hackathon.childImageSharp.fixed}
              />
              <h5>Hackathon &amp; Workshops</h5>
              <h6>More details coming soon. Stay tuned.</h6>
              <p> 8:45am to 5:30pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const query = graphql`
  {
    slide1: file(relativePath: { eq: "slider1.png" }) {
      childImageSharp {
        fixed(width: 214) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    slide2: file(relativePath: { eq: "slider2.png" }) {
      childImageSharp {
        fixed(width: 214) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    slide3: file(relativePath: { eq: "slider3.png" }) {
      childImageSharp {
        fixed(width: 214) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    hackathon: file(relativePath: { eq: "hackathon.png" }) {
      childImageSharp {
        fixed(width: 214) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    lightnings: file(relativePath: { eq: "lightnings.png" }) {
      childImageSharp {
        fixed(width: 214) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    food: file(relativePath: { eq: "food.png" }) {
      childImageSharp {
        fixed(width: 214) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    workshop1: file(relativePath: { eq: "workshop1.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    event_popup_2: file(relativePath: { eq: "Event_popup2.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    event_popup_3: file(relativePath: { eq: "Event_popup3.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    bar1: file(relativePath: { eq: "bar1.jpeg" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    bar2: file(relativePath: { eq: "bar2.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    bar3: file(relativePath: { eq: "bar3.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    event_popup_1: file(relativePath: { eq: "Event_popup1.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    conf2: file(relativePath: { eq: "conf2.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    conf3: file(relativePath: { eq: "conf3.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    food1: file(relativePath: { eq: "food1.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    food2: file(relativePath: { eq: "food2.png" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    food3: file(relativePath: { eq: "food3.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 600) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`

export default Caroussel
