// dashboard.jsx — Home screen with configurable widgets
// Widgets are in a grid: 2 cols. Small = 1x1, Medium = 2x1, Large = 2x2.
// Long-press (or "edit" button) enters configure mode → drag to reorder, tap to resize, tap + to add.

const { useState: useD, useRef: useRef_D } = React;

// Available widgets registry
const WIDGET_REGISTRY = {
  safeToSpend:  { comp: 'SafeToSpend',  label: 'Safe to Spend',     defaultSize: 'large',  allowedSizes: ['medium', 'large'] },
  pockets:      { comp: 'PocketsWidget',label: 'Pockets',           defaultSize: 'large',  allowedSizes: ['medium', 'large'] },
  mood:         { comp: 'MoodToday',    label: 'Today\'s Mood',     defaultSize: 'medium', allowedSizes: ['small', 'medium'] },
  week:         { comp: 'WeekSpending', label: 'This Week',         defaultSize: 'medium', allowedSizes: ['medium', 'large'] },
  category:     { comp: 'CategoryBreakdown', label: 'Where It Went', defaultSize: 'medium', allowedSizes: ['medium', 'large'] },
  recent:       { comp: 'RecentTxns',   label: 'Recent',            defaultSize: 'large',  allowedSizes: ['medium', 'large'] },
  ai:           { comp: 'AIInsight',    label: 'AI Insight',        defaultSize: 'medium', allowedSizes: ['medium', 'large'] },
  rings:        { comp: 'BudgetRings',  label: 'Budget Rings',      defaultSize: 'medium', allowedSizes: ['medium'] },
  bills:        { comp: 'UpcomingBills', label: 'Upcoming Bills',   defaultSize: 'medium', allowedSizes: ['small', 'medium'] },
  jar:          { comp: 'SavingsJar',   label: 'Savings Jars',      defaultSize: 'medium', allowedSizes: ['medium', 'large'] },
  weather:      { comp: 'MoneyWeather', label: 'Money Weather',     defaultSize: 'small',  allowedSizes: ['small', 'medium'] },
};

// Default layout — carefully chosen order
const DEFAULT_LAYOUT = [
  { id: 'safeToSpend', size: 'large' },
  { id: 'weather',     size: 'small' },
  { id: 'mood',        size: 'small' },
  { id: 'ai',          size: 'large' },
  { id: 'pockets',     size: 'large' },
  { id: 'week',        size: 'medium' },
  { id: 'category',    size: 'medium' },
  { id: 'bills',       size: 'medium' },
  { id: 'rings',       size: 'medium' },
  { id: 'jar',         size: 'large' },
  { id: 'recent',      size: 'large' },
];

function Dashboard({ theme, voice, layout, setLayout, editMode, setEditMode, onOpenSummary }) {
  const [dragIdx, setDragIdx] = useD(null);
  const [dragOverIdx, setDragOverIdx] = useD(null);
  const touchState = useRef_D(null);

  const startDrag = (idx) => (e) => {
    if (!editMode) return;
    setDragIdx(idx);
    if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text', ''); }
  };
  const dragOver = (idx) => (e) => { e.preventDefault(); setDragOverIdx(idx); };
  const drop = (idx) => (e) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const next = [...layout];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setLayout(next);
    setDragIdx(null); setDragOverIdx(null);
  };

  const cycleSize = (idx) => {
    const w = layout[idx];
    const allowed = WIDGET_REGISTRY[w.id].allowedSizes;
    const i = allowed.indexOf(w.size);
    const nextSize = allowed[(i + 1) % allowed.length];
    const next = [...layout];
    next[idx] = { ...w, size: nextSize };
    setLayout(next);
  };

  const remove = (idx) => {
    const next = layout.filter((_, i) => i !== idx);
    setLayout(next);
  };

  const addWidget = (id) => {
    const reg = WIDGET_REGISTRY[id];
    setLayout([...layout, { id, size: reg.defaultSize }]);
  };

  // Render widget by id + size
  const renderWidget = (w, i) => {
    const reg = WIDGET_REGISTRY[w.id];
    if (!reg) return null;
    const Comp = window[reg.comp];
    if (!Comp) return null;

    const colSpan = w.size === 'small' ? 1 : 2;
    const isBeingDragged = dragIdx === i;
    const isDropTarget = dragOverIdx === i && dragIdx !== null && dragIdx !== i;

    return (
      <div
        key={`${w.id}-${i}`}
        draggable={editMode}
        onDragStart={startDrag(i)}
        onDragOver={dragOver(i)}
        onDrop={drop(i)}
        onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
        style={{
          gridColumn: `span ${colSpan}`,
          position: 'relative',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          opacity: isBeingDragged ? 0.4 : 1,
          transform: isDropTarget ? 'translateY(-4px)' : editMode ? 'scale(0.985)' : 'scale(1)',
          animation: editMode ? 'wiggle 0.4s ease-in-out infinite alternate' : 'none',
          animationDelay: `${(i % 3) * 0.1}s`,
        }}
      >
        <Comp theme={theme} size={w.size} voice={voice} />
        {editMode && (
          <>
            {/* remove button */}
            <button onClick={() => remove(i)} style={{
              position: 'absolute', top: -8, left: -8, width: 26, height: 26, borderRadius: 13,
              background: theme.ink, color: theme.card, border: `2px solid ${theme.bg}`,
              fontSize: 18, lineHeight: '22px', fontWeight: 600, cursor: 'pointer', zIndex: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}>−</button>
            {/* size badge */}
            {reg.allowedSizes.length > 1 && (
              <button onClick={() => cycleSize(i)} style={{
                position: 'absolute', top: -8, right: -8,
                padding: '4px 10px', borderRadius: 12,
                background: theme.lavenderDeep, color: '#fff',
                fontFamily: FONTS.sans, fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                textTransform: 'uppercase',
                border: `2px solid ${theme.bg}`, cursor: 'pointer', zIndex: 2,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}>{w.size}</button>
            )}
          </>
        )}
      </div>
    );
  };

  const notInLayout = Object.keys(WIDGET_REGISTRY).filter(id => !layout.find(w => w.id === id));

  return (
    <div style={{ padding: '8px 20px 140px' }}>
      {/* greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 4 }}>
            Tuesday afternoon
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 30, fontWeight: 500, color: theme.ink, lineHeight: 1.1 }}>
            Hey, Rima.<br/>
            <span style={{ fontStyle: 'italic', opacity: 0.7 }}>nice to see you.</span>
          </div>
        </div>
        <button onClick={() => setEditMode(!editMode)} style={{
          padding: '8px 14px', borderRadius: 9999,
          background: editMode ? theme.ink : theme.card,
          color: editMode ? theme.card : theme.ink,
          border: `1px solid ${theme.line}`,
          fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          boxShadow: theme.plushShadow,
          flexShrink: 0, marginTop: 4,
        }}>
          {editMode ? 'done' : 'edit'}
        </button>
      </div>

      {/* week-summary invitation pill */}
      {!editMode && (
        <div onClick={onOpenSummary} style={{
          background: theme.washLavender, borderRadius: 22, padding: '14px 18px',
          marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          boxShadow: theme.plushShadow, border: `1px solid ${theme.line}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: theme.lavenderDeep,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{glyph('sparkle', 20, '#fff')}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 16, fontWeight: 500, color: theme.ink, lineHeight: 1.3 }}>
              Your weekly money mood is ready
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: theme.inkSoft }}>5 short chapters · ~2 min</div>
          </div>
          <div style={{ fontSize: 20, color: theme.inkSoft }}>›</div>
        </div>
      )}

      {/* grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        {layout.map(renderWidget)}
      </div>

      {/* add more, in edit mode */}
      {editMode && notInLayout.length > 0 && (
        <div style={{
          marginTop: 20, background: theme.card, borderRadius: 24, padding: 18,
          border: `1.5px dashed ${theme.line}`,
        }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 12 }}>
            Add a widget
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {notInLayout.map(id => (
              <button key={id} onClick={() => addWidget(id)} style={{
                padding: '9px 14px', borderRadius: 9999,
                background: theme.bgDeep, color: theme.ink,
                border: `1px solid ${theme.line}`,
                fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ color: theme.peachDeep, fontSize: 16, lineHeight: '12px' }}>+</span>
                {WIDGET_REGISTRY[id].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {editMode && (
        <div style={{
          marginTop: 14, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13,
          color: theme.inkSoft, textAlign: 'center', opacity: 0.8,
        }}>
          drag to reorder · tap size badge to resize · − to remove
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Dashboard, WIDGET_REGISTRY, DEFAULT_LAYOUT });
