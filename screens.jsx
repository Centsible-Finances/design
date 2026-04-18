// screens.jsx — Centsible screens (non-dashboard)
// Transaction modal, Mood check-in, Insights feed, Budgets, Weekly summary

const { useState: useS, useEffect: useE, useRef: useR } = React;

// ═══════════════════════════════════════════════════════════════════
// TAB BAR — bottom nav
// ═══════════════════════════════════════════════════════════════════
function TabBar({ theme, active, onChange, onAdd }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'pockets', label: 'Pockets', icon: 'jar' },
    { id: null, label: 'add', icon: 'plus', isAdd: true },
    { id: 'budgets', label: 'Budgets', icon: 'ring' },
    { id: 'mood', label: 'Journal', icon: 'heart' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '10px 14px 28px', zIndex: 40,
      background: `linear-gradient(to top, ${theme.bg} 78%, ${theme.bg}ee 92%, ${theme.bg}00)`,
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: theme.card,
        borderRadius: 28,
        boxShadow: theme.plushShadow,
        border: `1px solid ${theme.line}`,
        padding: '10px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        {tabs.map(t => {
          if (t.isAdd) {
            return (
              <button key="add" onClick={onAdd} style={{
                width: 52, height: 52, borderRadius: 26, border: 'none',
                background: `radial-gradient(circle at 30% 30%, ${theme.peach}, ${theme.peachDeep})`,
                boxShadow: `0 6px 16px ${theme.peachDeep}66, inset -2px -3px 6px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.4)`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -18,
              }}>
                {glyph('plus', 28, theme.ink)}
              </button>
            );
          }
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 0',
              color: isActive ? theme.ink : theme.inkMuted,
              fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
            }}>
              <div style={{ opacity: isActive ? 1 : 0.7, transform: isActive ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.18s ease' }}>
                {glyph(t.icon, 22, isActive ? theme.ink : theme.inkMuted)}
              </div>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TRANSACTION ENTRY MODAL
// ═══════════════════════════════════════════════════════════════════
function TxnModal({ theme, onClose, onSubmit }) {
  const [amount, setAmount] = useS('');
  const [note, setNote] = useS('');
  const [cat, setCat] = useS('coffee');
  const [type, setType] = useS('expense');
  const [mood, setMood] = useS(0.6);

  const cats = [
    { id: 'coffee', label: 'Coffee', icon: 'coffee' },
    { id: 'bag', label: 'Groceries', icon: 'bag' },
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'car', label: 'Transit', icon: 'car' },
    { id: 'gift', label: 'Joy', icon: 'gift' },
    { id: 'sparkle', label: 'Other', icon: 'sparkle' },
  ];

  const submit = () => {
    const val = parseFloat(amount) || 0;
    onSubmit({
      amount: type === 'expense' ? -val : val,
      merchant: note || 'Untitled',
      cat, mood, time: 'just now',
    });
    onClose();
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(40,30,20,0.38)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fade 0.22s ease',
    }}>
      <div style={{
        background: theme.bg, width: '100%',
        borderRadius: '32px 32px 0 0',
        padding: '22px 22px 28px',
        maxHeight: '86%', overflow: 'auto',
        animation: 'slideUp 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.05)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 42, height: 5, borderRadius: 3, background: theme.inkMuted, opacity: 0.45 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 26, fontWeight: 500, color: theme.ink }}>
            Add a moment
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 17, border: 'none',
            background: theme.bgDeep, cursor: 'pointer',
            color: theme.inkSoft, fontFamily: FONTS.sans, fontSize: 18,
          }}>×</button>
        </div>

        {/* expense / income toggle */}
        <div style={{
          display: 'flex', background: theme.bgDeep, padding: 4, borderRadius: 16, marginBottom: 20,
        }}>
          {[{ id: 'expense', label: 'Expense', color: theme.peach },
            { id: 'income', label: 'Income', color: theme.blueViolet }].map(t => (
            <button key={t.id} onClick={() => setType(t.id)} style={{
              flex: 1, padding: '11px 16px', borderRadius: 12, border: 'none',
              background: type === t.id ? t.color : 'transparent',
              color: theme.ink, fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.18s ease',
            }}>{t.label}</button>
          ))}
        </div>

        {/* amount */}
        <div style={{
          background: type === 'expense' ? theme.washPeach : theme.washBlue,
          borderRadius: 22, padding: '22px 20px', marginBottom: 16, textAlign: 'center',
        }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 8 }}>
            how much?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontFamily: FONTS.serif, fontSize: 32, color: theme.ink, opacity: 0.55 }}>$</span>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              inputMode="decimal"
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontFamily: FONTS.serif, fontSize: 54, fontWeight: 500,
                color: theme.ink, width: 180, textAlign: 'center', letterSpacing: -1,
              }}
            />
          </div>
        </div>

        {/* category pills */}
        <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 10 }}>
          what for?
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 14px', borderRadius: 9999,
              border: `1.5px solid ${cat === c.id ? theme.ink : theme.line}`,
              background: cat === c.id ? theme.ink : theme.card,
              color: cat === c.id ? theme.card : theme.ink,
              fontFamily: FONTS.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}>
              {glyph(c.icon, 16, cat === c.id ? theme.card : theme.ink)}
              {c.label}
            </button>
          ))}
        </div>

        {/* note */}
        <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 8 }}>
          a note (optional)
        </div>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Morning ritual at the café"
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '14px 16px', borderRadius: 16,
            border: `1px solid ${theme.line}`,
            background: theme.card, outline: 'none',
            fontFamily: FONTS.serif, fontSize: 15, color: theme.ink,
            fontStyle: 'italic', marginBottom: 18,
          }}
        />

        {/* mood at the moment */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft }}>
            how did it feel?
          </div>
          <MoodOrb value={mood} theme={theme} size={26} />
        </div>
        <input
          type="range" min="0" max="1" step="0.01"
          value={mood} onChange={e => setMood(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: theme.peachDeep, marginBottom: 22 }}
        />

        <SoftButton theme={theme} onClick={submit}>Save this moment</SoftButton>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MOOD JOURNAL SCREEN
// ═══════════════════════════════════════════════════════════════════
function MoodScreen({ theme }) {
  const [mood, setMood] = useS(0.72);
  const [note, setNote] = useS('');
  const [saved, setSaved] = useS(false);
  const prompts = [
    'What felt light with money today?',
    'Was there a moment you reached for comfort?',
    'What would "enough" look like this week?',
    'Who did you spend on — including yourself?',
  ];
  const [prompt] = useS(prompts[Math.floor(Math.random() * prompts.length)]);

  const moodLabel = mood > 0.75 ? 'Grounded' : mood > 0.55 ? 'Steady' : mood > 0.35 ? 'Tender' : mood > 0.2 ? 'Tight' : 'Heavy';

  const pastEntries = [
    { day: 'Yesterday', label: 'Steady', mood: 0.62, snippet: 'Paid rent. Breathed through the transfer.' },
    { day: 'Mon', label: 'Grounded', mood: 0.82, snippet: 'Said no to a thing I didn\'t really want.' },
    { day: 'Sun', label: 'Tender', mood: 0.4, snippet: 'Bought myself flowers. No regrets.' },
  ];

  return (
    <div style={{ padding: '10px 20px 120px' }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 6 }}>
        Tuesday, April 18
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 500, color: theme.ink, lineHeight: 1.15, marginBottom: 22 }}>
        How is money feeling today?
      </div>

      {/* orb + slider */}
      <div style={{
        background: theme.card, borderRadius: 28, padding: 26,
        boxShadow: theme.plushShadow, border: `1px solid ${theme.line}`,
        marginBottom: 18,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <MoodOrb value={mood} theme={theme} size={110} />
        </div>
        <div style={{ fontFamily: FONTS.serif, fontSize: 28, textAlign: 'center', color: theme.ink, fontWeight: 500, marginBottom: 18 }}>
          {moodLabel}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted, marginBottom: 4, padding: '0 4px' }}>
          <span>heavy</span><span>tender</span><span>grounded</span>
        </div>
        <input
          type="range" min="0" max="1" step="0.01"
          value={mood} onChange={e => setMood(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: theme.peachDeep }}
        />
      </div>

      {/* prompt + journal */}
      <div style={{
        background: theme.washLavender, borderRadius: 28, padding: 22, marginBottom: 18,
        boxShadow: theme.plushShadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {glyph('sparkle', 16, theme.lavenderDeep)}
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.lavenderDeep }}>
            Gentle prompt
          </div>
        </div>
        <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 20, color: theme.ink, lineHeight: 1.4, marginBottom: 14 }}>
          “{prompt}”
        </div>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="start where you are..."
          style={{
            width: '100%', boxSizing: 'border-box', minHeight: 100,
            padding: '14px 16px', borderRadius: 18,
            border: 'none', background: 'rgba(255,255,255,0.6)', outline: 'none',
            fontFamily: FONTS.serif, fontSize: 15, color: theme.ink,
            lineHeight: 1.55, resize: 'none',
          }}
        />
      </div>

      <div onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
        <SoftButton theme={theme}>{saved ? '✓ tucked in' : 'Tuck this away'}</SoftButton>
      </div>

      {/* past entries */}
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginTop: 32, marginBottom: 12 }}>
        Recent check-ins
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pastEntries.map((e, i) => (
          <div key={i} style={{
            background: theme.card, borderRadius: 22, padding: '16px 18px',
            boxShadow: theme.plushShadow, border: `1px solid ${theme.line}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <MoodOrb value={e.mood} theme={theme} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 17, fontWeight: 500, color: theme.ink }}>{e.label}</div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted }}>{e.day}</div>
              </div>
              <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: theme.inkSoft, marginTop: 3 }}>
                “{e.snippet}”
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INSIGHTS SCREEN
// ═══════════════════════════════════════════════════════════════════
function InsightsScreen({ theme, voice }) {
  const insights = [
    { kind: 'pattern', title: 'Monday coffee rhythm', body: 'You visit Morning Bean 7 of the last 10 Mondays. Average $4.80. It\'s a ritual, not a leak.', tone: 'lavender', glyphName: 'coffee' },
    { kind: 'win', title: 'Groceries held steady', body: 'Three weeks at ~$210. You\'ve found your rhythm there.', tone: 'sage', glyphName: 'leaf' },
    { kind: 'notice', title: 'Friday evenings cost more', body: 'Your Friday spending runs 2.4× weekday average. Might be worth a quiet look — or not.', tone: 'butter', glyphName: 'calendar' },
    { kind: 'care', title: 'Gentle check-in', body: 'You marked three expenses as "heavy" this week. When that happens, do you want me to pause before logging?', tone: 'peach', glyphName: 'heart' },
    { kind: 'celebrate', title: 'You saved $312 this month', body: 'That\'s 18% of income. Past-you would be proud.', tone: 'blue', glyphName: 'sparkle' },
  ];

  const toneMap = {
    lavender: { bg: theme.washLavender, accent: theme.lavenderDeep, label: 'pattern' },
    sage:     { bg: theme.washSage,     accent: theme.sageDeep,     label: 'win' },
    butter:   { bg: theme.washButter,   accent: theme.butterDeep,   label: 'gentle notice' },
    peach:    { bg: theme.washPeach,    accent: theme.peachDeep,    label: 'check-in' },
    blue:     { bg: theme.washBlue,     accent: theme.blueVioletDeep, label: 'celebrate' },
  };

  const voiceLabels = { friend: 'best friend', observer: 'quiet observer', coach: 'warm coach' };

  return (
    <div style={{ padding: '10px 20px 120px' }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 6 }}>
        For you · on-device
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 500, color: theme.ink, lineHeight: 1.15, marginBottom: 6 }}>
        Five quiet noticings
      </div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: theme.inkSoft, marginBottom: 22 }}>
        Voice: <span style={{ fontWeight: 700, color: theme.ink }}>{voiceLabels[voice] || 'best friend'}</span> · <span style={{ textDecoration: 'underline' }}>change</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {insights.map((ins, i) => {
          const tone = toneMap[ins.tone];
          return (
            <div key={i} style={{
              background: tone.bg, borderRadius: 26, padding: 20,
              boxShadow: theme.plushShadow, border: `1px solid ${theme.line}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: tone.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 2px 8px ${tone.accent}55`,
                }}>{glyph(ins.glyphName, 18, '#fff')}</div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: tone.accent }}>
                  {tone.label}
                </div>
              </div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 20, fontWeight: 500, color: theme.ink, marginBottom: 6, lineHeight: 1.25 }}>
                {ins.title}
              </div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 15, color: theme.ink, opacity: 0.78, lineHeight: 1.55 }}>
                {ins.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BUDGETS SCREEN
// ═══════════════════════════════════════════════════════════════════
function BudgetsScreen({ theme }) {
  const budgets = [
    { name: 'Groceries', spent: 218, cap: 400, color: theme.sageDeep, bg: theme.sage, wash: theme.washSage, icon: 'bag', note: 'Three weeks steady.' },
    { name: 'Eating out', spent: 142, cap: 180, color: theme.peachDeep, bg: theme.peach, wash: theme.washPeach, icon: 'coffee', note: 'Still has room.' },
    { name: 'Little joys', spent: 64, cap: 120, color: theme.lavenderDeep, bg: theme.lavender, wash: theme.washLavender, icon: 'gift', note: 'Half left for fun.' },
    { name: 'Transit', spent: 38, cap: 80, color: theme.blueVioletDeep, bg: theme.blueViolet, wash: theme.washBlue, icon: 'car', note: 'Right on track.' },
    { name: 'Wellness', spent: 155, cap: 150, color: theme.butterDeep, bg: theme.butter, wash: theme.washButter, icon: 'heart', note: 'Just a touch over — worth it?' },
  ];
  return (
    <div style={{ padding: '10px 20px 120px' }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 6 }}>
        Soft containers
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 500, color: theme.ink, lineHeight: 1.15, marginBottom: 22 }}>
        Your gentle budgets
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {budgets.map((b, i) => {
          const pct = Math.min(1, b.spent / b.cap);
          const over = b.spent > b.cap;
          return (
            <div key={i} style={{
              background: theme.card, borderRadius: 26, padding: 20,
              boxShadow: theme.plushShadow, border: `1px solid ${theme.line}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14, background: b.wash,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{glyph(b.icon, 22, b.color)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 19, fontWeight: 500, color: theme.ink }}>{b.name}</div>
                  <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: theme.inkSoft }}>{b.note}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 20, fontWeight: 500, color: theme.ink }}>${b.spent}</div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkMuted }}>of ${b.cap}</div>
                </div>
              </div>
              <div style={{
                height: 10, background: theme.bgDeep, borderRadius: 5, overflow: 'hidden', position: 'relative',
              }}>
                <div style={{
                  height: '100%', width: `${pct * 100}%`,
                  background: over ? theme.butterDeep : b.color,
                  borderRadius: 5, transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WEEKLY SUMMARY — swipeable story
// ═══════════════════════════════════════════════════════════════════
function WeeklySummary({ theme, onClose }) {
  const [idx, setIdx] = useS(0);
  const slides = [
    {
      bg: theme.washPeach, accent: theme.peachDeep,
      eyebrow: 'This week',
      title: 'You spent $358',
      body: 'That\'s 18% less than last week. A quieter rhythm.',
      visual: 'week',
    },
    {
      bg: theme.washSage, accent: theme.sageDeep,
      eyebrow: 'Your biggest kindness to yourself',
      title: '$18 at the bookshop',
      body: 'You wrote "birthday gift." That\'s the good kind of spending.',
      visual: 'heart',
    },
    {
      bg: theme.washLavender, accent: theme.lavenderDeep,
      eyebrow: 'A pattern',
      title: 'Mondays are coffee days',
      body: '7 of the last 10. It\'s a ritual. I noticed.',
      visual: 'coffee',
    },
    {
      bg: theme.washBlue, accent: theme.blueVioletDeep,
      eyebrow: 'Your mood',
      title: 'You felt grounded 4 days',
      body: 'Tender on Thursday. Steady otherwise. Thank you for checking in.',
      visual: 'mood',
    },
    {
      bg: theme.washButter, accent: theme.butterDeep,
      eyebrow: 'A gentle next step',
      title: 'Try one quiet Friday',
      body: 'Friday spending ran high. No pressure — just a notice. See what it feels like.',
      visual: 'sparkle',
    },
  ];
  const s = slides[idx];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: theme.bg, display: 'flex', flexDirection: 'column',
      animation: 'fade 0.25s ease',
    }}>
      {/* progress dots at top */}
      <div style={{ display: 'flex', gap: 4, padding: '56px 20px 16px' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= idx ? theme.ink : theme.inkMuted + '44',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 16px' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 700, color: theme.inkSoft }}>
          Your week · chapter {idx + 1}/{slides.length}
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 16, border: 'none',
          background: theme.bgDeep, cursor: 'pointer',
          color: theme.inkSoft, fontSize: 16,
        }}>×</button>
      </div>

      {/* slide content */}
      <div style={{
        flex: 1, margin: '0 16px', borderRadius: 36,
        background: s.bg, padding: 28, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
      }}>
        {/* top eyebrow */}
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: s.accent, marginBottom: 10 }}>
            {s.eyebrow}
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 38, fontWeight: 500, color: theme.ink, lineHeight: 1.1, letterSpacing: -0.6 }}>
            {s.title}
          </div>
        </div>

        {/* visual center */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          {s.visual === 'week' && (
            <svg width="220" height="140" viewBox="0 0 220 140">
              {[32, 18, 58, 46, 72, 95, 28].map((h, i) => (
                <rect key={i} x={i * 30 + 8} y={130 - h} width="20" height={h} rx="6" fill={s.accent} opacity={0.55 + i * 0.06} />
              ))}
            </svg>
          )}
          {s.visual === 'heart' && (
            <div style={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: s.accent, borderRadius: '50%',
              boxShadow: `inset -6px -8px 14px rgba(0,0,0,0.1), inset 4px 5px 10px rgba(255,255,255,0.4)`,
            }}>
              {glyph('heart', 70, '#fff')}
            </div>
          )}
          {s.visual === 'coffee' && (
            <div style={{ display: 'flex', gap: 6 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: i === 0 ? s.accent : 'rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i === 0 && glyph('coffee', 16, '#fff')}</div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, color: theme.ink }}>{d}</div>
                </div>
              ))}
            </div>
          )}
          {s.visual === 'mood' && (
            <div style={{ display: 'flex', gap: 10 }}>
              {[0.8, 0.75, 0.78, 0.4, 0.72, 0.8, 0.7].map((v, i) => (
                <MoodOrb key={i} value={v} theme={theme} size={32} />
              ))}
            </div>
          )}
          {s.visual === 'sparkle' && (
            <div style={{ fontSize: 120, color: s.accent, lineHeight: 1 }}>
              {glyph('sparkle', 120, s.accent)}
            </div>
          )}
        </div>

        {/* body */}
        <div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontStyle: 'italic', color: theme.ink, opacity: 0.82, lineHeight: 1.5, marginBottom: 20 }}>
            {s.body}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {idx > 0 && (
              <button onClick={() => setIdx(idx - 1)} style={{
                padding: '14px 24px', borderRadius: 9999, border: `1.5px solid ${theme.ink}22`,
                background: 'rgba(255,255,255,0.4)', fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
                color: theme.ink, cursor: 'pointer',
              }}>← back</button>
            )}
            <button onClick={() => idx < slides.length - 1 ? setIdx(idx + 1) : onClose()} style={{
              flex: 1, padding: '14px 24px', borderRadius: 9999, border: 'none',
              background: theme.ink, fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
              color: theme.card, cursor: 'pointer',
              boxShadow: `0 4px 14px ${theme.ink}33`,
            }}>{idx < slides.length - 1 ? 'next chapter →' : 'close the week'}</button>
          </div>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

Object.assign(window, {
  TabBar, TxnModal, MoodScreen, InsightsScreen, BudgetsScreen, WeeklySummary,
});
