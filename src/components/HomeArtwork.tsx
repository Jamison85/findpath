const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

// One continuous search story: phone/nightstand -> across the bed and behind the chooser card ->
// remote on couch -> kitchen counter -> keys on entry table.
const searchPath = 'M735 742C650 770 520 805 390 858C520 900 760 902 930 790C1000 724 1040 650 1018 548C1100 574 1192 612 1270 650C1240 560 1188 460 1150 368C1126 310 1104 266 1068 242'

export function HomeArtwork() {
  return (
    <div className="home-artwork" role="img" aria-label="A guided search leaves the phone, checks the remote and kitchen, then finds the missing keys">
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

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--remote" cx="1018" cy="548" r="38" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--remote" cx="1018" cy="548" r="8.5" />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--kitchen" cx="1270" cy="650" r="38" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--kitchen" cx="1270" cy="650" r="8.5" />

        <circle className="home-artwork__found-pulse" cx="1068" cy="242" r="44" />
        <circle className="home-artwork__found-core" cx="1068" cy="242" r="9" />

        <g className="home-artwork__search-orb">
          <circle className="home-artwork__orb-haze" r="46" />
          <circle className="home-artwork__orb-shell" r="18" />
          <circle className="home-artwork__orb-core" r="7.5" />
          <animateMotion
            dur="10.8s"
            begin="0.35s"
            fill="freeze"
            path={searchPath}
            keyPoints="0;0;0.48;0.48;0.67;0.67;0.78;0.78;1;1"
            keyTimes="0;0.18;0.43;0.51;0.59;0.66;0.72;0.79;0.93;1"
            calcMode="linear"
          />
        </g>
      </svg>
    </div>
  )
}
