import React from 'react'
import videoMP4 from './videos/video.mp4'
import videoWebm from './videos/video.webm'
import { useStaticQuery, graphql } from 'gatsby'
import './hero.css'

const titles = [
  '+30 talks, 12 lightning talks, a 2nd discovery track on day 2',
  'in the Beautiful city of Paris',
  'With delicious French food',
  'More than 8 Workshops!',
  'Hackathons to discover new tech and people ',
  'Bar night to socialize pre-conference',
]

const bgs = ['#2675abff', '#f08323', '#86d0f5', '#3b692b', '#76a031', '#b7191c']

export default function Hero({ banner }) {
  const videoRef = React.useRef(null)
  const canvasRef = React.useRef(null)
  const vWidth = React.useRef(0)
  const vHeight = React.useRef(0)
  const requestId = React.useRef(null)

  const [idx, setIdx] = React.useState(0)
  const data = useStaticQuery(graphql`
    {
      videoPoster: file(relativePath: { eq: "video-poster.png" }) {
        childImageSharp {
          fixed(width: 600) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  // === active title change

  function updater(event) {
    let activeTitle = idx
    const time = event.target.currentTime

    if (time > 2.15 && time < 5.16667) {
      activeTitle = 1
    } else if (time > 5.16667 && time < 8.133333) {
      activeTitle = 2
    } else if (time > 8.133333 && time < 11.1) {
      activeTitle = 3
    } else if (time > 11.1 && time < 14.116666) {
      activeTitle = 4
    } else if (time > 14.116666 && time < 17.1) {
      activeTitle = 5
    }

    setIdx(activeTitle)
  }

  /* React.useEffect(() => {
    function fixAutoplay() {
      const v = videoRef.current
      if (v.paused) {
        v.play()
      }

      document.removeEventListener('touchstart', fixAutoplay)
      document.removeEventListener('touchend', fixAutoplay)
      document.removeEventListener('scroll', fixAutoplay)
    }

    document.addEventListener('touchstart', fixAutoplay)
    document.addEventListener('touchend', fixAutoplay)
    document.addEventListener('scroll', fixAutoplay)

    return () => {
      document.removeEventListener('touchstart', fixAutoplay)
      document.removeEventListener('touchend', fixAutoplay)
      document.removeEventListener('scroll', fixAutoplay)
    }
  }, [])

 React.useEffect(() => {
    const v = videoRef.current
    if (v) {
      v.muted = true
      v.play()
      setVideoBgColor()
      drawingLoop()
      v.addEventListener('loadedmetadata', () => {
        console.log('loaded meta data')
        drawingLoop()
      })
      v.addEventListener('loadeddata', setVideoBgColor)
      v.addEventListener('timeupdate', updater)
    }
    return () => {
      if (onMetadata) {
        v.removeEventListener('timeupdate', onMetadata)
      }
      v.removeEventListener('loadeddata', setVideoBgColor)
    }
  }, [videoRef])
*/

  // === BG changer

  function setVideoBgColor() {
    var canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = 8

    var ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, 8, 8)

    var p = ctx.getImageData(0, 0, 8, 8).data
  }

  function drawingLoop() {
    requestId.current = window.requestAnimationFrame(drawingLoop)
    const v = videoRef.current
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    if (v) {
      ctx.drawImage(
        v,
        0,
        0,
        v.videoWidth,
        v.videoHeight,
        0,
        0,
        cv.width,
        cv.height
      )
    }
  }

  const video = videoRef.current || { offsetHeight: 0, offsetWidth: 0 }
  const { offsetHeight = 0, offsetWidth = 0 } = video
  return (
    <div className="hero__container" style={{ backgroundColor: bgs[idx] }}>
      <div className="container-fluid">
        <div className="row d-sm-flex">
          <div className="col-md-10 hero__content">
            <div className="react_text">
              <h2>The Original React Conference in Europe</h2>
              <h1>ReactEurope</h1>
              <div className="react_text_content" style={{ color: '#FFF' }}>
                <iframe
                  width="100%"
                  class="ytiframe"
                  src="https://www.youtube.com/embed/videoseries?list=PLCC436JpVnK0Q4WHoB85ZYBwcCyTaMgAl&index=0"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
                <h3>
                  <br />
                  We still plan to run all our workshops online. As for the
                  conference, we will be running it online with access to
                  speakers who have gracefully accepted to be part of the
                  stream, make sure{' '}
                  <a
                    href="https://youtu.be/vULQgfiQvrw"
                    target="_blank"
                    style={{ color: '#FFF', textDecoration: 'underline' }}
                  >
                    to subscribe here to the stream open to all 🌎 🎥
                  </a>
                </h3>
                <h3>
                  May 14-15th, 2020 <span>(online conference)</span>
                </h3>
                <h3>
                  May 12-13th-16th, 2020 <span>(online workshops)</span>
                </h3>
                <h3>
                  2021 <span>(next year's conference edition)</span>
                </h3>
                <h4>Paris, France</h4>
              </div>
            </div>
            <div className="react_btns">
              <a href="#conference" className="learn_more">
                Learn More
              </a>
              <a
                href="https://learn.react-europe.org/"
                target="_blank"
                className="learn_more"
                style={{ width: '700px', marginLeft: '25px' }}
              >
                Learn from our previous workshops
              </a>
              <a href="#tickets" className="book_now">
                Tickets
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
