// tokens.jsx — Centsible design tokens + Tweaks state
// A cozy, journal-like palette. Warm off-whites, soft peach, sage, lavender, blue-purple, warm yellow.

const PALETTES = {
  // "peach" — warm peachy cream base (default, most cozy)
  peach: {
    bg: '#FBF4EC',
    bgDeep: '#F3E9DB',
    card: '#FFFBF5',
    ink: '#3A2E26',
    inkSoft: '#7A6A5F',
    inkMuted: '#A89A8C',
    line: 'rgba(58,46,38,0.09)',
    // semantic
    peach: '#F4C7A8',      // expense
    peachDeep: '#E09978',
    lavender: '#CBBFE3',   // AI insight
    lavenderDeep: '#9F8FC9',
    blueViolet: '#B9C0E4', // income
    blueVioletDeep: '#7885C4',
    sage: '#B8CFAC',       // positive
    sageDeep: '#7FA56E',
    butter: '#F1D98A',     // gentle warning
    butterDeep: '#C9A94A',
    // soft gradient washes
    washPeach: 'linear-gradient(155deg, #FBE3D1 0%, #F4C7A8 100%)',
    washSage: 'linear-gradient(155deg, #D8E8CE 0%, #B8CFAC 100%)',
    washLavender: 'linear-gradient(155deg, #E3DBF0 0%, #CBBFE3 100%)',
    washBlue: 'linear-gradient(155deg, #D9DEEE 0%, #B9C0E4 100%)',
    washButter: 'linear-gradient(155deg, #F9ECBE 0%, #F1D98A 100%)',
  },
  // "sage" — sage/green leaning
  sage: {
    bg: '#F3F1E8',
    bgDeep: '#E7E4D4',
    card: '#FBFAF2',
    ink: '#2F3A2E',
    inkSoft: '#64715F',
    inkMuted: '#9AA495',
    line: 'rgba(47,58,46,0.09)',
    peach: '#F2C5A7',
    peachDeep: '#D99570',
    lavender: '#C8BDE0',
    lavenderDeep: '#9C8BC7',
    blueViolet: '#B3BEDE',
    blueVioletDeep: '#7281BF',
    sage: '#A8C79C',
    sageDeep: '#6B9A5C',
    butter: '#EED583',
    butterDeep: '#C4A440',
    washPeach: 'linear-gradient(155deg, #FAE0CE 0%, #F2C5A7 100%)',
    washSage: 'linear-gradient(155deg, #CEE3C2 0%, #A8C79C 100%)',
    washLavender: 'linear-gradient(155deg, #E1D9EE 0%, #C8BDE0 100%)',
    washBlue: 'linear-gradient(155deg, #D5DBEC 0%, #B3BEDE 100%)',
    washButter: 'linear-gradient(155deg, #F6E6B5 0%, #EED583 100%)',
  },
  // "lavender" — cool dreamy
  lavender: {
    bg: '#F4EFF5',
    bgDeep: '#E8E0EB',
    card: '#FBF7FC',
    ink: '#342B3C',
    inkSoft: '#6F6479',
    inkMuted: '#A399AA',
    line: 'rgba(52,43,60,0.09)',
    peach: '#F1C3A5',
    peachDeep: '#DB9570',
    lavender: '#C9BDE2',
    lavenderDeep: '#9C8BC7',
    blueViolet: '#B6BDE1',
    blueVioletDeep: '#7480C0',
    sage: '#B5CDA9',
    sageDeep: '#7DA26C',
    butter: '#F0D688',
    butterDeep: '#C7A745',
    washPeach: 'linear-gradient(155deg, #FADFCD 0%, #F1C3A5 100%)',
    washSage: 'linear-gradient(155deg, #D5E6CB 0%, #B5CDA9 100%)',
    washLavender: 'linear-gradient(155deg, #DFD5EE 0%, #C9BDE2 100%)',
    washBlue: 'linear-gradient(155deg, #D5DAEC 0%, #B6BDE1 100%)',
    washButter: 'linear-gradient(155deg, #F7E7B7 0%, #F0D688 100%)',
  },
};

const DARK = {
  bg: '#1D1A20',
  bgDeep: '#14121A',
  card: '#27232D',
  ink: '#F2EBE0',
  inkSoft: '#BCB0A3',
  inkMuted: '#827668',
  line: 'rgba(255,246,230,0.08)',
  peach: '#E09978',
  peachDeep: '#F4C7A8',
  lavender: '#9F8FC9',
  lavenderDeep: '#CBBFE3',
  blueViolet: '#8190CE',
  blueVioletDeep: '#B9C0E4',
  sage: '#8AB578',
  sageDeep: '#B8CFAC',
  butter: '#D9B960',
  butterDeep: '#F1D98A',
  washPeach: 'linear-gradient(155deg, #4A3228 0%, #6B4232 100%)',
  washSage: 'linear-gradient(155deg, #2F4028 0%, #486034 100%)',
  washLavender: 'linear-gradient(155deg, #3A334A 0%, #5A4E74 100%)',
  washBlue: 'linear-gradient(155deg, #2E3449 0%, #454F70 100%)',
  washButter: 'linear-gradient(155deg, #4A3E22 0%, #6B5932 100%)',
};

function getPalette(paletteName, dark) {
  if (dark) {
    // blend dark base with palette accents
    const base = PALETTES[paletteName] || PALETTES.peach;
    return { ...base, ...DARK };
  }
  return PALETTES[paletteName] || PALETTES.peach;
}

// density multiplies spacing / font sizes slightly
const DENSITIES = {
  cozy:     { pad: 1.15, gap: 1.15, font: 1.0,  radiusBoost: 1.1 },
  standard: { pad: 1.0,  gap: 1.0,  font: 1.0,  radiusBoost: 1.0 },
  compact:  { pad: 0.82, gap: 0.82, font: 0.95, radiusBoost: 0.9 },
};

// Typography — bookish serif + warm rounded sans
const FONTS = {
  serif: '"Newsreader", "Iowan Old Style", Georgia, serif',
  sans:  '"Nunito", -apple-system, system-ui, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, monospace',
};

Object.assign(window, { PALETTES, DARK, getPalette, DENSITIES, FONTS });
