const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

const searchPath = 'M650 760C760 742 915 728 1070 748C1170 760 1260 774 1320 748C1280 650 1210 560 1178 478C1146 396 1138 336 1046 298'

export function HomeArtwork() {
  return (
    <div className="home-artwork" role="img" aria-label="A guided search checks likely places and finds the missing keys">
      <img
        src={artworkUrl}
        alt=""
        width="1536"
        height="1024"
        fetchPriority="high"
        draggable="false"
      />
      <svg className="home-artwork__trail" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="findtrail-orb-haze" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="findtrail-orb-soft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <path className="home-artwork__search-guide" d={searchPath} pathLength="100" />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--bed" cx="650" cy="760" r="27" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--bed" cx="650" cy="760" r="6" />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--kitchen" cx="1320" cy="748" r="27" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--kitchen" cx="1320" cy="748" r="6" />

        <circle className="home-artwork__found-pulse" cx="1046" cy="298" r="31" />
        <circle className="home-artwork__found-core" cx="1046" cy="298" r="6.5" />

        <g className="home-artwork__search-orb">
          <circle className="home-artwork__orb-haze" r="30" />
          <circle className="home-artwork__orb-shell" r="11" />
          <circle className="home-artwork__orb-core" r="4.8" />
          <animateMotion
            dur="8.8s"
            begin="0.35s"
            fill="freeze"
            path={searchPath}
            keyPoints="0;0;0.58;0.58;1;1"
            keyTimes="0;0.22;0.47;0.59;0.86;1"
            calcMode="linear"
          />
        </g>
      </svg>
    </div>
  )
}
