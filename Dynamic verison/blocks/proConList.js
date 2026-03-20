export default {
  label: '🚦 Old Way vs Addon',
  desc: 'Compare manual vs automated',
  defaults: () => ({
    title: 'Stop Wasting Time',
    oldTitle: 'The Old Way',
    oldDesc: 'Hours of tedious manual work',
    oldItems: ['Manually unwrap UVs', 'Bake textures map by map', 'Guess lighting values', 'Wait for slow renders'],
    newTitle: 'The Superhive Way',
    newDesc: 'Results in 30 seconds',
    newItems: ['1-Click Smart UVs', 'Auto-bake all channels', 'Procedural sky lighting', 'Real-time Eevee previews'],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:24px;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const olds = p.oldItems.map(i=>`<li style="margin-bottom:12px; display:flex; align-items:flex-start; gap:12px;"><div style="width:20px;height:20px;background:#fef2f2;color:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;margin-top:2px;">✕</div> <span style="opacity:0.8;">${html(i)}</span></li>`).join('');
    const news = p.newItems.map(i=>`<li style="margin-bottom:12px; display:flex; align-items:flex-start; gap:12px;"><div style="width:20px;height:20px;background:#10b981;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;margin-top:2px;box-shadow:0 0 10px rgba(16,185,129,0.4);">✓</div> <span style="font-weight:500;">${html(i)}</span></li>`).join('');
    return `
    <div class="block" data-type="proConList">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 32px 0;">${html(p.title)}</h2>
        <div style="display:flex; flex-wrap:wrap; gap:24px;">
          <div style="flex:1; min-width:280px; background:#fafafa; border:1px solid #f3f4f6; border-radius:24px; padding:32px;">
            <h3 style="margin:0 0 8px 0; font-size:22px; color:#6b7280; font-weight:700;">${html(p.oldTitle)}</h3>
            <p style="margin:0 0 24px 0; color:#9ca3af; font-size:15px;">${html(p.oldDesc)}</p>
            <ul style="list-style:none; padding:0; margin:0; color:#4b5563;">${olds}</ul>
          </div>
          <div style="flex:1; min-width:280px; background:#ecfdf5; border:1px solid #10b981; border-radius:24px; padding:32px; position:relative; box-shadow:0 20px 25px -5px rgba(16,185,129,0.1);">
            <div style="position:absolute; top:-12px; right:32px; background:#10b981; color:#fff; font-size:12px; font-weight:800; padding:4px 12px; border-radius:99px; letter-spacing:1px; text-transform:uppercase;">Recommended</div>
            <h3 style="margin:0 0 8px 0; font-size:22px; color:#065f46; font-weight:800;">${html(p.newTitle)}</h3>
            <p style="margin:0 0 24px 0; color:#059669; font-size:15px;">${html(p.newDesc)}</p>
            <ul style="list-style:none; padding:0; margin:0; color:#064e3b;">${news}</ul>
          </div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, textarea }) => {
    f.appendChild(field('Main Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Old Title','text',p.oldTitle,(v)=>{ p.oldTitle=v; render(); }));
    f.appendChild(textarea('Old Desc',p.oldDesc,(v)=>{ p.oldDesc=v; render(); }));
    f.appendChild(textarea('Old Items (comma separated)',p.oldItems.join(', '),(v)=>{ p.oldItems=v.split(',').map(s=>s.trim()); render(); }));
    f.appendChild(field('New Title','text',p.newTitle,(v)=>{ p.newTitle=v; render(); }));
    f.appendChild(textarea('New Desc',p.newDesc,(v)=>{ p.newDesc=v; render(); }));
    f.appendChild(textarea('New Items (comma separated)',p.newItems.join(', '),(v)=>{ p.newItems=v.split(',').map(s=>s.trim()); render(); }));
  }
};
