export default {
  label: '🔥 Wow Factor Section',
  desc: 'High-impact headline with glow',
  defaults: () => ({
    badge: 'NEW RELEASE',
    title: 'The Future of Lighting',
    desc: 'Powered by advanced colour-extraction algorithms. Perfect for cinematic look-dev.',
    theme: 'neon-blue',
    layout: 'center-stacked',
    baseSurfaceStyle: 'margin:0 0 32px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const themes = {
      'neon-blue':     '--wow-acc:#3b82f6; --wow-bg:rgba(59,130,246,0.05);',
      'cyber-pink' :   '--wow-acc:#ec4899; --wow-bg:rgba(236,72,153,0.05);',
      'blender-orange':'--wow-acc:#ed8936; --wow-bg:rgba(237,137,54,0.05);',
      'emerald-glow':  '--wow-acc:#10b981; --wow-bg:rgba(16,185,129,0.05);',
      'royal-purple':  '--wow-acc:#8b5cf6; --wow-bg:rgba(139,92,246,0.05);',
      'solar-flare':   '--wow-acc:#f59e0b; --wow-bg:rgba(245,158,11,0.05);',
      'glitch-matrix':  '--wow-acc:#22c55e; --wow-bg:rgba(34,197,94,0.05);',
      'midnight-slate': '--wow-acc:#64748b; --wow-bg:rgba(100,116,139,0.05);',
      'glass-light':    '--wow-acc:#ffffff; --wow-bg:rgba(255,255,255,0.1);'
    };
    const t = themes[p.theme] || themes['neon-blue'];
    const isLeft = p.layout === 'left-aligned';
    const isSplit = p.layout === 'split-row';

    return `
    <div class="block" data-type="wow" style="${t}">
      <div data-surface="1" style="position:relative; border-radius:32px; padding:60px 40px; overflow:hidden; background:var(--wow-bg); border:1px solid rgba(255,255,255,0.1); ${mergeSurfaceStyle(p)}">
        <div style="position:absolute; top:-100px; left:-100px; width:300px; height:300px; background:var(--wow-acc); filter:blur(120px); opacity:0.15; pointer-events:none;"></div>
        <div style="position:relative; z-index:2; display:flex; flex-direction:${isSplit?'row':'column'}; align-items:${isLeft?'flex-start':'center'}; text-align:${isLeft?'left':'center'}; gap:24px; flex-wrap:wrap;">
          <div style="flex:1; min-width:300px;">
            <div style="display:inline-block; padding:6px 14px; border-radius:99px; background:rgba(255,255,255,0.05); border:1px solid var(--wow-acc); color:var(--wow-acc); font-size:12px; font-weight:800; letter-spacing:1px; margin-bottom:20px; text-transform:uppercase;">${html(p.badge)}</div>
            <h2 style="font-size:clamp(32px, 5vw, 56px); font-weight:900; line-height:1.1; margin:0 0 20px 0; color:#fff;">${html(p.title)}</h2>
            <p style="font-size:18px; color:rgba(255,255,255,0.7); max-width:600px; margin:${isLeft?'0':'0 auto'}; line-height:1.6;">${html(p.desc)}</p>
          </div>
          ${isSplit ? `<div style="flex:0 0 200px; display:flex; align-items:center; justify-content:center;"><div style="width:120px; height:120px; border-radius:50%; border:2px solid var(--wow-acc); box-shadow:0 0 40px var(--wow-acc); display:flex; align-items:center; justify-content:center; color:var(--wow-acc); font-size:40px;">✨</div></div>` : ''}
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, textarea }) => {
    f.appendChild(field('Badge Text','text',p.badge,(v)=>{ p.badge=v; render(); }));
    f.appendChild(field('Headline','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Description',p.desc,(v)=>{ p.desc=v; render(); }));
    
    const themeWrap = document.createElement('div'); themeWrap.className='field';
    themeWrap.innerHTML = `<label>Wow Theme</label><select>
      <option value="neon-blue" ${p.theme==='neon-blue'?'selected':''}>Neon Blue</option>
      <option value="cyber-pink" ${p.theme==='cyber-pink'?'selected':''}>Cyber Pink</option>
      <option value="blender-orange" ${p.theme==='blender-orange'?'selected':''}>Blender Orange</option>
      <option value="emerald-glow" ${p.theme==='emerald-glow'?'selected':''}>Emerald Glow</option>
      <option value="royal-purple" ${p.theme==='royal-purple'?'selected':''}>Royal Purple</option>
      <option value="solar-flare" ${p.theme==='solar-flare'?'selected':''}>Solar Flare</option>
      <option value="glitch-matrix" ${p.theme==='glitch-matrix'?'selected':''}>Glitch Matrix</option>
      <option value="midnight-slate" ${p.theme==='midnight-slate'?'selected':''}>Midnight Slate</option>
      <option value="glass-light" ${p.theme==='glass-light'?'selected':''}>Glass Light</option>
    </select>`;
    themeWrap.querySelector('select').onchange = (e)=>{ p.theme = e.target.value; render(); };
    f.appendChild(themeWrap);

    const layoutWrap = document.createElement('div'); layoutWrap.className='field';
    layoutWrap.innerHTML = `<label>Layout Style</label><select>
      <option value="center-stacked" ${p.layout==='center-stacked'?'selected':''}>Center Stacked</option>
      <option value="left-aligned" ${p.layout==='left-aligned'?'selected':''}>Left Aligned</option>
      <option value="split-row" ${p.layout==='split-row'?'selected':''}>Split Row</option>
    </select>`;
    layoutWrap.querySelector('select').onchange = (e)=>{ p.layout = e.target.value; render(); };
    f.appendChild(layoutWrap);
  }
};
