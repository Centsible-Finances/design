// logo-marks.jsx — Centsible logo exploration
// All original concepts, no brand recreation.
// Palette: sage #A8C79C / #7FA56E, oatmeal #FBF4EC / #F3E9DB,
// ink #3A2E26, coral #F4C7A8, lavender #CBBFE3.

const LC = {
  sage: '#A8C79C',
  sageDeep: '#7FA56E',
  sageDark: '#5C8550',
  oat: '#FBF4EC',
  oatDeep: '#F3E9DB',
  cream: '#FFFBF5',
  ink: '#3A2E26',
  inkSoft: '#7A6A5F',
  coral: '#F4C7A8',
  coralDeep: '#E09978',
  lavender: '#CBBFE3',
  lavenderDeep: '#9F8FC9',
};

// ─────────────────────────────────────────────
// 01 — SPROUT COIN
// A soft rounded coin with a tiny sprout growing from the top.
// Says: savings that grow. Gentle, not clip-arty.
// ─────────────────────────────────────────────
function MarkSproutCoin({ size = 160, bg = LC.sage, leaf = LC.sageDark, stem = LC.sageDark, coinTone = LC.oatDeep, inner = LC.cream }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      {/* bg squircle */}
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* coin body */}
      <circle cx="80" cy="92" r="42" fill={coinTone} />
      <circle cx="80" cy="92" r="42" fill="none" stroke={LC.ink} strokeOpacity="0.08" strokeWidth="1.5" />
      {/* coin inner ring — no $ glyph, just a soft arc to feel coin-like */}
      <circle cx="80" cy="92" r="30" fill="none" stroke={LC.ink} strokeOpacity="0.14" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
      {/* tiny c/cent mark on coin — just a bracket */}
      <path d="M 85 82 Q 74 82 74 92 Q 74 102 85 102" fill="none" stroke={LC.ink} strokeOpacity="0.5" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="78" y1="78" x2="78" y2="106" stroke={LC.ink} strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
      {/* stem */}
      <path d="M 80 58 Q 80 48 80 42" fill="none" stroke={stem} strokeWidth="4" strokeLinecap="round" />
      {/* leaf left */}
      <path d="M 80 50 Q 68 46 64 36 Q 74 34 80 42 Z" fill={leaf} />
      {/* leaf right */}
      <path d="M 80 44 Q 92 38 98 28 Q 90 24 80 36 Z" fill={leaf} opacity="0.85" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 02 — JOURNAL LEAF
// A tiny journal/book with a leaf as bookmark ribbon.
// Says: money journal, reflective.
// ─────────────────────────────────────────────
function MarkJournalLeaf({ size = 160, bg = LC.oat, book = LC.coral, page = LC.cream, leaf = LC.sageDeep }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* book body */}
      <rect x="40" y="36" width="78" height="94" rx="14" fill={book} />
      {/* page */}
      <rect x="48" y="44" width="62" height="78" rx="8" fill={page} />
      {/* three lines of writing */}
      <line x1="58" y1="62" x2="98" y2="62" stroke={LC.ink} strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="74" x2="92" y2="74" stroke={LC.ink} strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="86" x2="86" y2="86" stroke={LC.ink} strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
      {/* leaf sprouting from top edge (bookmark) */}
      <path d="M 98 36 Q 108 22 124 24 Q 122 40 108 50 Q 100 46 98 36 Z" fill={leaf} />
      <path d="M 104 30 Q 112 36 116 42" stroke={LC.ink} strokeOpacity="0.15" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 03 — C-SPROUT
// Lowercase italic 'c' whose top terminal becomes a tiny leaf.
// Letterform + organic in one gesture.
// ─────────────────────────────────────────────
function MarkCSprout({ size = 160, bg = LC.sage, ink = LC.ink, leaf = LC.sageDark }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* c arc */}
      <path
        d="M 114 58 Q 104 44 84 44 Q 54 44 54 80 Q 54 116 84 116 Q 104 116 114 102"
        fill="none" stroke={ink} strokeWidth="14" strokeLinecap="round"
      />
      {/* leaf replacing top terminal */}
      <path d="M 114 58 Q 124 48 128 36 Q 116 36 108 48 Q 110 54 114 58 Z" fill={leaf} />
      {/* tiny stem accent on leaf */}
      <path d="M 115 52 L 120 44" stroke={LC.ink} strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 04 — POCKET LEAF
// A rounded pocket/pouch shape with a leaf tucked inside — the pockets metaphor.
// ─────────────────────────────────────────────
function MarkPocketLeaf({ size = 160, bg = LC.oatDeep, pocket = LC.coral, leaf = LC.sageDeep, inner = LC.cream }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* pocket body — rounded U */}
      <path d="M 34 58 Q 34 124 80 124 Q 126 124 126 58 Q 126 54 122 54 L 38 54 Q 34 54 34 58 Z" fill={pocket} />
      {/* pocket flap shadow */}
      <path d="M 38 54 L 122 54" stroke={LC.ink} strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      {/* leaf inside */}
      <path d="M 80 34 Q 62 36 58 56 Q 72 62 82 50 Q 86 42 80 34 Z" fill={leaf} />
      <path d="M 74 46 L 66 54" stroke={LC.ink} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" />
      {/* second leaflet */}
      <path d="M 84 38 Q 100 42 102 58 Q 90 62 82 52 Q 80 44 84 38 Z" fill={leaf} opacity="0.75" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 05 — CENT LEAF
// The classic cent symbol '¢' redrawn as an organic curve with a leaf crossbar.
// ─────────────────────────────────────────────
function MarkCentLeaf({ size = 160, bg = LC.lavender, ink = LC.ink, leaf = LC.sageDeep }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* c arc */}
      <path
        d="M 112 58 Q 100 44 82 44 Q 52 44 52 80 Q 52 116 82 116 Q 100 116 112 102"
        fill="none" stroke={ink} strokeWidth="13" strokeLinecap="round"
      />
      {/* vertical stroke of ¢ — but as a leaf stem */}
      <path d="M 82 30 Q 82 80 82 130" stroke={ink} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* one leaf on stem */}
      <path d="M 82 62 Q 96 58 100 48 Q 90 44 82 54 Z" fill={leaf} />
      <path d="M 82 100 Q 68 104 64 114 Q 74 118 82 108 Z" fill={leaf} opacity="0.85" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 06 — HEART COIN
// A coin that's subtly heart-shaped. Money + care.
// ─────────────────────────────────────────────
function MarkHeartCoin({ size = 160, bg = LC.oat, coin = LC.coral, ink = LC.ink, sheen = LC.cream }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* heart-squircle coin */}
      <path d="M 80 130 C 40 110 30 80 42 62 C 52 48 68 48 80 62 C 92 48 108 48 118 62 C 130 80 120 110 80 130 Z" fill={coin} />
      {/* inner soft ring */}
      <path d="M 80 116 C 52 100 46 80 54 68 C 60 58 70 58 80 70 C 90 58 100 58 106 68 C 114 80 108 100 80 116 Z" fill="none" stroke={LC.ink} strokeOpacity="0.12" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
      {/* cent mark inside */}
      <path d="M 92 78 Q 80 74 74 82 Q 70 90 76 98 Q 82 104 92 100" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" />
      <line x1="83" y1="70" x2="83" y2="108" stroke={ink} strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 07 — MOON POUCH
// A crescent cradle hugging a tiny seed/bean. Savings as something held.
// ─────────────────────────────────────────────
function MarkMoonPouch({ size = 160, bg = LC.oat, moon = LC.sageDeep, seed = LC.coral }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* crescent cradle */}
      <path
        d="M 36 70 Q 36 132 96 132 Q 118 132 128 118 Q 108 124 90 120 Q 58 112 54 78 Q 54 68 58 58 Q 42 60 36 70 Z"
        fill={moon}
      />
      {/* seed */}
      <ellipse cx="92" cy="76" rx="20" ry="24" fill={seed} transform="rotate(18 92 76)" />
      {/* seed shine */}
      <ellipse cx="86" cy="70" rx="4" ry="8" fill={LC.cream} opacity="0.6" transform="rotate(18 86 70)" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 08 — BREATH RING
// Two concentric rounded arcs forming a 'c' that also looks like a mindfulness breath.
// Pure geometric, no coin or leaf — most minimal option.
// ─────────────────────────────────────────────
function MarkBreathRing({ size = 160, bg = LC.sage, outer = LC.sageDark, inner = LC.oat }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 160 160" style={{ display: 'block' }}>
      <rect x="0" y="0" width="160" height="160" rx="44" fill={bg} />
      {/* outer arc — open 'c' */}
      <path
        d="M 118 48 Q 100 32 80 32 Q 40 32 40 80 Q 40 128 80 128 Q 100 128 118 112"
        fill="none" stroke={outer} strokeWidth="12" strokeLinecap="round"
      />
      {/* inner arc */}
      <path
        d="M 106 62 Q 94 52 80 52 Q 58 52 58 80 Q 58 108 80 108 Q 94 108 106 98"
        fill="none" stroke={inner} strokeWidth="10" strokeLinecap="round" opacity="0.9"
      />
      {/* tiny dot — the 'cent' */}
      <circle cx="98" cy="80" r="5" fill={inner} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Wordmark — lowercase italic newsreader, matches existing DS
// ─────────────────────────────────────────────
function Wordmark({ size = 44, color = LC.ink, letterSpacing = -0.6, style = 'serif' }) {
  return (
    <div style={{
      fontFamily: style === 'serif' ? '"Newsreader", Georgia, serif' : '"Nunito", sans-serif',
      fontStyle: style === 'serif' ? 'italic' : 'normal',
      fontWeight: style === 'serif' ? 500 : 700,
      fontSize: size,
      color,
      letterSpacing,
      lineHeight: 1,
    }}>
      centsible
    </div>
  );
}

Object.assign(window, {
  LC,
  MarkSproutCoin, MarkJournalLeaf, MarkCSprout, MarkPocketLeaf,
  MarkCentLeaf, MarkHeartCoin, MarkMoonPouch, MarkBreathRing,
  Wordmark,
});
