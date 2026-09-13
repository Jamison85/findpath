const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

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
            <stop offset="0%" stopColor="#bd6245" />
            <stop offset="48%" stopColor="#e8c783" />
            <stop offset="100%" stopColor="#fff4cf" />
          </linearGradient>
          <filter id="findtrail-path-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          className="home-artwork__trail-shadow"
          d="M1008 1080C894 938 858 818 952 710c94-108 250-124 250-242 0-101-196-112-285-190-54-47-42-110 33-184"
        />
        <path
          className="home-artwork__trail-base"
          d="M1008 1080C894 938 858 818 952 710c94-108 250-124 250-242 0-101-196-112-285-190-54-47-42-110 33-184"
        />
        <path
          className="home-artwork__trail-glow"
          pathLength="100"
          d="M1008 1080C894 938 858 818 952 710c94-108 250-124 250-242 0-101-196-112-285-190-54-47-42-110 33-184"
        />

        <g className="home-artwork__waypoints">
          <circle cx="983" cy="855" r="17" />
          <circle cx="1175" cy="564" r="17" />
          <circle cx="989" cy="329" r="17" />
        </g>
      </svg>
    </div>
  )
}
