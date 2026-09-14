import { useEffect, useState } from 'react'

const artworkUrl = `${import.meta.env.BASE_URL}home-memory-trail.webp`

const HOME_TRAIL_PLAYED_KEY = 'findtrail:home-trail-played'

// The guide follows three deliberate legs in the artwork: phone to remote,
// remote to kitchen counter, and counter to the keys by the door.
const trailPath = [
  'M548 888',
  'C575 820 650 790 720 720C805 635 890 520 965 416',
  'C1080 430 1248 452 1384 476',
  'C1298 430 1218 370 1152 344C1124 294 1094 260 1068 242',
].join('')

function hasPlayedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(HOME_TRAIL_PLAYED_KEY) === 'true'
  } catch {
    return false
  }
}

export function HomeArtwork() {
  const [playTrail] = useState(() => !hasPlayedThisSession())

  useEffect(() => {
    if (!playTrail) return
    try {
      window.sessionStorage.setItem(HOME_TRAIL_PLAYED_KEY, 'true')
    } catch {
      // The one-time motion still works when storage is unavailable.
    }
  }, [playTrail])

  return (
    <div className="home-artwork" role="img" aria-label="A calm guide retraces a path from the phone to the remote, kitchen, and missing keys">
      <img
        src={artworkUrl}
        alt=""
        width="1536"
        height="1024"
        fetchPriority="high"
        draggable="false"
      />
      <svg className={`home-artwork__trail ${playTrail ? 'is-playing' : 'is-settled'}`} viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="findtrail-orb-haze" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <g className="home-artwork__search-orb">
          <circle className="home-artwork__orb-haze" r="40" />
          <circle className="home-artwork__orb-shell" r="16" />
          <circle className="home-artwork__orb-core" r="6.5" />
          <animateMotion
            begin=".3s"
            dur="6.2s"
            fill="freeze"
            path={trailPath}
            calcMode="spline"
            keyPoints="0;0;.42;.42;.72;.72;1;1"
            keyTimes="0;.08;.42;.49;.67;.74;.96;1"
            keySplines=".22 .7 .22 1;.22 .7 .22 1;.22 .7 .22 1;.22 .7 .22 1;.22 .7 .22 1;.22 .7 .22 1;.22 .7 .22 1"
          />
        </g>
      </svg>
    </div>
  )
}
