export default {
  label: '🚀 Hero Header',
  desc: 'Logo/GIF, title, subtitle, badges',
  defaults: () => ({
    title: 'ChromaLight',
    subtitle: 'Blender Add-on',
    badges: [
      { text:'Image-Based Lighting', style:'display:inline-block;background:#3a2d17;color:#ffeec6;border:1px solid rgba(255,238,198,.25);padding:6px 10px;border-radius:999px;font-size:12px;' },
      { text:'Automatic Light Setup', style:'display:inline-block;background:#17323a;color:#c6ffee;border:1px solid rgba(198,255,238,.25);padding:6px 10px;border-radius:999px;font-size:12px;' },
      { text:'Colour Grading',        style:'display:inline-block;background:#2a3566;color:#eaf0ff;border:1px solid rgba(255,255,255,.15);padding:6px 10px;border-radius:999px;font-size:12px;' },
    ],
    image: { src:'https://assets.superhivemarket.com/cache/4220398c8b981fce85a6d08f76cd32d1.gif', alt:'Preview', style:'width:92px;height:92px;border-radius:14px;border:1px solid rgba(255,255,255,.2);' },
    blurbHTML: '<strong>Instantly match your lighting to any image.</strong> ChromaLight analyses your reference image and extracts its colour palette to automatically generate or update your scene lights and world background — giving your render a cohesive mood and professional grade.',
    baseSurfaceStyle: 'background:linear-gradient(135deg,#0f1220,#1b2451);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:28px 26px;color:#eaf0ff;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, attr, html }) => `
    <div class="block" data-type="hero">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="display:flex;align-items:center;flex-wrap:wrap;">
          <img src="${attr(p.image.src)}" alt="${attr(p.image.alt)}" style="${p.image.style}">
          <div style="flex:1 1 320px;">
            <div style="font-size:13px;letter-spacing:.08em;">&nbsp;${html(p.subtitle)}</div>
            <h1 style="margin:6px 0 8px 0;font-size:28px;line-height:1.2;">&nbsp;${html(p.title)}&nbsp;</h1>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${p.badges.map(b=>`<span style="${b.style}">${html(b.text)}</span>`).join('')}
            </div>
          </div>
        </div>
        <div style="margin-top:14px;font-size:14px;">${p.blurbHTML}</div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, textarea, addCountControls, ensureLength }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Subtitle','text',p.subtitle,(v)=>{ p.subtitle=v; render(); }));
    f.appendChild(field('Image URL','text',p.image.src,(v)=>{ p.image.src=v; render(); }));
    f.appendChild(field('Image Alt','text',p.image.alt,(v)=>{ p.image.alt=v; render(); }));
    f.appendChild(textarea('Intro HTML', p.blurbHTML,(v)=>{ p.blurbHTML=v; render(); }));
    addCountControls(f, 'Badges', p.badges.length, (n)=>{
      p.badges = ensureLength(p.badges, n, ()=>({text:'New badge',style:'display:inline-block;background:#2a3566;color:#eaf0ff;border:1px solid rgba(255,255,255,.15);padding:6px 10px;border-radius:999px;font-size:12px;'}));
      render();
    });
    p.badges.forEach((b,idx)=>{
      f.appendChild(field(`Badge ${idx+1} Text`,'text',b.text,(v)=>{ b.text=v; render(); }));
      f.appendChild(textarea(`Badge ${idx+1} Style`, b.style,(v)=>{ b.style=v; render(); }));
    });
  }
};
