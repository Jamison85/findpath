const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

// Three deliberate legs. Each one ends on an exact checkpoint instead of relying on
// percentage positions along one oversized path.
const phoneToRemote = 'M735 742C650 770 555 792 470 830C610 872 790 800 920 666C965 620 996 580 1018 548'
const remoteToKitchen = 'M1018 548C1096 558 1188 608 1270 650'
const kitchenToKeys = 'M1270 650C1236 536 1196 424 1152 344C1124 294 1094 260 1068 242'

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

        <path className="home-artwork__search-guide" d={phoneToRemote} />
        <path className="home-artwork__search-guide" d={remoteToKitchen} />
        <path className="home-artwork__search-guide" d={kitchenToKeys} />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--remote" cx="1018" cy="548" r="38" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--remote" cx="1018" cy="548" r="8.5" />

        <circle className="home-artwork__miss-pulse home-artwork__miss-pulse--kitchen" cx="1270" cy="650" r="38" />
        <circle className="home-artwork__miss-core home-artwork__miss-core--kitchen" cx="1270" cy="650" r="8.5" />

        <circle className="home-artwork__found-pulse" cx="1068" cy="242" r="44" />
        <circle className="home-artwork__found-core" cx="1068" cy="242" r="9" />

        <g className="home-artwork__search-orb" transform="translate(735 742)">
          <circle className="home-artwork__orb-haze" r="46" />
          <circle className="home-artwork__orb-shell" r="18" />
          <circle className="home-artwork__orb-core" r="7.5" />
          <animateMotion begin="2s" dur="2.6s" fill="freeze" path={phoneToRemote} calcMode="spline" keyTimes="0;1" keySplines=".22 .72 .22 1" />
          <animateMotion begin="5.5s" dur="1.5s" fill="freeze" path={remoteToKitchen} calcMode="spline" keyTimes="0;1" keySplines=".22 .72 .22 1" />
          <animateMotion begin="7.8s" dur="2s" fill="freeze" path={kitchenToKeys} calcMode="spline" keyTimes="0;1" keySplines=".22 .72 .22 1" />
        </g>
      </svg>
    </div>
  )
}
