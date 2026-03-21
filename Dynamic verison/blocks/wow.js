export default {
  label: '✨ Highlight / Wow',
  desc: 'Eye-catching feature showcase',
  defaults: () => ({
    badge: 'NEW UPDATE',
    badgeTextColor: '#ffffff',
    title: 'Meet Geometry Nodes 2.0',
    titleColor: '#ffffff',
    desc: 'A completely rewritten computational framework that gives you full node-based control over the asset generation pipeline.',
    descColor: '#cbd5e1',
    theme: 'neon-blue',
    layout: 'center-stacked',
    showEmoji: true,
    emoji: '✨',
    baseSurfaceStyle: 'margin:0 0 18px 0;',
    style: ''
  }),
  render: (p, { html, attr, mergeSurfaceStyle }) => {
    const themes = {
      'neon-blue': { bg: '#0b0f19', border: '2px solid #2563eb', shadow: '0 0 40px rgba(37,99,235,0.25)', text: '#eff6ff', badgeBg: '#2563eb', badgeText: '#ffffff', glow: 'rgba(37,99,235,0.15)' },
      'cyber-pink': { bg: '#180910', border: '2px solid #ec4899', shadow: '0 0 40px rgba(236,72,153,0.25)', text: '#fdf2f8', badgeBg: '#ec4899', badgeText: '#ffffff', glow: 'rgba(236,72,153,0.15)' },
      'blender-orange': { bg: '#1c130d', border: '2px solid #ea580c', shadow: '0 0 40px rgba(234,88,12,0.25)', text: '#fff7ed', badgeBg: '#ea580c', badgeText: '#ffffff', glow: 'rgba(234,88,12,0.15)' },
      'emerald-glow': { bg: '#062016', border: '2px solid #10b981', shadow: '0 0 40px rgba(16,185,129,0.25)', text: '#ecfdf5', badgeBg: '#10b981', badgeText: '#ffffff', glow: 'rgba(16,185,129,0.15)' },
      'royal-purple': { bg: '#1c102a', border: '2px solid #8b5cf6', shadow: '0 0 40px rgba(139,92,246,0.25)', text: '#f5f3ff', badgeBg: '#8b5cf6', badgeText: '#ffffff', glow: 'rgba(139,92,246,0.15)' },
      'solar-flare': { bg: '#2b1b08', border: '2px solid #f59e0b', shadow: '0 0 40px rgba(245,158,11,0.25)', text: '#fffbeb', badgeBg: '#f59e0b', badgeText: '#111111', glow: 'rgba(245,158,11,0.15)' },
      'glitch-matrix': { bg: '#020617', border: '2px solid #22c55e', shadow: '0 0 40px rgba(34,197,94,0.25)', text: '#f0fdf4', badgeBg: '#22c55e', badgeText: '#000000', glow: 'rgba(34,197,94,0.15)' },
      'midnight-slate': { bg: '#1e293b', border: '2px solid #475569', shadow: '0 10px 40px rgba(0,0,0,0.5)', text: '#f8fafc', badgeBg: '#3b82f6', badgeText: '#ffffff', glow: 'rgba(59,130,246,0.15)' },
      'glass-light': { bg: '#ffffff', border: '2px solid #e5e7eb', shadow: '0 10px 30px rgba(0,0,0,0.05)', text: '#111827', badgeBg: '#f3f4f6', badgeText: '#374151', glow: 'rgba(0,0,0,0.05)' }
    };
    const t = themes[p.theme] || themes['neon-blue'];
    const layout = p.layout || 'center-stacked';
    const bColor = p.badgeTextColor || t.badgeText || '#ffffff';
    const tColor = p.titleColor || t.text || '#ffffff';
    const dColor = p.descColor || t.text || '#ffffff';
    const showEmoji = p.showEmoji !== false;
    const emoji = p.emoji || '✨';

    // Sparkle icon logic
    const iconHtml = showEmoji ? `
      <div style="margin-top:32px; display:flex; justify-content:inherit;">
        <div style="width:120px; height:120px; border-radius:50%; background:radial-gradient(circle, ${t.badgeBg} 0%, transparent 70%); display:flex; align-items:center; justify-content:center; position:relative; box-shadow:0 0 30px ${t.glow};">
          <div style="width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:40px;">
            ${html(emoji)}
          </div>
        </div>
      </div>` : '';

    let innerHtml = '';
    if (layout === 'center-stacked') {
      innerHtml = `
          <div style="position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; text-align:center;">
            <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${bColor}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;">${html(p.badge)}</span>
            <h2 style="margin:0 0 16px 0; font-size:42px; font-weight:900; line-height:1.1; letter-spacing:-0.03em; color:${tColor};">${html(p.title)}</h2>
            <p style="margin:0 auto; font-size:18px; line-height:1.6; max-width:580px; opacity:0.8; color:${dColor};">${html(p.desc)}</p>
            ${iconHtml}
          </div>`;
    } else if (layout === 'left-aligned') {
      innerHtml = `
          <div style="position:relative; z-index:1; display:flex; flex-direction:column; align-items:flex-start; text-align:left;">
            <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${bColor}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;">${html(p.badge)}</span>
            <h2 style="margin:0 0 16px 0; font-size:42px; font-weight:900; line-height:1.1; letter-spacing:-0.03em; color:${tColor};">${html(p.title)}</h2>
            <p style="margin:0; font-size:18px; line-height:1.6; max-width:580px; opacity:0.8; color:${dColor};">${html(p.desc)}</p>
            <div style="width:100%; display:flex; justify-content:flex-start; transform: translateX(-10px);">${iconHtml}</div>
          </div>`;
    } else if (layout === 'right-aligned') {
      innerHtml = `
          <div style="position:relative; z-index:1; display:flex; flex-direction:column; align-items:flex-end; text-align:right;">
            <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${bColor}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;">${html(p.badge)}</span>
            <h2 style="margin:0 0 16px 0; font-size:42px; font-weight:900; line-height:1.1; letter-spacing:-0.03em; color:${tColor};">${html(p.title)}</h2>
            <p style="margin:0; font-size:18px; line-height:1.6; max-width:580px; opacity:0.8; color:${dColor};">${html(p.desc)}</p>
            <div style="width:100%; display:flex; justify-content:flex-end; transform: translateX(10px);">${iconHtml}</div>
          </div>`;
    } else if (layout === 'split-row') {
      innerHtml = `
          <div style="position:relative; z-index:1; display:flex; flex-direction:row; align-items:center; text-align:left; flex-wrap:wrap; gap:48px;">
            <div style="flex:1.2; min-width:320px; align-self:center;">
              <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${bColor}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;">${html(p.badge)}</span>
              <h2 style="margin:0; font-size:42px; font-weight:900; line-height:1.1; letter-spacing:-0.03em; color:${tColor};">${html(p.title)}</h2>
            </div>
            <div style="flex:1; min-width:320px;">
              <p style="margin:0; font-size:18px; line-height:1.6; opacity:0.8; color:${dColor};">${html(p.desc)}</p>
              <div style="width:100%; display:flex; justify-content:flex-start;">${iconHtml}</div>
            </div>
          </div>`;
    }

    let glowAlign = (layout === 'center-stacked') ? 'left:50%; transform:translate(-50%, -50%);' : 
                   (layout === 'left-aligned' || layout === 'split-row') ? 'left:-50px; transform:translateY(-50%);' : 
                   'right:-50px; transform:translateY(-50%);';

    // Surface styles
    const surfaceStyle = mergeSurfaceStyle(p);
    
    return `
    <div class="block" data-type="wow">
      <div data-surface="1" style="${attr(surfaceStyle)}">
        <div style="border-radius:32px; padding:64px 48px; background:${t.bg}; border:${t.border}; box-shadow:${t.shadow}; color:${t.text}; position:relative; overflow:hidden;">
          <!-- Subtle backdrop glow -->
          <div style="position:absolute; top:50%; ${glowAlign} width:600px; height:600px; background:${t.badgeBg}; filter:blur(150px); opacity:0.1; border-radius:50%; pointer-events:none;"></div>
          ${innerHtml}
        </div>
      </div>
    </div>`;
  }
};
