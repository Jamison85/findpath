export function Scenery({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? 'scenery scenery--compact' : 'scenery'} viewBox="0 0 640 300" role="img" aria-label="A winding trail through layered Ozark hills">
      <defs>
        <linearGradient id="ftSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8e9d7" />
          <stop offset="1" stopColor="#dce9e1" />
        </linearGradient>
        <linearGradient id="ftNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#668679" />
          <stop offset="1" stopColor="#23463e" />
        </linearGradient>
      </defs>
      <rect width="640" height="300" rx="36" fill="url(#ftSky)" />
      <circle cx="486" cy="72" r="35" fill="#e98a66" opacity=".86" />
      <path d="M0 145c76-52 142-38 207 3 55 34 111 28 173-12 76-49 169-45 260 18v146H0Z" fill="#b8cdc0" />
      <path d="M0 190c98-62 181-42 250 4 68 45 133 39 212-7 59-35 118-31 178 5v108H0Z" fill="url(#ftNear)" />
      <path d="M263 300c38-55 96-72 93-111-2-28-42-33-33-60 8-25 71-38 119-63-30 29-71 49-77 72-7 28 44 36 44 70 0 37-53 52-82 92Z" fill="#f8f1e7" opacity=".96" />
      <g fill="#173a34">
        <path d="m72 211 22-55 22 55h-14l19 39H67l19-39Z" />
        <path d="m534 199 26-67 27 67h-17l22 46h-64l22-46Z" opacity=".88" />
        <path d="m580 221 17-43 17 43h-11l15 31h-42l14-31Z" opacity=".68" />
      </g>
      <path d="M24 45c74 17 129 10 189-11M35 69c78 19 139 12 200-10" fill="none" stroke="#896578" strokeWidth="2" opacity=".22" />
    </svg>
  )
}
