export default {
  label: '✨ Animated Gradient Hero',
  desc: 'Massive colorful title',
  defaults: () => ({
    title: 'Design at the speed of thought.',
    subtitle: 'The ultimate tool for Blender artists building sci-fi environments.',
    btnText: 'Get Early Access',
    btnHref: '#',
    gradA: '#ec4899', gradB: '#8b5cf6', gradC: '#3b82f6',
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:80px 24px; text-align:center; background:#020617; border-image:linear-gradient(to right, #ec4899, #3b82f6) 1; border-width:1px; border-style:solid; border-radius:24px; color:#f8fafc; overflow:hidden; position:relative;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const id = 'grad-' + Math.random().toString(36).slice(2, 9);
    return `
    <div class="block" data-type="gradientHero">
      <style>
        @keyframes anim_${id} { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
        #${id}-text { background: linear-gradient(90deg, ${attr(p.gradA)}, ${attr(p.gradB)}, ${attr(p.gradC)}, ${attr(p.gradA)}); background-size: 300% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: anim_${id} 4s linear infinite; }
        #${id}-btn { background: linear-gradient(90deg, ${attr(p.gradA)}, ${attr(p.gradB)}); transition:opacity 0.2s, transform 0.2s; }
        #${id}-btn:hover { opacity:0.9; transform:scale(1.05); }
      </style>
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <div style="position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle at 50% 50%, ${attr(p.gradB)}33 0%, transparent 50%); z-index:0; pointer-events:none;"></div>
        <div style="position:relative; z-index:1; max-width:800px; margin:0 auto;">
          <h1 id="${id}-text" style="font-size: clamp(40px, 6vw, 72px); font-weight:900; line-height:1.1; margin:0 0 24px 0; padding-bottom:8px;">${html(p.title)}</h1>
          <p style="font-size:20px; color:#94a3b8; margin:0 0 40px 0; line-height:1.6;">${html(p.subtitle)}</p>
          <a id="${id}-btn" href="${attr(p.btnHref)}" style="display:inline-block; color:#fff; text-decoration:none; padding:16px 32px; border-radius:99px; font-weight:800; font-size:18px; box-shadow:0 10px 25px ${attr(p.gradA)}66;">${html(p.btnText)}</a>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, textarea }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Subtitle',p.subtitle,(v)=>{ p.subtitle=v; render(); }));
    f.appendChild(field('Button Text','text',p.btnText,(v)=>{ p.btnText=v; render(); }));
    f.appendChild(field('Button URL','text',p.btnHref,(v)=>{ p.btnHref=v; render(); }));
    f.appendChild(field('Gradient Color 1','text',p.gradA,(v)=>{ p.gradA=v; render(); }));
    f.appendChild(field('Gradient Color 2','text',p.gradB,(v)=>{ p.gradB=v; render(); }));
    f.appendChild(field('Gradient Color 3','text',p.gradC,(v)=>{ p.gradC=v; render(); }));
  }
};
