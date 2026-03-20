export default {
  label: '⏺️ Simple Bullets',
  desc: 'Side-by-side icon list',
  defaults: () => ({
    title:'Included in this Addon',
    bullets:[
      'Palette Extraction (JPG, PNG, GIF)',
      'Variable Light Selection',
      'Kelvin Temperature Controls',
      'World Background Syncing',
      'Cycles & Eevee Support'
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;background:#f6f7fb;border:1px solid #e2e6f4;border-radius:14px;padding:16px;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="bullets">
      <div class="sh-card-soft" data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="font-weight:700;margin-bottom:8px;">${html(p.title)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px 16px;font-size:13px;color:#394067;">
          ${p.bullets.map(b=>`<div><span style="color:#2a3566;margin-right:4px;">✔</span>${html(b)}</div>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, textarea }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Bullets', p.bullets.join('\n'),(v)=>{ p.bullets=v.split(/\n+/).filter(Boolean); render(); }));
  }
};
