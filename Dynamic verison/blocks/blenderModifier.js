export default {
  label: '🔧 Blender Modifier',
  desc: 'Mimics the Properties Panel',
  defaults: () => ({
    title: 'Modifiers',
    items: [
      { name:'Subdivision', icon:'⬡', active:'true', expanded:'false', details:['Levels: 2', 'Render: 3'] },
      { name:'Superhive Generator', icon:'✨', active:'true', expanded:'true', details:['Seed: 42', 'Density: High'] },
      { name:'Displace', icon:'🌊', active:'false', expanded:'false', details:['Strength: 0.5'] }
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:60px 24px; background:#e5e7eb; border-radius:16px; display:flex; justify-content:center;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const mods = p.items.map(m => `
      <div style="background:#424242; border:1px solid #222; border-radius:4px; margin-bottom:6px; overflow:hidden; font-family:sans-serif; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <div style="display:flex; justify-content:space-between; padding:6px 8px; font-size:12px; font-weight:600; background:linear-gradient(to bottom, #505050, #424242);">
          <div style="display:flex; gap:6px; align-items:center;">
            <span style="opacity:0.7; font-size:10px;">${m.expanded==='true'?'▼':'▶'}</span>
            <span>${html(m.icon)}</span>
            <span style="color:#fff;">${html(m.name)}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; opacity:0.8;">
            <span style="color:${m.active==='true'?'#3b82f6':'#aaa'};">💻</span><span>📷</span><span>✖</span>
          </div>
        </div>
        ${m.expanded==='true' ? `
        <div style="padding:12px; background:#333; font-size:12px; color:#aaa; border-top:1px solid #222;">
          ${(m.details||[]).map(d=> {
            const [k,v] = d.split(':');
            return `<div style="display:flex; justify-content:space-between; margin-bottom:8px; align-items:center;">
              <span>${html(k)}</span>
              <span style="background:#222; padding:4px 24px; border-radius:4px; border:1px solid #111; color:#fff;">${html(v||'')}</span>
            </div>`;
          }).join('')}
        </div>` : ''}
      </div>
    `).join('');
    return `
    <div class="block" data-type="blenderModifier">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <div style="width:100%; max-width:340px; background:#303030; color:#cccccc; font-family:sans-serif; border-radius:8px; overflow:hidden; border:1px solid #111; box-shadow:0 20px 40px rgba(0,0,0,0.4);">
          <div style="background:#282828; padding:10px 12px; font-size:13px; font-weight:700; border-bottom:1px solid #111; display:flex; gap:8px; align-items:center;">
             <span style="color:#38bdf8;">🔧</span><span>${html(p.title)}</span><span style="margin-left:auto; opacity:0.5;">▼</span>
          </div>
          <div style="padding:10px;">
             ${mods}
             <div style="margin-top:8px; padding:6px; text-align:center; font-size:12px; background:#3d3d3d; border:1px solid #222; border-radius:4px; cursor:pointer;">Add Modifier ⌄</div>
          </div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Panel Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Modifiers', ['name','icon','active','expanded','details'], p.items, (a)=>{ p.items=a; render(); }));
  }
};
