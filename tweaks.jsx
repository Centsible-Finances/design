// tweaks.jsx — Tweaks floating panel for Centsible

const { useState: useT } = React;

function TweaksPanel({ tweaks, setTweaks, onClose }) {
  const palettes = [
    { id: 'peach',    label: 'Peach',    sw: ['#FBF4EC', '#F4C7A8', '#CBBFE3'] },
    { id: 'sage',     label: 'Sage',     sw: ['#F3F1E8', '#A8C79C', '#C8BDE0'] },
    { id: 'lavender', label: 'Lavender', sw: ['#F4EFF5', '#C9BDE2', '#F1C3A5'] },
  ];
  const densities = ['cozy', 'standard', 'compact'];
  const voices = [
    { id: 'friend', label: 'best friend' },
    { id: 'observer', label: 'quiet observer' },
    { id: 'coach', label: 'warm coach' },
  ];

  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  const theme = getPalette(tweaks.palette, tweaks.dark);

  const section = (title, body) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 800,
        letterSpacing: 1.2, textTransform: 'uppercase', color: theme.inkMuted, marginBottom: 8,
      }}>{title}</div>
      {body}
    </div>
  );

  return (
    <div style={{
      position: 'absolute', bottom: 20, right: 12, left: 12, zIndex: 200,
      background: theme.card,
      borderRadius: 28,
      border: `1px solid ${theme.line}`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)',
      padding: 18, maxHeight: '80%', overflow: 'auto',
      fontFamily: '"Nunito", sans-serif',
      animation: 'slideUp 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: '"Newsreader", serif', fontSize: 20, fontWeight: 500, color: theme.ink }}>
          Tweaks
        </div>
        <button onClick={onClose} style={{
          width: 28, height: 28, borderRadius: 14, border: 'none',
          background: theme.bgDeep, cursor: 'pointer',
          color: theme.inkSoft, fontSize: 14,
        }}>×</button>
      </div>

      {/* Palette */}
      {section('palette',
        <div style={{ display: 'flex', gap: 8 }}>
          {palettes.map(p => (
            <button key={p.id} onClick={() => update('palette', p.id)} style={{
              flex: 1, padding: 10, borderRadius: 16, cursor: 'pointer',
              border: `2px solid ${tweaks.palette === p.id ? theme.ink : theme.line}`,
              background: p.sw[0],
            }}>
              <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 5 }}>
                {p.sw.map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{p.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Density */}
      {section('density',
        <div style={{ display: 'flex', background: theme.bgDeep, borderRadius: 12, padding: 3 }}>
          {densities.map(d => (
            <button key={d} onClick={() => update('density', d)} style={{
              flex: 1, padding: '8px 10px', borderRadius: 9, border: 'none',
              background: tweaks.density === d ? theme.card : 'transparent',
              color: theme.ink, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: tweaks.density === d ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              textTransform: 'capitalize',
            }}>{d}</button>
          ))}
        </div>
      )}

      {/* Roundness */}
      {section(`roundness · ${tweaks.roundness}px`,
        <input type="range" min="12" max="36" step="2"
          value={tweaks.roundness} onChange={e => update('roundness', parseInt(e.target.value))}
          style={{ width: '100%', accentColor: theme.peachDeep }}
        />
      )}

      {/* Shadow plushness */}
      {section(`shadow plushness · ${Math.round(tweaks.plush * 100)}%`,
        <input type="range" min="0" max="1.5" step="0.05"
          value={tweaks.plush} onChange={e => update('plush', parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: theme.peachDeep }}
        />
      )}

      {/* AI voice */}
      {section('ai voice',
        <div style={{ display: 'flex', gap: 6 }}>
          {voices.map(v => (
            <button key={v.id} onClick={() => update('voice', v.id)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 12, cursor: 'pointer',
              border: `1.5px solid ${tweaks.voice === v.id ? theme.lavenderDeep : theme.line}`,
              background: tweaks.voice === v.id ? theme.washLavender : 'transparent',
              color: theme.ink, fontSize: 11, fontWeight: 700,
            }}>{v.label}</button>
          ))}
        </div>
      )}

      {/* Dark mode */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderRadius: 14, background: theme.bgDeep,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.ink }}>Dark mode</div>
        <button onClick={() => update('dark', !tweaks.dark)} style={{
          width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: tweaks.dark ? theme.sageDeep : theme.inkMuted + '99',
          position: 'relative', padding: 0,
        }}>
          <div style={{
            position: 'absolute', top: 2, left: tweaks.dark ? 20 : 2,
            width: 22, height: 22, borderRadius: 11, background: '#fff',
            transition: 'left 0.22s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel });
