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
          <linearGradient id="findtrail-path-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#d58a68" stopOpacity=".2" />
            <stop offset="25%" stopColor="#e8c783" stopOpacity=".76" />
            <stop offset="62%" stopColor="#fff1bd" stopOpacity=".92" />
            <stop offset="100%" stopColor="#fffaf0" stopOpacity=".18" />
          </linearGradient>
          <filter id="findtrail-path-haze" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <filter id="findtrail-path-soft" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <path className="home-artwork__trail-haze" d={trailPath} />
        <path className="home-artwork__trail-thread home-artwork__trail-thread--outer" d={trailPath} />
        <path className="home-artwork__trail-thread home-artwork__trail-thread--core" d={trailPath} />
        <path className="home-artwork__trail-shimmer" pathLength="100" d={trailPath} />

        <g className="home-artwork__wisps">
          <path d="M982 850c-38-24-54-57-39-91 10-23 35-34 52-53" />
          <path d="M1175 565c38-28 57-59 48-91-7-24-30-38-42-59" />
          <path d="M1000 330c-35-13-60-36-62-65-2-23 13-42 28-58" />
        </g>

        <g className="home-artwork__blooms">
          <circle cx="983" cy="855" r="22" />
          <circle cx="1175" cy="564" r="22" />
          <circle cx="989" cy="329" r="22" />
        </g>
      </svg>
    </div>
  )
}
