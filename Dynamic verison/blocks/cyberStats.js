export default {
  label: '🌐 Cyber Stats',
  desc: 'Animated numbers with accent',
  defaults: () => ({
    accent: '#00f2ff',
    stats: [
      { val:'400%', label:'Efficiency Boost' },
      { val:'10k+', label:'Active Users' },
      { val:'0.2s',  label:'Response Time' }
    ],
    baseSurfaceStyle: 'margin:48px 0; padding:40px; background:#020617; border:1px solid rgba(0,242,255,0.2); border-radius:24px;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="cyberStats">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:40px; text-align:center;">
          ${p.stats.map(s=>`
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="font-size:48px; font-weight:900; color:${attr(p.accent)}; text-shadow:0 0 20px ${attr(p.accent)}66;">${html(s.val)}</div>
              <div style="font-size:14px; text-transform:uppercase; letter-spacing:2px; color:#64748b; font-weight:700;">${html(s.label)}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Accent Color','text',p.accent,(v)=>{ p.accent=v; render(); }));
    f.appendChild(arrayEditor('Stats', ['val','label'], p.stats, (a)=>{ p.stats=a; render(); }));
  }
};
