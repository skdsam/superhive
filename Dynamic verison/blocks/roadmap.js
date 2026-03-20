export default {
  label: '🗺️ Product Roadmap',
  desc: 'Timeline of updates',
  defaults: () => ({
    title: 'Development Timeline',
    steps: [
      { version:'v1.0', title:'Initial Release', desc:'Core features and geometry nodes setup.', status:'done' },
      { version:'v1.5', title:'Performance Update', desc:'5x faster generation and new UI.', status:'current' },
      { version:'v2.0', title:'Eevee Next Support', desc:'Full compatibility with upcoming Blender 4.2 features.', status:'upcoming' }
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:48px 24px; background:#fff; border:1px solid #e2e6f4; border-radius:24px;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const items = p.steps.map((s, idx) => {
      let dotColor = '#e5e7eb';
      let titleColor = '#9ca3af';
      let activeGlow = '';
      if(s.status==='done') { dotColor = '#10b981'; titleColor = '#111827'; }
      if(s.status==='current') { dotColor = '#3b82f6'; titleColor = '#111827'; activeGlow = 'box-shadow:0 0 0 4px rgba(59,130,246,0.2);'; }
      
      return `
      <div style="position:relative; margin-bottom:${idx===p.steps.length-1?'0':'32px'}; clear:both;">
        <div style="position:absolute; left:-33px; top:4px; width:16px; height:16px; border-radius:50%; background:${dotColor}; ${activeGlow}"></div>
        <div style="float:left; width:60px; font-weight:800; color:${dotColor}; font-size:14px; margin-top:2px;">${html(s.version)}</div>
        <div style="margin-left:70px;">
          <h3 style="margin:0 0 4px 0; font-size:18px; font-weight:800; color:${titleColor};">${html(s.title)}</h3>
          <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.5;">${html(s.desc)}</p>
        </div>
      </div>`;
    }).join('');
    return `
    <div class="block" data-type="roadmap">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 40px 0;">${html(p.title)}</h2>
        <div style="max-width:600px; margin:0 auto; padding-left:24px; border-left:2px solid #e5e7eb;">
          ${items}
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Steps', ['version','title','desc','status'], p.steps, (a)=>{ p.steps=a; render(); }));
  }
};
