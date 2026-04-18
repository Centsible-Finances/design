// ds-sections.jsx — Design system sections for Centsible
const { useState: useDS, useEffect: useDSE } = React;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function useTheme() {
  const [, force] = useDS(0);
  useDSE(() => {
    const h = () => force(n => n + 1);
    window.addEventListener('themechange', h);
    return () => window.removeEventListener('themechange', h);
  }, []);
  return window.__theme === 'dark' ? 'dark' : 'light';
}

function currentPalette(name) {
  const dark = window.__theme === 'dark';
  return getPalette(name || 'peach', dark);
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero() {
  return (
    <div className="ds-hero">
      <div>
        <div className="ds-eyebrow">Centsible · design system · v1.0</div>
        <div className="ds-title">A cozy<br/><em>money journal.</em></div>
        <div className="ds-lede">
          Tokens, atoms, composed components, and widgets for a calm personal-finance
          companion. Warm palettes, plush shadows, a literary serif, and a rounded sans —
          built for gentle daily rituals, not anxious spreadsheets.
        </div>
      </div>
      <div className="ds-hero-logo">
        <MarkCSprout size={260} bg={LC.sage} ink={LC.ink} leaf={LC.sageDark} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION shell
// ─────────────────────────────────────────────
function Section({ num, title, sub, children }) {
  const id = 'sec-' + String(num).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return (
    <section className="ds-section" id={id} data-section-num={num} data-section-title={title}>
      <div className="ds-section-head">
        <span className="ds-section-num">{num}</span>
        <h2 className="ds-section-title">{title}</h2>
        {sub && <div className="ds-section-sub">{sub}</div>}
      </div>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────
// JUMP DROPDOWN
// ─────────────────────────────────────────────
function JumpDropdown() {
  const [open, setOpen] = useDS(false);
  const [q, setQ] = useDS('');
  const [sections, setSections] = useDS([]);
  const [hl, setHl] = useDS(0);
  const inputRef = React.useRef(null);

  useDSE(() => {
    // collect sections from DOM after render
    const collect = () => {
      const nodes = document.querySelectorAll('[data-section-num]');
      const arr = Array.from(nodes).map(n => ({
        id: n.id,
        num: n.getAttribute('data-section-num'),
        title: n.getAttribute('data-section-title'),
      }));
      // also add sub-anchors
      const subs = document.querySelectorAll('[data-subjump]');
      subs.forEach(s => arr.push({
        id: s.id,
        num: '↳',
        title: s.getAttribute('data-subjump'),
        isSub: true,
        parentId: s.closest('[data-section-num]')?.id,
      }));
      setSections(arr);
    };
    const t = setTimeout(collect, 100);
    return () => clearTimeout(t);
  }, []);

  useDSE(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useDSE(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.ds-jump')) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const filtered = sections.filter(s => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return s.title.toLowerCase().includes(needle) || s.num.toLowerCase().includes(needle);
  });

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setOpen(false);
    setQ('');
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHl(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHl(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[hl]) jump(filtered[hl].id); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  useDSE(() => { setHl(0); }, [q]);

  return (
    <div className="ds-jump">
      <button className="ds-jump-btn" onClick={() => setOpen(o => !o)}>
        <span>↓ jump to section</span>
        <span className="chev">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="ds-jump-panel">
          <input
            ref={inputRef}
            type="text"
            placeholder="search sections…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
          />
          <div className="ds-jump-list">
            {filtered.length === 0 && <div className="ds-jump-empty">no matches</div>}
            {filtered.map((s, i) => (
              <div
                key={s.id}
                className={'ds-jump-item' + (i === hl ? ' hl' : '')}
                onMouseEnter={() => setHl(i)}
                onClick={() => jump(s.id)}
                style={s.isSub ? { paddingLeft: 28, fontWeight: 500, opacity: 0.9 } : null}
              >
                <span className="num">{s.num}</span>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SubHead({ children }) {
  return (
    <div style={{
      fontFamily: FONTS.sans, fontWeight: 700, fontSize: 11,
      letterSpacing: 1.4, textTransform: 'uppercase',
      color: window.__theme === 'dark' ? '#BCB0A3' : '#7A6A5F',
      marginBottom: 16, marginTop: 32,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────
// COLORS — semantic, light/dark pairs
// ─────────────────────────────────────────────

// Semantic role taxonomy — every token has a role-name, a description,
// and a key in the palette object (backwards-compat with existing code).
const SEMANTIC_SURFACES = [
  { token: 'surface.canvas',    key: 'bg',       role: 'page background — the paper of the journal' },
  { token: 'surface.recessed',  key: 'bgDeep',   role: 'insets, sheets, mood-log backdrop' },
  { token: 'surface.raised',    key: 'card',     role: 'cards, widgets, modals, buttons' },
  { token: 'text.primary',      key: 'ink',      role: 'headlines, body, amounts' },
  { token: 'text.secondary',    key: 'inkSoft',  role: 'captions, prompts, eyebrows' },
  { token: 'text.tertiary',     key: 'inkMuted', role: 'timestamps, meta, tokens' },
  { token: 'border.hairline',   key: 'line',     role: 'dividers and card outlines' },
];
const SEMANTIC_ACCENTS = [
  { token: 'accent.expense',  soft: 'peach',      deep: 'peachDeep',      role: 'spending, debit rows, warmth' },
  { token: 'accent.positive', soft: 'sage',       deep: 'sageDeep',       role: 'wins, credits, steady progress' },
  { token: 'accent.insight',  soft: 'lavender',   deep: 'lavenderDeep',   role: 'AI, insights, gentle prompts' },
  { token: 'accent.income',   soft: 'blueViolet', deep: 'blueVioletDeep', role: 'income, weather, trust' },
  { token: 'accent.warning',  soft: 'butter',     deep: 'butterDeep',     role: 'bills, gentle cautions' },
];
const SEMANTIC_WASHES = [
  { token: 'wash.expense',  key: 'washPeach',    role: 'expense surfaces, pocket halos' },
  { token: 'wash.positive', key: 'washSage',     role: 'streaks, wins, growth moments' },
  { token: 'wash.insight',  key: 'washLavender', role: 'AI insight cards, suggestions' },
  { token: 'wash.income',   key: 'washBlue',     role: 'payday, money weather' },
  { token: 'wash.warning',  key: 'washButter',   role: 'bills, reminders' },
];

function chipStyle(val, dark) {
  return {
    background: val,
    borderColor: dark ? 'rgba(255,246,230,0.14)' : 'rgba(58,46,38,0.10)',
  };
}

function SwatchPair({ label, role, lightVal, darkVal, isGradient }) {
  const dark = window.__theme === 'dark';
  return (
    <div className="ds-swatch-row ds-pair" style={{
      background: dark ? 'rgba(255,246,230,0.04)' : 'rgba(58,46,38,0.025)',
      display: 'grid',
      gridTemplateColumns: '1fr 88px 88px',
      alignItems: 'center', gap: 12,
    }}>
      <div>
        <div className="ds-swatch-name" style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 12 }}>{label}</div>
        <div className="ds-swatch-role">{role}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="ds-swatch-chip" style={chipStyle(lightVal, dark)} />
        <div style={{ fontFamily: FONTS.mono, fontSize: 9.5, lineHeight: 1.2, opacity: 0.85 }}>
          <div style={{ fontWeight: 600 }}>light</div>
          <div style={{ opacity: 0.7 }}>{isGradient ? 'gradient' : String(lightVal).slice(0, 9)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="ds-swatch-chip" style={chipStyle(darkVal, dark)} />
        <div style={{ fontFamily: FONTS.mono, fontSize: 9.5, lineHeight: 1.2, opacity: 0.85 }}>
          <div style={{ fontWeight: 600 }}>dark</div>
          <div style={{ opacity: 0.7 }}>{isGradient ? 'gradient' : String(darkVal).slice(0, 9)}</div>
        </div>
      </div>
    </div>
  );
}

function PaletteCardSemantic({ name, paletteName }) {
  const dark = window.__theme === 'dark';
  const lightPal = getPalette(paletteName, false);
  const darkPal  = getPalette(paletteName, true);
  const activePal = dark ? darkPal : lightPal;
  return (
    <div className="ds-card" style={{ color: activePal.ink }}>
      <div className="ds-palette-head" style={{ color: activePal.ink }}>
        {name}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: activePal.inkMuted, marginBottom: 14 }}>
        semantic token · light / dark pair
      </div>

      <div className="ds-swatch-set">
        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: activePal.inkSoft, marginBottom: 6 }}>
          surface &amp; text
        </div>
        {SEMANTIC_SURFACES.map(r => (
          <SwatchPair
            key={r.token}
            label={r.token}
            role={r.role}
            lightVal={lightPal[r.key]}
            darkVal={darkPal[r.key]}
          />
        ))}

        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: activePal.inkSoft, marginTop: 14, marginBottom: 6 }}>
          accents · soft fill
        </div>
        {SEMANTIC_ACCENTS.map(a => (
          <SwatchPair
            key={a.token + '.soft'}
            label={a.token}
            role={a.role}
            lightVal={lightPal[a.soft]}
            darkVal={darkPal[a.soft]}
          />
        ))}

        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: activePal.inkSoft, marginTop: 14, marginBottom: 6 }}>
          accents · deep (text, strokes, fills)
        </div>
        {SEMANTIC_ACCENTS.map(a => (
          <SwatchPair
            key={a.token + '.deep'}
            label={a.token + '.deep'}
            role={'— strong variant · ' + a.role.split('·')[0].trim()}
            lightVal={lightPal[a.deep]}
            darkVal={darkPal[a.deep]}
          />
        ))}
      </div>
    </div>
  );
}

function ColorsSection() {
  useTheme();
  const dark = window.__theme === 'dark';
  const names = [
    { k: 'peach',    n: 'Peach · default',    tag: 'warmest · cozy paper' },
    { k: 'sage',     n: 'Sage · calm',        tag: 'greenhouse · grounded' },
    { k: 'lavender', n: 'Lavender · dreamy',  tag: 'dusk · cool & soft' },
  ];
  return (
    <Section num="01 / COLOR" title="Palettes" sub="Every token is a semantic role — surface.canvas, accent.expense, wash.insight — defined in a light and dark pair.">
      <div style={{
        background: dark ? 'rgba(255,246,230,0.04)' : 'rgba(58,46,38,0.04)',
        borderRadius: 18, padding: '16px 20px', marginBottom: 24,
        display: 'flex', gap: 16, alignItems: 'center',
        border: `1px dashed ${dark ? 'rgba(255,246,230,0.1)' : 'rgba(58,46,38,0.12)'}`,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {names.map(({ k }) => {
            const p = getPalette(k, dark);
            return <div key={k} style={{ width: 22, height: 22, borderRadius: 7, background: p.bg, boxShadow: `inset 0 0 0 2px ${p.peachDeep}88` }} />;
          })}
        </div>
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: dark ? '#BCB0A3' : '#7A6A5F', marginBottom: 3 }}>
            Three themes · user-switchable
          </div>
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: dark ? '#BCB0A3' : '#7A6A5F', lineHeight: 1.5 }}>
            Users pick from <b>peach</b> (default, warmest), <b>sage</b> (calm, green), or <b>lavender</b> (cool, dreamy) in Tweaks. Each palette ships as a light / dark pair with identical semantic tokens — components never reference a raw hex.
          </div>
        </div>
      </div>

      <div id="sec-color-palettes" data-subjump="Palettes (3 × L/D)"></div>
      <SubHead>Palettes · every role in both modes</SubHead>
      <div className="ds-palette">
        {names.map(({ k, n }) => (
          <PaletteCardSemantic key={k} paletteName={k} name={n} />
        ))}
      </div>

      <div id="sec-color-washes" data-subjump="Gradient washes" style={{ marginTop: 32 }}></div>
      <SubHead>Gradient washes · semantic fills for cards, jars, and mood surfaces</SubHead>
      <WashGridPair />
    </Section>
  );
}

function WashGridPair() {
  useTheme();
  const dark = window.__theme === 'dark';
  const pal = getPalette('peach', dark);
  return (
    <div className="ds-card">
      <div className="ds-card-title">wash.* · light / dark</div>
      <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
        Diagonal 155° two-stop gradients. In dark mode they shift to deep, saturated versions of the same hue — same role, different feel.
      </div>
      <div className="ds-swatch-set" style={{ marginTop: 8 }}>
        {SEMANTIC_WASHES.map(w => {
          const lightPal = getPalette('peach', false);
          const darkPal = getPalette('peach', true);
          return (
            <SwatchPair
              key={w.token}
              label={w.token}
              role={w.role}
              lightVal={lightPal[w.key]}
              darkVal={darkPal[w.key]}
              isGradient
            />
          );
        })}
      </div>
    </div>
  );
}

function WashGrid() {
  useTheme();
  const dark = window.__theme === 'dark';
  const pal = getPalette('peach', dark);
  const washes = [
    { key: 'washPeach', label: 'Peach', role: 'expense, safe-to-spend' },
    { key: 'washSage', label: 'Sage', role: 'wins, positive deltas' },
    { key: 'washLavender', label: 'Lavender', role: 'AI, insights, prompts' },
    { key: 'washBlue', label: 'Blue-violet', role: 'income, weather' },
    { key: 'washButter', label: 'Butter', role: 'bills, gentle warnings' },
  ];
  return (
    <div className="ds-wash-grid">
      {washes.map(w => (
        <div key={w.key} className="ds-wash-chip" style={{ background: pal[w.key] }}>
          <div className="ds-wash-label" style={{ color: dark ? pal.ink : '#3A2E26' }}>{w.label}</div>
          <div>
            <div className="ds-wash-desc" style={{ color: dark ? pal.ink : '#3A2E26' }}>{w.role}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: dark ? pal.inkSoft : '#7A6A5F', marginTop: 6 }}>
              {w.key}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────
function TypeSection() {
  useTheme();
  const dark = window.__theme === 'dark';
  const pal = currentPalette();
  const samples = [
    { meta: { b: 'Display', f: 'Newsreader 500 · 72/0.95', role: 'hero titles' },
      style: { fontFamily: FONTS.serif, fontSize: 72, fontWeight: 500, lineHeight: 0.95, letterSpacing: -1 },
      text: <>Hey, <em style={{ opacity: 0.6 }}>Rima.</em></> },
    { meta: { b: 'Title', f: 'Newsreader 500 · 38/1.1', role: 'screen headers, summary slides' },
      style: { fontFamily: FONTS.serif, fontSize: 38, fontWeight: 500, lineHeight: 1.1, letterSpacing: -0.5 },
      text: 'How is money feeling today?' },
    { meta: { b: 'Headline', f: 'Newsreader 500 · 24/1.2', role: 'card titles, modal heads' },
      style: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: 500, lineHeight: 1.2 },
      text: 'Mondays are coffee days' },
    { meta: { b: 'Prose · italic', f: 'Newsreader 400i · 18/1.5', role: 'quotes, gentle prompts' },
      style: { fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.5, color: pal.inkSoft },
      text: '"You\'re tracking a little ahead this month. Breathe."' },
    { meta: { b: 'Currency', f: 'Newsreader 500 · 56 · sized cents', role: 'balances, amounts' },
      style: { fontFamily: FONTS.serif, fontSize: 56, fontWeight: 500, lineHeight: 1, letterSpacing: -0.5 },
      text: <span><span style={{ fontSize: 36, verticalAlign: '0.25em', marginRight: 1 }}>$</span>842<span style={{ fontSize: 30, opacity: 0.55 }}>.30</span></span> },
    { meta: { b: 'Body', f: 'Nunito 500 · 15/1.55', role: 'long body, explanations' },
      style: { fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.55, fontWeight: 500 },
      text: 'Think of pockets like soft envelopes — each one holds the money for a part of your life. Top them up on payday, spend from them as you go.' },
    { meta: { b: 'Label · strong', f: 'Nunito 600 · 14 · normal', role: 'list rows, merchant names' },
      style: { fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600 },
      text: 'Morning Bean Café' },
    { meta: { b: 'Eyebrow', f: 'Nunito 700 · 12 · tracked 1.2, UPPER', role: 'section labels everywhere' },
      style: { fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: pal.inkSoft },
      text: 'Today · afternoon' },
    { meta: { b: 'Caption', f: 'Nunito 500 · 11 · muted', role: 'timestamps, secondary' },
      style: { fontFamily: FONTS.sans, fontSize: 11, fontWeight: 500, color: pal.inkMuted },
      text: 'in 4 days · Apr 1 · $1,450' },
    { meta: { b: 'Mono', f: 'JetBrains Mono 500 · 12', role: 'codes, IDs, tokens' },
      style: { fontFamily: FONTS.mono, fontSize: 12, color: pal.inkSoft },
      text: 'CENTS-0418-MONDAY-0912' },
  ];
  return (
    <Section num="02 / TYPE" title="Typography" sub="Newsreader (Google) for the bookish, human voice. Nunito for warm rounded sans. JetBrains Mono for timestamps and tokens.">
      <div className="ds-type-stack">
        {samples.map((s, i) => (
          <div key={i} className="ds-type-row">
            <div className="ds-type-meta">
              <b>{s.meta.b}</b>
              {s.meta.f}
              <div style={{ fontStyle: 'italic', color: pal.inkMuted, marginTop: 4 }}>{s.meta.role}</div>
            </div>
            <div className="ds-type-sample" style={{ color: pal.ink, ...s.style }}>{s.text}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SPACING / RADII / SHADOWS
// ─────────────────────────────────────────────
function SpacingSection() {
  useTheme();
  const pal = currentPalette();
  const steps = [
    { name: 'xxs', v: 4 }, { name: 'xs', v: 8 }, { name: 'sm', v: 12 },
    { name: 'md', v: 16 }, { name: 'lg', v: 20 }, { name: 'xl', v: 26 },
    { name: 'xxl', v: 32 }, { name: 'huge', v: 48 },
  ];
  const radii = [
    { name: 'pill', v: 9999 }, { name: 'chip', v: 12 }, { name: 'pocket', v: 18 },
    { name: 'card', v: 22 }, { name: 'plush', v: 26 }, { name: 'modal', v: 32 },
  ];
  return (
    <Section num="03 / SPACE" title="Spacing, radii, shadows" sub="Generous, pillowy, forgiving. Rounded everything. Shadows are low-chroma and diffuse.">

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <SubHead>Spacing scale · px</SubHead>
          {steps.map(s => (
            <div key={s.name} className="ds-spacing-row">
              <div className="ds-spacing-label" style={{ color: pal.ink }}>{s.name}</div>
              <div className="ds-spacing-bar" style={{ width: s.v * 3, background: pal.peach }} />
              <div className="ds-spacing-val">{s.v}px</div>
            </div>
          ))}
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: pal.inkSoft, marginTop: 16, lineHeight: 1.5 }}>
            Most cards sit at lg (20) internal padding. Widget grid gaps are sm (12). Density tweak multiplies all spacing by ×0.82 / ×1.0 / ×1.15.
          </div>
        </div>

        <div>
          <SubHead>Radii tokens</SubHead>
          <div className="ds-radii-grid">
            {radii.map(r => (
              <div key={r.name} className="ds-radii-chip" style={{ borderRadius: r.v > 200 ? 200 : r.v }}>
                <div className="nm">{r.name}</div>
                <div className="vl">{r.v === 9999 ? '∞' : r.v + 'px'}</div>
              </div>
            ))}
          </div>

          <SubHead>Shadows · &quot;plush&quot;</SubHead>
          <div className="ds-shadow-grid">
            <div className="ds-shadow-chip" style={{ boxShadow: '0 2px 6px rgba(62,45,30,0.04), 0 1px 2px rgba(62,45,30,0.04)' }}>
              <div className="ds-shadow-nm" style={{ color: pal.ink }}>plush · soft</div>
              <div className="ds-shadow-vl">plush={"{0.0}"}<br/>subtle lift</div>
            </div>
            <div className="ds-shadow-chip" style={{ boxShadow: '0 5px 14px rgba(62,45,30,0.07), 0 1px 2px rgba(62,45,30,0.04)' }}>
              <div className="ds-shadow-nm" style={{ color: pal.ink }}>plush · default</div>
              <div className="ds-shadow-vl">plush={"{0.6}"}<br/>everyday cards</div>
            </div>
            <div className="ds-shadow-chip" style={{ boxShadow: '0 8px 28px rgba(62,45,30,0.12), 0 1px 2px rgba(62,45,30,0.04)' }}>
              <div className="ds-shadow-nm" style={{ color: pal.ink }}>plush · max</div>
              <div className="ds-shadow-vl">plush={"{1.0}"}<br/>modals, lifted</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// BRAND / LOGO
// ─────────────────────────────────────────────
function BrandSection() {
  useTheme();
  const pal = currentPalette();
  return (
    <Section num="04 / BRAND" title="Logotype & mark" sub="The C-sprout mark: lowercase 'c' letterform whose top terminal becomes a soft leaf. Wordmark is lowercase italic Newsreader.">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
        <div className="ds-card">
          <div className="ds-card-title">Primary lockup</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>centsible · wordmark</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Mark + wordmark aligned on the x-height. The mark is a squircle-backed C-sprout; the wordmark is italic Newsreader, lowercase, tight letterspacing.
          </div>
          <div className="ds-demo" style={{ padding: '48px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <MarkCSprout size={72} bg={LC.sage} ink={LC.ink} leaf={LC.sageDark} />
              <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 44, color: pal.ink, letterSpacing: -0.6 }}>
                centsible
              </div>
            </div>
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">Mark · scale ladder</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>24 / 40 / 64 / 96 px</div>
          <div className="ds-demo" style={{ padding: 24, gap: 16 }}>
            {[24, 40, 64, 96].map(sz => (
              <MarkCSprout key={sz} size={sz} bg={LC.sage} ink={LC.ink} leaf={LC.sageDark} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 16 }}>
        <div className="ds-card">
          <div className="ds-card-title">Surface · sage</div>
          <div className="ds-demo" style={{ padding: 28 }}>
            <MarkCSprout size={120} bg={LC.sage} ink={LC.ink} leaf={LC.sageDark} />
          </div>
        </div>
        <div className="ds-card">
          <div className="ds-card-title">Surface · oat</div>
          <div className="ds-demo" style={{ padding: 28 }}>
            <MarkCSprout size={120} bg={LC.oat} ink={LC.sageDark} leaf={LC.coralDeep} />
          </div>
        </div>
        <div className="ds-card">
          <div className="ds-card-title">Surface · coral</div>
          <div className="ds-demo" style={{ padding: 28 }}>
            <MarkCSprout size={120} bg={LC.coral} ink={LC.ink} leaf={LC.sageDark} />
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
function AtomsSection() {
  useTheme();
  const pal = currentPalette();
  const theme = { ...pal, plushShadow: `0 5px 14px rgba(62,45,30,0.07), 0 1px 2px rgba(62,45,30,0.04)` };
  if (window.__theme === 'dark') theme.plushShadow = `0 5px 14px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.35)`;

  const glyphNames = ['leaf','sparkle','sun','cloud','jar','calendar','pie','list','heart','ring','plus','coffee','bag','home','car','gift'];

  return (
    <Section num="05 / ATOMS" title="Atomic components" sub="Primitives used everywhere: currency, buttons, plush cards, mood orb, glyphs.">

      <div className="grid-2">
        <div className="ds-card">
          <div className="ds-card-title">Currency</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>{'<Currency value size weight />'}</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Serif, tabular-feeling, with smaller dollar sign (65%) and de-emphasized cents (55%, 55% opacity). Negatives use a typographic minus (−).
          </div>
          <div className="ds-demo">
            <Currency value={842.30} color={pal.ink} size={56} />
          </div>
          <div className="ds-demo">
            <Currency value={-47.18} color={pal.ink} size={34} />
            <Currency value={1240.00} color={pal.blueVioletDeep} size={34} />
            <Currency value={5.40} color={pal.peachDeep} size={34} />
          </div>
          <div className="ds-code">Currency · sizes 20 / 28 / 34 / 40 / 56 · FONTS.serif</div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">SoftButton</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>{'<SoftButton variant color small />'}</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Fully-rounded pill, ink-fill default, ghost variant for secondary. Small size for inline actions inside cards.
          </div>
          <div className="ds-demo" style={{ flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <SoftButton theme={theme}>Save this moment</SoftButton>
              <SoftButton theme={theme} variant="ghost">not now</SoftButton>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <SoftButton theme={theme} small>that's fair</SoftButton>
              <SoftButton theme={theme} small variant="ghost">not really</SoftButton>
              <SoftButton theme={theme} small color={pal.peach}>try it</SoftButton>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="ds-card">
          <div className="ds-card-title">Plush (card)</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>{'<Plush accent onClick />'}</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Base container. Roundness 26, 20px padding, plush shadow, 1px hairline border. Optional accent swaps the fill for a wash gradient.
          </div>
          <div className="ds-demo" style={{ gap: 14 }}>
            <Plush theme={theme} style={{ padding: 16, minWidth: 140 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: pal.inkSoft }}>default</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 500, color: pal.ink, marginTop: 6 }}>card.</div>
            </Plush>
            <Plush theme={theme} accent={pal.washPeach} style={{ padding: 16, minWidth: 140 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: pal.peachDeep }}>wash</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 500, color: pal.ink, marginTop: 6 }}>accent.</div>
            </Plush>
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">MoodOrb</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>{'<MoodOrb value={0..1} size />'}</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            A blended radial circle with inset highlights. Hue shifts peach → butter → sage as mood rises from heavy to grounded.
          </div>
          <div className="ds-demo" style={{ gap: 18 }}>
            {[0.1, 0.35, 0.55, 0.75, 0.95].map(v => (
              <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <MoodOrb value={v} theme={theme} size={54} />
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: pal.inkMuted }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-card" style={{ marginTop: 16 }}>
        <div className="ds-card-title">Glyphs · line icons</div>
        <div className="ds-card-name" style={{ color: pal.ink }}>glyph(name, size, color)</div>
        <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
          16-icon set, all hand-drawn SVG, 1.7 stroke weight, rounded caps + joins. Paired with a colored 10–14px rounded tile.
        </div>
        <div className="ds-glyph-grid" style={{ marginTop: 6 }}>
          {glyphNames.map(name => (
            <div key={name} className="ds-glyph-cell">
              {glyph(name, 26, pal.ink)}
              <div className="ds-glyph-label">{name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 16 }}>
        <div className="ds-card">
          <div className="ds-card-title">Glyph tile · soft</div>
          <div className="ds-demo" style={{ gap: 10 }}>
            {[['bag', pal.sage], ['coffee', pal.peach], ['home', pal.lavender], ['car', pal.blueViolet], ['gift', pal.butter]].map(([n, c]) => (
              <div key={n} style={{ width: 40, height: 40, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {glyph(n, 22, pal.ink)}
              </div>
            ))}
          </div>
        </div>
        <div className="ds-card">
          <div className="ds-card-title">Glyph tile · deep</div>
          <div className="ds-demo" style={{ gap: 10 }}>
            {[['sparkle', pal.lavenderDeep], ['heart', pal.peachDeep], ['leaf', pal.sageDeep], ['sun', pal.butterDeep], ['calendar', pal.blueVioletDeep]].map(([n, c]) => (
              <div key={n} style={{ width: 40, height: 40, borderRadius: 12, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 8px ${c}66` }}>
                {glyph(n, 22, '#fff')}
              </div>
            ))}
          </div>
        </div>
        <div className="ds-card">
          <div className="ds-card-title">Eyebrow label</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Nunito 700 · 12 · tracked, uppercase, ink-soft. Every section uses it as an anchor.
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: pal.inkSoft, marginTop: 18 }}>
            Quiet insight
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: pal.peachDeep, marginTop: 6 }}>
            Safe to spend
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: pal.sageDeep, marginTop: 6 }}>
            Your week
          </div>
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { Hero, Section, JumpDropdown, ColorsSection, TypeSection, SpacingSection, BrandSection, AtomsSection });
