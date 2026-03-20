export default {
  label: '💎 Glass Card Grid',
  desc: 'Frosted glass cards with glow',
  defaults: () => ({
    title: 'Designed for High Performance',
    titleColor: '#ffffff',
    descColor: '#cbd5e1',
    glassTint: 'rgba(255,255,255,0.03)',
    glowColor: 'rgba(59,130,246,0.15)',
    cols: '3',
    cards: [
      { icon:'⚡', title:'Real-time Feedback', desc:'See every adjustment as you make it, with zero lag in the viewport.' },
      { icon:'🛠️', title:'Modular Workflow', desc:'Swap components, change layouts, and extend features in seconds.' },
      { icon:'🎨', title:'Deep Customization', desc:'Full control over every pixel, from colors to complex animations.' }
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:48px 24px; background:#020617; border-radius:32px;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="glossyCards">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h2 style="text-align:center; font-size:32px; font-weight:800; color:${p.titleColor || '#fff'}; margin:0 0 48px 0;">${html(p.title)}</h2>
        <div style="display:grid; grid-template-columns:repeat(${p.cols || 3}, 1fr); gap:20px;">
          ${p.cards.map(c=>`
            <div style="background:${attr(p.glassTint)}; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:32px; position:relative; overflow:hidden; transition:transform 0.3s; cursor:default;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="position:absolute; top:-20px; right:-20px; width:80px; height:80px; background:${attr(p.glowColor)}; filter:blur(30px); border-radius:50%; z-index:0;"></div>
              <div style="position:relative; z-index:1;">
                <div style="font-size:32px; margin-bottom:16px;">${html(c.icon)}</div>
                <h3 style="margin:0 0 12px 0; font-size:20px; font-weight:700; color:${p.titleColor || '#fff'};">${html(c.title)}</h3>
                <p style="margin:0; font-size:15px; color:${p.descColor || '#cbd5e1'}; line-height:1.6; opacity:0.8;">${html(c.desc)}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Title Color','text',p.titleColor || '#ffffff',(v)=>{ p.titleColor=v; render(); }));
    f.appendChild(field('Description Color','text',p.descColor || '#cbd5e1',(v)=>{ p.descColor=v; render(); }));
    f.appendChild(field('Glass Tint','text',p.glassTint,(v)=>{ p.glassTint=v; render(); }));
    f.appendChild(field('Glow Color','text',p.glowColor,(v)=>{ p.glowColor=v; render(); }));
    const colF = field('Grid Columns','number',p.cols,(v)=>{ p.cols=v; render(); });
    colF.querySelector('input').min = 1;
    colF.querySelector('input').max = 6;
    f.appendChild(colF);
    f.appendChild(arrayEditor('Cards', ['icon','title','desc'], p.cards, (a)=>{ p.cards=a; render(); }));
  }
};
