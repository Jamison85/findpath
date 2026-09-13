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
        <path d="M1008 1080C894 938 858 818 952 710c94-108 250-124 250-242 0-101-196-112-285-190-54-47-42-110 33-184" />
      </svg>
    </div>
  )
}
