const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

// Keep the Home story simple: one orb follows the same broad sweep as the illustrated
// trail. Two brief red moments happen along the route; the keys are the green finish.
const trailPath = 'M735 742C680 690 660 610 720 555C790 490 900 485 990 455C1100 418 1240 430 1384 476C1320 430 1235 390 1165 340C1125 310 1095 270 1068 242'

export function HomeArtwork() {
  return (
    <div className="home-artwork" role="img" aria-label="A glowing guide follows the trail, checks twice, then finds the missing keys">
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
        </defs>

        <g className="home-artwork__search-orb">
          <circle className="home-artwork__orb-haze" r="46" />
          <circle className="home-artwork__orb-shell" r="18" />
          <circle className="home-artwork__orb-core" r="7.5" />
          <animateMotion
            begin=".35s"
            dur="8s"
            fill="freeze"
            path={trailPath}
            calcMode="spline"
            keyTimes="0;1"
            keySplines=".25 .1 .25 1"
          />
        </g>
      </svg>
    </div>
  )
}
