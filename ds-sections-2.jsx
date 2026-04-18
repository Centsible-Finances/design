// ds-sections-2.jsx — Composed components + widgets + app

const { useState: useDS2, useEffect: useDS2E } = React;

function themeForDemo() {
  const dark = window.__theme === 'dark';
  const pal = getPalette('peach', dark);
  return {
    ...pal,
    plushShadow: dark
      ? `0 5px 14px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.35)`
      : `0 5px 14px rgba(62,45,30,0.07), 0 1px 2px rgba(62,45,30,0.04)`,
  };
}

// ─────────────────────────────────────────────
// COMPOSED
// ─────────────────────────────────────────────
function ComposedSection() {
  const [, force] = useDS2(0);
  useDS2E(() => {
    const h = () => force(n => n + 1);
    window.addEventListener('themechange', h);
    return () => window.removeEventListener('themechange', h);
  }, []);
  const theme = themeForDemo();
  const pal = theme;

  return (
    <Section num="06 / COMPOSED" title="Composed components" sub="Mid-level parts built from atoms. Used inside widgets, screens, and modals.">

      <div className="grid-2">
        <div className="ds-card">
          <div className="ds-card-title">Txn row</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>Transaction list item</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            40px glyph tile + merchant + timestamp + currency. Income uses blue-violet tile + deep color; expense uses peach tile + ink.
          </div>
          <div className="ds-demo" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 20 }}>
            {[
              { merchant: 'Morning Bean Café', cat: 'coffee', amount: -5.40, time: 'Today · 9:12 am' },
              { merchant: 'Freelance — Acme Co.', cat: 'sparkle', amount: 1240.00, time: 'Today · 8:03 am', note: 'payday 🌱' },
              { merchant: 'Trader Joe\'s', cat: 'bag', amount: -47.18, time: 'Yesterday' },
            ].map((t, i) => {
              const income = t.amount > 0;
              const bg = income ? pal.blueViolet : pal.peach;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {glyph(t.cat, 20, pal.ink)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 600, color: pal.ink }}>{t.merchant}</div>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: pal.inkMuted }}>{t.time}{t.note && <span style={{ fontStyle: 'italic' }}> · {t.note}</span>}</div>
                  </div>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 17, fontWeight: 500, color: income ? pal.blueVioletDeep : pal.ink }}>
                    {income ? '+' : '−'}${Math.abs(t.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">Ring · budget progress</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>74px · 8px stroke · dashed</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            SVG ring with soft background + deep accent. Percent in center with smaller % glyph. Always 3 visible in a row on dashboard.
          </div>
          <div className="ds-demo">
            {[
              { name: 'Groceries', spent: 218, cap: 400, color: pal.sageDeep, bg: pal.sage },
              { name: 'Eating out', spent: 142, cap: 180, color: pal.peachDeep, bg: pal.peach },
              { name: 'Fun', spent: 64, cap: 120, color: pal.lavenderDeep, bg: pal.lavender },
            ].map((b, i) => (
              <Ring key={i} {...b} theme={theme} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="ds-card">
          <div className="ds-card-title">Pocket row</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>Compact pocket envelope</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            34px tile + name + amount above a thin 4px progress. Accent color comes from the pocket tone (needs/wants/safety).
          </div>
          <div className="ds-demo" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 20, gap: 14 }}>
            {POCKET_DATA.slice(0, 3).map(p => {
              const toneMap = {
                butter: { accent: pal.butterDeep, soft: pal.butter },
                sage: { accent: pal.sageDeep, soft: pal.sage },
                peach: { accent: pal.peachDeep, soft: pal.peach },
                blue: { accent: pal.blueVioletDeep, soft: pal.blueViolet },
                lavender: { accent: pal.lavenderDeep, soft: pal.lavender },
              };
              const cs = toneMap[p.color];
              const pct = p.balance / p.allocated;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: cs.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {glyph(p.icon, 18, cs.accent)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 600, color: pal.ink }}>{p.name}</div>
                      <div style={{ fontFamily: FONTS.serif, fontSize: 14, fontWeight: 500, color: pal.ink }}>${p.balance.toFixed(0)}</div>
                    </div>
                    <div style={{ height: 4, background: pal.bgDeep, borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${Math.min(100, pct * 100)}%`, background: cs.accent, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">Slice chip</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>Pocket tone summary</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Compact stat: color dot + uppercase label + amount. Used in triplet on the Pockets screen for needs / wants / safety.
          </div>
          <div className="ds-demo" style={{ gap: 10, background: pal.washPeach, padding: 20 }}>
            {[
              { label: 'needs', amount: 1734, color: pal.sageDeep },
              { label: 'wants', amount: 68, color: pal.peachDeep },
              { label: 'safety', amount: 540, color: pal.lavenderDeep },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.4)', borderRadius: 14, padding: '10px 12px', minWidth: 80 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: s.color }} />
                  <div style={{ fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: pal.inkSoft }}>{s.label}</div>
                </div>
                <div style={{ fontFamily: FONTS.serif, fontSize: 17, fontWeight: 500, color: pal.ink }}>${s.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="ds-card">
          <div className="ds-card-title">Bar chart · week</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>7-day soft bars</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            Flex row of rounded bars, peach for past, peachDeep for max, today at 40% opacity. Day letters underneath.
          </div>
          <div className="ds-demo" style={{ alignItems: 'flex-end', height: 120 }}>
            {[{d:'M',v:28},{d:'T',v:14},{d:'W',v:62},{d:'T',v:41},{d:'F',v:88},{d:'S',v:106},{d:'S',v:19}].map((day, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 36 }}>
                <div style={{ width: '100%', height: Math.max(6, (day.v / 120) * 72), background: i === 5 ? pal.peachDeep : pal.peach, borderRadius: 8, opacity: i === 6 ? 0.4 : 1 }} />
                <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: pal.inkMuted, fontWeight: 600 }}>{day.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">Stacked category bar</div>
          <div className="ds-card-name" style={{ color: pal.ink }}>Where it went</div>
          <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
            12px tall stacked bar, 2px gap between slices, 4px radius per slice. Feeds into the full category list below.
          </div>
          <div className="ds-demo" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 20 }}>
            <div style={{ display: 'flex', height: 12, gap: 2, marginBottom: 14 }}>
              {[[32, pal.sage],[22, pal.peach],[18, pal.lavender],[14, pal.blueViolet],[14, pal.butter]].map(([f, c], i) => (
                <div key={i} style={{ flex: f, background: c, borderRadius: 4 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 11, color: pal.inkSoft, fontWeight: 600 }}>
              <span>Groceries 32%</span>
              <span>Coffee 22%</span>
              <span>Home 18%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 16 }}>
        <div className="ds-card">
          <div className="ds-card-title">Chip · pill</div>
          <div className="ds-demo" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Coffee','Groceries','Home','Transit','Joy'].map((c, i) => (
                <button key={i} style={{
                  padding: '8px 14px', borderRadius: 9999,
                  border: `1.5px solid ${i === 0 ? pal.ink : pal.line}`,
                  background: i === 0 ? pal.ink : pal.card, color: i === 0 ? pal.card : pal.ink,
                  fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">Delta badge</div>
          <div className="ds-demo" style={{ gap: 10 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, background: pal.sage + '55', color: pal.sageDeep, padding: '5px 10px', borderRadius: 12 }}>−18% ↓ vs last</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, background: pal.peach + '55', color: pal.peachDeep, padding: '5px 10px', borderRadius: 12 }}>+12% ↑ vs last</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, background: pal.butter + '55', color: pal.butterDeep, padding: '5px 10px', borderRadius: 12 }}>over by $5</div>
          </div>
        </div>

        <div className="ds-card">
          <div className="ds-card-title">Mood slider</div>
          <div className="ds-demo" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '20px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 10, color: pal.inkMuted, marginBottom: 6 }}>
              <span>heavy</span><span>tender</span><span>grounded</span>
            </div>
            <input type="range" min="0" max="100" defaultValue={70} style={{ width: '100%', accentColor: pal.peachDeep }} />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="ds-card" style={{ marginTop: 16 }}>
        <div className="ds-card-title">Tab bar · bottom nav</div>
        <div className="ds-card-name" style={{ color: pal.ink }}>4 tabs + centered FAB add</div>
        <div className="ds-card-desc" style={{ color: pal.inkSoft }}>
          Plush pill with 4 icon-label tabs. Center position is a peach orb button that lifts −18 above the bar and opens the &quot;add moment&quot; modal.
        </div>
        <div className="ds-demo" style={{ padding: 24 }}>
          <div style={{
            width: 360, background: pal.card, borderRadius: 28,
            boxShadow: theme.plushShadow, border: `1px solid ${pal.line}`,
            padding: '10px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          }}>
            {[{t:'Home',i:'home',a:true},{t:'Pockets',i:'jar'},{t:null,i:'plus',add:true},{t:'Budgets',i:'ring'},{t:'Journal',i:'heart'}].map((tab, i) => {
              if (tab.add) return (
                <button key={i} style={{
                  width: 52, height: 52, borderRadius: 26, border: 'none',
                  background: `radial-gradient(circle at 30% 30%, ${pal.peach}, ${pal.peachDeep})`,
                  boxShadow: `0 6px 16px ${pal.peachDeep}66, inset -2px -3px 6px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.4)`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -18,
                }}>{glyph('plus', 28, pal.ink)}</button>
              );
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, color: tab.a ? pal.ink : pal.inkMuted }}>
                  {glyph(tab.i, 22, tab.a ? pal.ink : pal.inkMuted)}
                  {tab.t}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </Section>
  );
}

// ─────────────────────────────────────────────
// WIDGETS
// ─────────────────────────────────────────────
function WidgetsSection() {
  const [, force] = useDS2(0);
  useDS2E(() => {
    const h = () => force(n => n + 1);
    window.addEventListener('themechange', h);
    return () => window.removeEventListener('themechange', h);
  }, []);
  const theme = themeForDemo();
  const pal = theme;

  const widgets = [
    { Comp: SafeToSpend, name: 'SafeToSpend', desc: 'The hero widget. Headline number with days-until-payday and voice-tuned serif quote.', size: 'large', span: 2 },
    { Comp: MoneyWeather, name: 'MoneyWeather', desc: 'Metaphorical weather read of the week. Blue wash, sun-behind-cloud illustration.', size: 'small', span: 1 },
    { Comp: MoodToday, name: 'MoodToday', desc: 'Check-in orb + label + italic quote from today\'s moment log.', size: 'medium', span: 2 },
    { Comp: AIInsight, name: 'AIInsight', desc: 'Lavender wash, sparkle badge, voice-tuned serif prose. Action pills for feedback.', size: 'large', span: 2 },
    { Comp: PocketsWidget, name: 'PocketsWidget', desc: 'Envelopes/subaccounts. 34px tile + name + amount + thin progress, tone-colored.', size: 'large', span: 2 },
    { Comp: WeekSpending, name: 'WeekSpending', desc: 'Sum + delta badge + 7-day bar chart.', size: 'medium', span: 2 },
    { Comp: CategoryBreakdown, name: 'CategoryBreakdown', desc: 'Stacked bar + list of categories with color tile + % share.', size: 'medium', span: 2 },
    { Comp: UpcomingBills, name: 'UpcomingBills', desc: 'Upcoming recurring charges, butter tiles, days-until + due date.', size: 'medium', span: 2 },
    { Comp: BudgetRings, name: 'BudgetRings', desc: 'Three rings, percent at center. Purely glanceable.', size: 'medium', span: 2 },
    { Comp: SavingsJar, name: 'SavingsJar', desc: 'Two jars side-by-side with liquid fill bars and pastel wash backgrounds.', size: 'medium', span: 2 },
    { Comp: RecentTxns, name: 'RecentTxns', desc: 'Scrolling list of transactions. Uses txn-row composed component.', size: 'large', span: 2 },
  ];

  return (
    <Section num="07 / WIDGETS" title="Dashboard widgets" sub="Each widget renders at small (1 col), medium, or large (2 col). All accept (theme, size, voice). Rendered at device scale.">
      <div className="ds-widgets-container">
        {widgets.map((w, i) => (
          <div key={i} className={w.span === 2 ? 'widget-col-2' : 'widget-col-1'}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: pal.inkSoft, marginBottom: 8 }}>
              {w.name}
              <span className="ds-size-tag">{w.size}</span>
            </div>
            <div className="ds-widget-wrap">
              <w.Comp theme={theme} size={w.size} voice="coach" />
            </div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 12.5, color: pal.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
              {w.desc}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
function App() {
  return (
    <div className="ds-page">
      <Hero />
      <ColorsSection />
      <TypeSection />
      <SpacingSection />
      <BrandSection />
      <AtomsSection />
      <ComposedSection />
      <WidgetsSection />

      <div style={{
        marginTop: 96, paddingTop: 40, borderTop: `1px solid rgba(58,46,38,0.12)`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 15, color: '#7A6A5F' }}>
          centsible design system · extracted from the prototype · v1.0
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#A89A8C' }}>
          tokens.jsx · widgets.jsx · pockets.jsx · screens.jsx
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
