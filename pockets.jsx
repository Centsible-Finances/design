// pockets.jsx — Pocket concept: envelope/subaccount system
// Pockets = where money LIVES (envelopes). Different from Jars (savings goals) and Budgets (spending limits).

const { useState: useP } = React;

const POCKET_DATA = [
  { id: 'bills',    name: 'Bills & Rent',  balance: 1510.00, allocated: 1620, color: 'butter',  icon: 'home',    tone: 'needs' },
  { id: 'food',     name: 'Everyday Food', balance: 182.40,  allocated: 320,  color: 'sage',    icon: 'bag',     tone: 'needs' },
  { id: 'joy',      name: 'Little Joys',   balance: 68.00,   allocated: 120,  color: 'peach',   icon: 'gift',    tone: 'wants' },
  { id: 'transit',  name: 'Transit',       balance: 42.00,   allocated: 80,   color: 'blue',    icon: 'car',     tone: 'needs' },
  { id: 'soft',     name: 'Soft Landing',  balance: 540.00,  allocated: 540,  color: 'lavender',icon: 'heart',   tone: 'safety' },
];

function colorSet(tone, theme) {
  const map = {
    butter:   { wash: theme.washButter,   accent: theme.butterDeep,   soft: theme.butter },
    sage:     { wash: theme.washSage,     accent: theme.sageDeep,     soft: theme.sage },
    peach:    { wash: theme.washPeach,    accent: theme.peachDeep,    soft: theme.peach },
    blue:     { wash: theme.washBlue,     accent: theme.blueVioletDeep, soft: theme.blueViolet },
    lavender: { wash: theme.washLavender, accent: theme.lavenderDeep, soft: theme.lavender },
  };
  return map[tone] || map.peach;
}

// Compact pocket widget for dashboard
function PocketsWidget({ theme, size = 'medium' }) {
  const shown = size === 'small' ? 2 : size === 'large' ? 5 : 3;
  const total = POCKET_DATA.reduce((a, p) => a + p.balance, 0);
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 4 }}>
            Your pockets
          </div>
          <Currency value={total} color={theme.ink} size={26} weight={500} />
        </div>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, color: theme.inkMuted,
        }}>{POCKET_DATA.length} pockets</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {POCKET_DATA.slice(0, shown).map(p => {
          const cs = colorSet(p.color, theme);
          const pct = p.balance / p.allocated;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: cs.soft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{glyph(p.icon, 18, cs.accent)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 600, color: theme.ink }}>{p.name}</div>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 14, fontWeight: 500, color: theme.ink }}>
                    ${p.balance.toFixed(0)}
                  </div>
                </div>
                <div style={{ height: 4, background: theme.bgDeep, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, pct * 100)}%`, background: cs.accent, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Plush>
  );
}

// Full pockets screen (replaces Budgets tab)
function PocketsScreen({ theme }) {
  const total = POCKET_DATA.reduce((a, p) => a + p.balance, 0);
  const needs = POCKET_DATA.filter(p => p.tone === 'needs').reduce((a, p) => a + p.balance, 0);
  const wants = POCKET_DATA.filter(p => p.tone === 'wants').reduce((a, p) => a + p.balance, 0);
  const safety = POCKET_DATA.filter(p => p.tone === 'safety').reduce((a, p) => a + p.balance, 0);

  return (
    <div style={{ padding: '10px 20px 140px' }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 6 }}>
        Where money lives
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 500, color: theme.ink, lineHeight: 1.15, marginBottom: 6 }}>
        Your pockets
      </div>
      <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: theme.inkSoft, marginBottom: 18, lineHeight: 1.5 }}>
        Think of pockets like soft envelopes — each one holds the money for a part of your life.
      </div>

      {/* total card */}
      <div style={{
        background: theme.washPeach, borderRadius: 28, padding: '20px 22px', marginBottom: 14,
        boxShadow: theme.plushShadow,
      }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.peachDeep, marginBottom: 6 }}>
          In your pockets
        </div>
        <Currency value={total} color={theme.ink} size={40} weight={500} />
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <SliceChip theme={theme} label="needs" amount={needs} color={theme.sageDeep} />
          <SliceChip theme={theme} label="wants" amount={wants} color={theme.peachDeep} />
          <SliceChip theme={theme} label="safety" amount={safety} color={theme.lavenderDeep} />
        </div>
      </div>

      {/* pocket list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {POCKET_DATA.map(p => {
          const cs = colorSet(p.color, theme);
          const pct = p.balance / p.allocated;
          const low = pct < 0.25;
          return (
            <div key={p.id} style={{
              background: theme.card, borderRadius: 26, padding: 20,
              boxShadow: theme.plushShadow, border: `1px solid ${theme.line}`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* colored corner wash */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 110, height: 110,
                background: cs.wash, opacity: 0.5,
                borderRadius: '50%', transform: 'translate(35%, -35%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: cs.wash,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{glyph(p.icon, 24, cs.accent)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 20, fontWeight: 500, color: theme.ink, lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>{p.tone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 500, color: theme.ink }}>
                    ${p.balance.toFixed(0)}
                  </div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted }}>of ${p.allocated}</div>
                </div>
              </div>
              <div style={{ position: 'relative', height: 8, background: theme.bgDeep, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${Math.min(100, pct * 100)}%`, background: cs.accent, borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
              {low && (
                <div style={{
                  fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: theme.butterDeep,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {glyph('sparkle', 14, theme.butterDeep)} getting light — top up soon?
                </div>
              )}
            </div>
          );
        })}
        {/* add pocket */}
        <button style={{
          padding: '18px', borderRadius: 26,
          border: `1.5px dashed ${theme.line}`, background: 'transparent',
          color: theme.inkSoft, fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span style={{ color: theme.peachDeep, fontSize: 20, lineHeight: '14px' }}>+</span>
          sew a new pocket
        </button>
      </div>
    </div>
  );
}

function SliceChip({ theme, label, amount, color }) {
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.4)', borderRadius: 14, padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
        <div style={{ fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: theme.inkSoft }}>{label}</div>
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 17, fontWeight: 500, color: theme.ink }}>${amount.toFixed(0)}</div>
    </div>
  );
}

Object.assign(window, { PocketsWidget, PocketsScreen, POCKET_DATA });
