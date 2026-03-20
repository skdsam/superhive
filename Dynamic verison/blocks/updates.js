export default {
  label: '🆕 Release Updates',
  desc: 'Version notes list',
  defaults: () => ({
    items: [
      { v:'v1.0.8', notes:['Improved light analysis algorithm','New "Warmth" setting for light temperature','UI performance optimisations'] },
      { v:'v1.0.7', notes:['Added Cycles light grouping','Fixed world background sync bug'] },
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="updates">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
          <span style="background:#eaf0ff;color:#2a3566;padding:2px 8px;border-radius:6px;font-size:11px;">UPDATES</span>
          <span>Recent Improvements</span>
        </div>
        ${p.items.map(it=>`
          <div style="display:flex;margin-bottom:14px;">
            <div style="flex:0 0 70px;font-weight:700;color:#2a3566;font-size:13px;">${html(it.v)}</div>
            <ul style="margin:0;padding-left:14px;font-size:13px;color:#5a6286;">
              ${(it.notes||[]).map(n=>`<li>${html(n)}</li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
    </div>`,
  inspector: (f, p, render, { field, textarea, addCountControls, ensureLength }) => {
    addCountControls(f, 'Versions', p.items.length, (n)=>{
      p.items = ensureLength(p.items, n, ()=>({v:'1.0.x', notes:['Note']}));
      render();
    });
    p.items.forEach((it,idx)=>{
      f.appendChild(field(`Version ${idx+1}`,'text',it.v,(v)=>{ it.v=v; render(); }));
      f.appendChild(textarea(`Notes ${idx+1}`,(it.notes||[]).join('\n'),(v)=>{ it.notes=v.split(/\n+/).filter(Boolean); render(); }));
    });
  }
};
