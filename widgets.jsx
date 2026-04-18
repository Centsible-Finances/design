// widgets.jsx — All Centsible widget components
// Each widget accepts (theme, size, ...props). size: 'small' | 'medium' | 'large'

const { useState: useStateW, useEffect: useEffectW } = React;

// ─── tiny helpers ───
function Currency({ value, color, size = 48, weight = 500, family }) {
  const neg = value < 0;
  const abs = Math.abs(value).toFixed(2);
  const [int, dec] = abs.split('.');
  return (
    <span style={{ fontFamily: family || FONTS.serif, color, fontSize: size, fontWeight: weight, letterSpacing: -0.5, lineHeight: 1 }}>
      {neg && '−'}<span style={{ fontSize: size * 0.65, verticalAlign: '0.25em', marginRight: 1 }}>$</span>{int}<span style={{ fontSize: size * 0.55, opacity: 0.55 }}>.{dec}</span>
    </span>
  );
}

function Plush({ theme, children, style, onClick, accent }) {
  return (
    <div onClick={onClick} style={{
      background: accent || theme.card,
      borderRadius: 28,
      padding: 20,
      boxShadow: theme.plushShadow,
      border: `1px solid ${theme.line}`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.18s ease',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// Soft rounded icons drawn with CSS/shapes only (no complex SVG)
const glyph = (kind, size = 20, color = 'currentColor') => {
  const s = { width: size, height: size, display: 'inline-block' };
  switch (kind) {
    case 'leaf': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M20 4s-1 10-8 14c-6 3-8-2-8-2s4-10 10-12c3-1 6 0 6 0z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 20c2-5 6-9 12-12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case 'sparkle': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M12 3l1.8 5.7L19 10l-5.2 1.3L12 17l-1.8-5.7L5 10l5.2-1.3L12 3z" fill={color}/><circle cx="19" cy="5" r="1.3" fill={color}/><circle cx="5" cy="19" r="1" fill={color}/></svg>;
    case 'sun': return <svg viewBox="0 0 24 24" style={s} fill="none"><circle cx="12" cy="12" r="5" fill={color}/><g stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="6.5" y2="6.5"/><line x1="17.5" y1="17.5" x2="19" y2="19"/><line x1="5" y1="19" x2="6.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="19" y2="5"/></g></svg>;
    case 'cloud': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M7 18h11a3.5 3.5 0 00.5-7 5 5 0 00-9.5-1.5A3.5 3.5 0 007 18z" fill={color}/></svg>;
    case 'jar': return <svg viewBox="0 0 24 24" style={s} fill="none"><rect x="5" y="4" width="14" height="3" rx="1.2" fill={color}/><path d="M6 8h12l-1 12a2 2 0 01-2 1.8H9A2 2 0 017 20L6 8z" stroke={color} strokeWidth="1.7"/><path d="M8 14h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/></svg>;
    case 'calendar': return <svg viewBox="0 0 24 24" style={s} fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke={color} strokeWidth="1.7"/><line x1="3.5" y1="10" x2="20.5" y2="10" stroke={color} strokeWidth="1.7"/><line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth="1.7" strokeLinecap="round"/><line x1="16" y1="3" x2="16" y2="7" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></svg>;
    case 'pie': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M12 3v9h9a9 9 0 11-9-9z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/><path d="M15 3a9 9 0 016 6h-6V3z" fill={color}/></svg>;
    case 'list': return <svg viewBox="0 0 24 24" style={s} fill="none"><circle cx="5" cy="6" r="1.3" fill={color}/><circle cx="5" cy="12" r="1.3" fill={color}/><circle cx="5" cy="18" r="1.3" fill={color}/><line x1="9" y1="6" x2="20" y2="6" stroke={color} strokeWidth="1.7" strokeLinecap="round"/><line x1="9" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.7" strokeLinecap="round"/><line x1="9" y1="18" x2="20" y2="18" stroke={color} strokeWidth="1.7" strokeLinecap="round"/></svg>;
    case 'heart': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" fill={color}/></svg>;
    case 'ring': return <svg viewBox="0 0 24 24" style={s} fill="none"><circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="30 50" transform="rotate(-90 12 12)"/></svg>;
    case 'plus': return <svg viewBox="0 0 24 24" style={s} fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
    case 'coffee': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M4 8h14v6a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" stroke={color} strokeWidth="1.7"/><path d="M18 10h2a2.5 2.5 0 010 5h-2" stroke={color} strokeWidth="1.7"/><path d="M8 3c0 2-1 2-1 3M12 3c0 2-1 2-1 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case 'bag': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M5 8h14l-1 12a2 2 0 01-2 1.8H8A2 2 0 016 20L5 8z" stroke={color} strokeWidth="1.7"/><path d="M9 8V6a3 3 0 016 0v2" stroke={color} strokeWidth="1.7"/></svg>;
    case 'home': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/></svg>;
    case 'car': return <svg viewBox="0 0 24 24" style={s} fill="none"><path d="M4 14l1.5-5a2 2 0 012-1.5h9a2 2 0 012 1.5L20 14m-16 0v4a1 1 0 001 1h1a1 1 0 001-1v-1m12 1a1 1 0 001 1h1a1 1 0 001-1v-4" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/><circle cx="8" cy="15" r="1.3" fill={color}/><circle cx="16" cy="15" r="1.3" fill={color}/></svg>;
    case 'gift': return <svg viewBox="0 0 24 24" style={s} fill="none"><rect x="3.5" y="9" width="17" height="11" rx="1.5" stroke={color} strokeWidth="1.7"/><line x1="12" y1="9" x2="12" y2="20" stroke={color} strokeWidth="1.7"/><path d="M8 9c-2 0-3-1-3-2.5S6 4 7.5 4 12 9 12 9m0 0c0 0 3-5 4.5-5S19 5 19 6.5 18 9 16 9" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    default: return null;
  }
};

// ═══════════════════════════════════════════════════════════════════
// SAFE TO SPEND
// ═══════════════════════════════════════════════════════════════════
function SafeToSpend({ theme, size = 'large', value = 842.30, daysLeft = 11 }) {
  const isLarge = size === 'large';
  return (
    <Plush theme={theme} accent={theme.washPeach} style={{ padding: isLarge ? 26 : 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.peachDeep }}>
          Safe to spend
        </div>
        <div style={{ color: theme.peachDeep, opacity: 0.7 }}>{glyph('sparkle', 18, theme.peachDeep)}</div>
      </div>
      <Currency value={value} color={theme.ink} size={isLarge ? 56 : 40} weight={500} />
      <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: theme.ink, opacity: 0.7, marginTop: 10 }}>
        through next payday, <span style={{ fontWeight: 700 }}>{daysLeft} days</span>
      </div>
      {isLarge && (
        <div style={{ marginTop: 14, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: theme.ink, opacity: 0.72, lineHeight: 1.5 }}>
          “You’re tracking <span style={{ fontWeight: 500 }}>a little ahead</span> this month. Breathe.”
        </div>
      )}
    </Plush>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MOOD — today's mood with slider + prompt
// ═══════════════════════════════════════════════════════════════════
function MoodToday({ theme, size = 'medium', mood = 0.68, note = 'Felt steady. Bought coffee without guilt.' }) {
  const hue = `linear-gradient(155deg, ${theme.washSage.includes('linear') ? '' : ''} ${theme.blueVioletDeep}11 0%, ${theme.peachDeep}22 100%)`;
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10 }}>
        Today's mood
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <MoodOrb value={mood} theme={theme} size={54} />
        <div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 22, color: theme.ink, fontWeight: 500 }}>
            {mood > 0.66 ? 'Grounded' : mood > 0.33 ? 'Tender' : 'Tight'}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkSoft }}>checked in · 2:14 pm</div>
        </div>
      </div>
      {size !== 'small' && (
        <div style={{
          fontFamily: FONTS.serif, fontSize: 14, fontStyle: 'italic',
          color: theme.ink, opacity: 0.75, lineHeight: 1.5,
          padding: '12px 14px', background: theme.bgDeep, borderRadius: 18,
        }}>
          “{note}”
        </div>
      )}
    </Plush>
  );
}

// A mood orb = soft blended circle tied to a 0–1 value
function MoodOrb({ value, theme, size = 48 }) {
  // value low = peach/warm, mid = butter, high = sage
  const bg = value > 0.66
    ? `radial-gradient(circle at 35% 30%, ${theme.sage}, ${theme.sageDeep})`
    : value > 0.33
      ? `radial-gradient(circle at 35% 30%, ${theme.butter}, ${theme.butterDeep}cc)`
      : `radial-gradient(circle at 35% 30%, ${theme.peach}, ${theme.peachDeep})`;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      boxShadow: `inset -4px -6px 10px rgba(0,0,0,0.12), inset 3px 4px 8px rgba(255,255,255,0.5), 0 3px 10px rgba(0,0,0,0.08)`,
      flexShrink: 0,
    }} />
  );
}

// ═══════════════════════════════════════════════════════════════════
// WEEK SPENDING — soft bar chart
// ═══════════════════════════════════════════════════════════════════
function WeekSpending({ theme, size = 'medium' }) {
  const days = [
    { d: 'M', v: 28 }, { d: 'T', v: 14 }, { d: 'W', v: 62 },
    { d: 'T', v: 41 }, { d: 'F', v: 88 }, { d: 'S', v: 106 }, { d: 'S', v: 19 },
  ];
  const max = 120;
  const total = days.reduce((a, b) => a + b.v, 0);
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 4 }}>
            This week
          </div>
          <Currency value={total} color={theme.ink} size={28} weight={500} />
        </div>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700,
          background: theme.sage + '55', color: theme.sageDeep,
          padding: '5px 10px', borderRadius: 12,
        }}>
          −18% ↓ vs last
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 72 }}>
        {days.map((day, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: '100%',
              height: `${Math.max(6, (day.v / max) * 58)}px`,
              background: i === 5 ? theme.peachDeep : theme.peach,
              borderRadius: 8,
              opacity: i === 6 ? 0.4 : 1, // sunday = today (placeholder)
            }} />
            <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: theme.inkMuted, fontWeight: 600 }}>{day.d}</div>
          </div>
        ))}
      </div>
    </Plush>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY BREAKDOWN
// ═══════════════════════════════════════════════════════════════════
function CategoryBreakdown({ theme, size = 'medium' }) {
  const cats = [
    { name: 'Groceries', pct: 32, icon: 'bag', color: theme.sage },
    { name: 'Coffee & treats', pct: 22, icon: 'coffee', color: theme.peach },
    { name: 'Rent & home', pct: 18, icon: 'home', color: theme.lavender },
    { name: 'Transit', pct: 14, icon: 'car', color: theme.blueViolet },
    { name: 'Little joys', pct: 14, icon: 'gift', color: theme.butter },
  ];
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 14 }}>
        Where it went
      </div>
      {/* stacked bar */}
      <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 16, gap: 2 }}>
        {cats.map((c, i) => (
          <div key={i} style={{ flex: c.pct, background: c.color, borderRadius: 4 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cats.slice(0, size === 'small' ? 3 : 5).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: c.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.ink, opacity: 0.9,
            }}>{glyph(c.icon, 18, theme.ink)}</div>
            <div style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: theme.ink }}>{c.name}</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: theme.inkSoft }}>{c.pct}%</div>
          </div>
        ))}
      </div>
    </Plush>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RECENT TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════
function RecentTxns({ theme, size = 'medium', txns }) {
  const defaultTxns = [
    { merchant: 'Morning Bean Café', cat: 'coffee', amount: -5.40, time: 'Today · 9:12 am', note: null },
    { merchant: 'Freelance — Acme Co.', cat: 'sparkle', amount: 1240.00, time: 'Today · 8:03 am', note: 'payday 🌱' },
    { merchant: 'Trader Joe\'s', cat: 'bag', amount: -47.18, time: 'Yesterday', note: null },
    { merchant: 'Subway', cat: 'car', amount: -2.90, time: 'Yesterday', note: null },
    { merchant: 'Bookshop on Pine', cat: 'gift', amount: -18.00, time: 'Thu', note: 'birthday gift' },
  ];
  const list = txns || defaultTxns;
  const shown = size === 'small' ? 2 : size === 'large' ? list.length : 4;
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
        Recent
        <span style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 600, color: theme.inkMuted, textTransform: 'none', letterSpacing: 0 }}>all →</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.slice(0, shown).map((t, i) => {
          const income = t.amount > 0;
          const bg = income ? theme.blueViolet : theme.peach;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{glyph(t.cat, 20, theme.ink)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: theme.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted }}>{t.time}{t.note && <span style={{ fontStyle: 'italic' }}> · {t.note}</span>}</div>
              </div>
              <div style={{
                fontFamily: FONTS.serif, fontSize: 17, fontWeight: 500,
                color: income ? theme.blueVioletDeep : theme.ink,
              }}>
                {income ? '+' : '−'}${Math.abs(t.amount).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </Plush>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AI INSIGHT CARD — lavender
// ═══════════════════════════════════════════════════════════════════
function AIInsight({ theme, size = 'medium', voice = 'friend' }) {
  const messages = {
    friend: { greeting: 'hey —', body: 'your Monday coffee runs are a real thing. $4.80 average, 7 of the last 10 Mondays. no judgment — just noticed.' },
    observer: { greeting: 'i noticed —', body: 'coffee spending on Mondays is 2.3× your weekly average. consistent ritual pattern detected.' },
    coach: { greeting: 'love this —', body: 'you\'ve held grocery spending steady for 3 weeks. that\'s real consistency. want to set it as a gentle anchor?' },
  };
  const msg = messages[voice] || messages.friend;
  return (
    <Plush theme={theme} accent={theme.washLavender}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: theme.lavenderDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 2px 6px ${theme.lavenderDeep}66`,
        }}>{glyph('sparkle', 16, '#fff')}</div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.lavenderDeep }}>
          Quiet insight
        </div>
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 19, color: theme.ink, lineHeight: 1.4, fontWeight: 400 }}>
        <span style={{ fontStyle: 'italic', color: theme.lavenderDeep, fontWeight: 500 }}>{msg.greeting}</span> {msg.body}
      </div>
      {size !== 'small' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <SoftButton theme={theme} small>that's fair</SoftButton>
          <SoftButton theme={theme} small variant="ghost">not really</SoftButton>
        </div>
      )}
    </Plush>
  );
}

function SoftButton({ theme, children, onClick, variant = 'solid', small = false, color }) {
  const isGhost = variant === 'ghost';
  return (
    <button onClick={onClick} style={{
      fontFamily: FONTS.sans, fontSize: small ? 13 : 15, fontWeight: 700,
      padding: small ? '8px 14px' : '14px 22px', borderRadius: 9999,
      border: isGhost ? `1.5px solid ${theme.line}` : 'none',
      background: isGhost ? 'transparent' : (color || theme.ink),
      color: isGhost ? theme.inkSoft : (color ? theme.ink : theme.card),
      cursor: 'pointer',
      boxShadow: isGhost ? 'none' : `0 4px 12px ${theme.ink}22`,
      transition: 'transform 0.12s ease',
    }}>{children}</button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BUDGET PROGRESS RINGS
// ═══════════════════════════════════════════════════════════════════
function BudgetRings({ theme, size = 'medium' }) {
  const budgets = [
    { name: 'Groceries', spent: 218, cap: 400, color: theme.sageDeep, bg: theme.sage },
    { name: 'Eating out', spent: 142, cap: 180, color: theme.peachDeep, bg: theme.peach },
    { name: 'Fun', spent: 64, cap: 120, color: theme.lavenderDeep, bg: theme.lavender },
  ];
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 16 }}>
        Gentle budgets
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12 }}>
        {budgets.map((b, i) => (
          <Ring key={i} {...b} theme={theme} />
        ))}
      </div>
    </Plush>
  );
}

function Ring({ name, spent, cap, color, bg, theme }) {
  const pct = Math.min(1, spent / cap);
  const R = 30, C = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
      <div style={{ position: 'relative', width: 74, height: 74 }}>
        <svg width={74} height={74} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="37" cy="37" r={R} stroke={bg} strokeWidth="8" fill="none" opacity="0.45" />
          <circle cx="37" cy="37" r={R} stroke={color} strokeWidth="8" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${C * pct} ${C}`} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: FONTS.serif, fontSize: 16, fontWeight: 500, color: theme.ink,
        }}>{Math.round(pct * 100)}<span style={{ fontSize: 10, opacity: 0.6, marginLeft: 1 }}>%</span></div>
      </div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, color: theme.ink, textAlign: 'center' }}>{name}</div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: theme.inkMuted }}>${spent}/{cap}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// UPCOMING BILLS
// ═══════════════════════════════════════════════════════════════════
function UpcomingBills({ theme, size = 'medium' }) {
  const bills = [
    { name: 'Rent', amount: 1450, due: 'Apr 1', days: 4, icon: 'home' },
    { name: 'Figma', amount: 15, due: 'Apr 3', days: 6, icon: 'sparkle' },
    { name: 'Electric', amount: 62, due: 'Apr 7', days: 10, icon: 'sun' },
  ];
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 14 }}>
        Coming up
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bills.slice(0, size === 'small' ? 2 : 3).map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: theme.butter,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{glyph(b.icon, 20, theme.ink)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: theme.ink }}>{b.name}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted }}>
                in {b.days} days · {b.due}
              </div>
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 16, fontWeight: 500, color: theme.ink }}>
              ${b.amount}
            </div>
          </div>
        ))}
      </div>
    </Plush>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SAVINGS JAR
// ═══════════════════════════════════════════════════════════════════
function SavingsJar({ theme, size = 'medium' }) {
  const goals = [
    { name: 'Cozy trip to Porto', saved: 640, goal: 1800, color: theme.washBlue, accent: theme.blueVioletDeep },
    { name: 'Rainy day fund', saved: 1420, goal: 2000, color: theme.washSage, accent: theme.sageDeep },
  ];
  return (
    <Plush theme={theme} style={{ background: theme.card }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 14 }}>
        Jars
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {goals.slice(0, size === 'small' ? 1 : 2).map((g, i) => {
          const pct = g.saved / g.goal;
          return (
            <div key={i} style={{ flex: 1, background: g.color, borderRadius: 20, padding: 14, position: 'relative', overflow: 'hidden' }}>
              {/* jar visual */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <div style={{
                  width: 56, height: 68, borderRadius: '8px 8px 16px 16px',
                  border: `2px solid ${g.accent}`,
                  background: 'rgba(255,255,255,0.4)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: `${pct * 100}%`,
                    background: g.accent,
                    opacity: 0.8,
                    borderRadius: pct > 0.95 ? '8px 8px 14px 14px' : '4px 4px 14px 14px',
                    transition: 'height 0.6s ease',
                  }} />
                </div>
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, color: theme.ink, textAlign: 'center' }}>{g.name}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.ink, opacity: 0.7, textAlign: 'center', marginTop: 2 }}>
                ${g.saved} / ${g.goal}
              </div>
            </div>
          );
        })}
      </div>
    </Plush>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MONEY MOOD WEATHER
// ═══════════════════════════════════════════════════════════════════
function MoneyWeather({ theme, size = 'medium' }) {
  return (
    <Plush theme={theme} accent={theme.washBlue}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.blueVioletDeep, marginBottom: 12 }}>
        Money weather
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* sun-peeking-cloud */}
        <div style={{ position: 'relative', width: 66, height: 56, flexShrink: 0 }}>
          <div style={{
            position: 'absolute', top: 2, right: 8, width: 34, height: 34, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${theme.butter}, ${theme.butterDeep})`,
            boxShadow: `inset -3px -3px 6px rgba(0,0,0,0.1)`,
          }} />
          <div style={{
            position: 'absolute', bottom: 4, left: 4, width: 54, height: 34,
            background: '#fff', borderRadius: 30,
            boxShadow: `inset -3px -2px 8px rgba(0,0,0,0.06), -6px -6px 0 -2px #fff, 14px -2px 0 -4px #fff`,
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 500, color: theme.ink, lineHeight: 1.2 }}>
            Partly sunny
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: theme.inkSoft, marginTop: 4, lineHeight: 1.5 }}>
            mostly calm · one bill cloud on Thursday
          </div>
        </div>
      </div>
    </Plush>
  );
}

// Export all
Object.assign(window, {
  SafeToSpend, MoodToday, MoodOrb, WeekSpending, CategoryBreakdown,
  RecentTxns, AIInsight, BudgetRings, UpcomingBills, SavingsJar,
  MoneyWeather, SoftButton, Plush, Currency, glyph,
});
