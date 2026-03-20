export default {
  label: '📋 Technical Specs',
  desc: 'Key-value table',
  defaults: () => ({
    title: 'Compatibility & Requirements',
    rows:[
      { label:'Blender Version', val:'3.6, 4.0, 4.1, 4.2 LTS' },
      { label:'Render Engine', val:'Cycles & Eevee' },
      { label:'OS',            val:'Windows, macOS, Linux' },
      { label:'License',       val:'GPL Personal / Commercial' }
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="specs">
      <div class="sh-card" data-surface="1" style="background:#fff; ${mergeSurfaceStyle(p)}">
        <h3 style="margin:0 0 16px 0; font-size:18px;">${html(p.title)}</h3>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${p.rows.map(r=>`
            <div style="display:flex; justify-content:space-between; font-size:14px; padding-bottom:8px; border-bottom:1px solid #f3f4f6;">
              <span style="color:#64748b; font-weight:500;">${html(r.label)}</span>
              <span style="font-weight:700; color:#1e293b;">${html(r.val)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Rows', ['label','val'], p.rows, (a)=>{ p.rows=a; render(); }));
  }
};
