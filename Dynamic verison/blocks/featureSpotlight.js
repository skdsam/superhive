export default {
  label: '🔦 Feature Spotlight',
  desc: 'Big image with side features',
  defaults: () => ({
    watermark: 'SUPREME',
    title: 'Precision Engineering.',
    accent: '#f59e0b',
    image: 'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
    bullets: ['Ultra-High Definition Meshes', 'Procedural Textures', '1-Click Optimization'],
    baseSurfaceStyle: 'margin:60px 0; padding:60px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="featureSpotlight">
      <div data-surface="1" style="position:relative; display:flex; flex-direction:column; align-items:center; ${mergeSurfaceStyle(p)}">
        <div style="position:absolute; top:-20px; font-size:120px; font-weight:900; opacity:0.03; color:#fff; letter-spacing:20px; pointer-events:none; white-space:nowrap;">${html(p.watermark)}</div>
        <div style="max-width:800px; text-align:center; z-index:1;">
          <h2 style="font-size:48px; font-weight:800; color:#fff; margin:0 0 40px 0;">${html(p.title)}</h2>
          <div style="position:relative; margin-bottom:40px;">
            <div style="position:absolute; inset:-20px; background:${attr(p.accent)}; border-radius:50%; filter:blur(100px); opacity:0.1; z-index:0;"></div>
            <img src="${attr(p.image)}" style="width:100%; border-radius:24px; border:1px solid rgba(255,255,255,0.1); position:relative; z-index:1;">
          </div>
          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px;">
            ${p.bullets.map(b=>`
              <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:12px 24px; border-radius:99px; color:#fff; font-size:14px; font-weight:700; display:flex; align-items:center; gap:10px;">
                <span style="color:${attr(p.accent)}">●</span> ${html(b)}
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`
};
