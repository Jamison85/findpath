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
          <filter id="findtrail-clue-soft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="findtrail-clue-haze" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
        </defs>

        <g className="home-artwork__clues">
          <g className="home-artwork__clue home-artwork__clue--1" transform="translate(980 846)">
            <circle className="home-artwork__clue-haze" r="34" />
            <path className="home-artwork__clue-streak" d="M-42 17c18-8 27-18 38-34 9-13 18-19 32-25" />
            <circle className="home-artwork__clue-spark" cx="-23" cy="12" r="3.8" />
            <circle className="home-artwork__clue-dust" cx="-39" cy="26" r="2.2" />
            <circle className="home-artwork__clue-dust" cx="8" cy="-25" r="1.8" />
          </g>
          <g className="home-artwork__clue home-artwork__clue--2" transform="translate(1118 676)">
            <circle className="home-artwork__clue-haze" r="29" />
            <path className="home-artwork__clue-streak" d="M-35 19c17-7 26-17 35-30 8-12 18-18 31-21" />
            <circle className="home-artwork__clue-spark" cx="2" cy="-10" r="3.5" />
            <circle className="home-artwork__clue-dust" cx="-28" cy="25" r="1.9" />
          </g>
          <g className="home-artwork__clue home-artwork__clue--3" transform="translate(1188 508)">
            <circle className="home-artwork__clue-haze" r="31" />
            <path className="home-artwork__clue-streak" d="M-31 20c15-9 21-19 27-31 7-14 16-22 29-27" />
            <circle className="home-artwork__clue-spark" cx="-3" cy="-8" r="3.6" />
            <circle className="home-artwork__clue-dust" cx="24" cy="-32" r="2" />
          </g>
          <g className="home-artwork__clue home-artwork__clue--4" transform="translate(1068 394)">
            <circle className="home-artwork__clue-haze" r="27" />
            <path className="home-artwork__clue-streak" d="M-30 17c14-7 21-15 29-27 7-10 15-16 27-20" />
            <circle className="home-artwork__clue-spark" cx="2" cy="-8" r="3.2" />
            <circle className="home-artwork__clue-dust" cx="-22" cy="22" r="1.8" />
          </g>
          <g className="home-artwork__clue home-artwork__clue--5" transform="translate(982 286)">
            <circle className="home-artwork__clue-haze home-artwork__clue-haze--found" r="44" />
            <circle className="home-artwork__clue-found" r="7" />
            <circle className="home-artwork__clue-dust" cx="-25" cy="18" r="2" />
            <circle className="home-artwork__clue-dust" cx="24" cy="-16" r="2.3" />
            <circle className="home-artwork__clue-dust" cx="11" cy="29" r="1.7" />
          </g>
        </g>
      </svg>
    </div>
  )
}
