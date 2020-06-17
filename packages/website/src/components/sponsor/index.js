import React from 'react'
import Img from 'gatsby-image'

export default function Sponsor({ handleShowSponsor, sponsor }) {
  return (
    <>
      <div class="spnser_box">
        <div class="sponser_image">
          {sponsor && sponsor.localFile ? (
            <Img
              fixed={sponsor.localFile.childImageSharp.fixed}
              style={
                sponsor.name === 'DAZN' || sponsor.name === 'Hiway'
                  ? {
                      width: 80,
                      height: 80,
                    }
                  : {}
              }
            />
          ) : null}
        </div>
        <div class="work_withweb">
          <a href={sponsor.url}>Website</a>
          <a href={sponsor.jobUrl}>Work with us</a>
        </div>
        <a
          onClick={e => {
            handleShowSponsor(sponsor, e)
          }}
          class="read_more"
        >
          Read More
        </a>
        <div class="mobile_icons">
          <ul>
            <li>
              <a href={sponsor.url}>
                <i class="fa fa-link" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href={sponsor.jobUrl}>
                <i class="fa fa-handshake-o" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a
                data-toggle="modal"
                data-target="#sponser_popup"
                onClick={e => {
                  handleShowSponsor(sponsor, e)
                }}
              >
                <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
