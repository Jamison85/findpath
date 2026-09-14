const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

const trailPath = 'M1008 1080C894 938 858 818 952 710c94-108 250-124 250-242 0-101-196-112-285-190-54-47-42-110 33-184'

export function HomeArtwork() {
  return (
    <div className="home-artwork" role="img" aria-label="A memory trail through an entryway, sofa, kitchen counter, and bedside table">
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
          <linearGradient id="findtrail-flow-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#d98b67" />
            <stop offset="46%" stopColor="#e9ca84" />
            <stop offset="100%" stopColor="#fff4c9" />
          </linearGradient>
          <filter id="findtrail-flow-haze" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
          <filter id="findtrail-flow-soft" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <path className="home-artwork__flow-haze" pathLength="100" d={trailPath} />
        <path className="home-artwork__flow-body" pathLength="100" d={trailPath} />
        <path className="home-artwork__flow-core" pathLength="100" d={trailPath} />
        <path className="home-artwork__flow-shimmer" pathLength="100" d={trailPath} />
      </svg>
    </div>
  )
}
