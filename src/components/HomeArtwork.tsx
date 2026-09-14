const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

// Search stops are anchored to the visible tabletop surfaces in the Home artwork:
// right of the glasses on the bedside table -> kitchen counter by the stool -> keys on the entry table.
const searchPath = 'M735 742C820 724 960 686 1110 668C1184 660 1240 658 1270 650C1240 560 1188 460 1150 368C1126 310 1104 266 1068 242'

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
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="findtrail-orb-soft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <path className="home-artwork__search-guide" d={searchPath} pathLength="100" />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--bed" cx="735" cy="742" r="38" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--bed" cx="735" cy="742" r="8.5" />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--kitchen" cx="1270" cy="650" r="38" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--kitchen" cx="1270" cy="650" r="8.5" />

        <circle className="home-artwork__found-pulse" cx="1068" cy="242" r="44" />
        <circle className="home-artwork__found-core" cx="1068" cy="242" r="9" />

        <g className="home-artwork__search-orb">
          <circle className="home-artwork__orb-haze" r="46" />
          <circle className="home-artwork__orb-shell" r="18" />
          <circle className="home-artwork__orb-core" r="7.5" />
          <animateMotion
            dur="8.8s"
            begin="0.35s"
            fill="freeze"
            path={searchPath}
            keyPoints="0;0;0.61;0.61;1;1"
            keyTimes="0;0.22;0.47;0.59;0.86;1"
            calcMode="linear"
          />
        </g>
      </svg>
    </div>
  )
}
