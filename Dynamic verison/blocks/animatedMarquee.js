export default {
  label: '🏃 Animated Marquee',
  desc: 'Scrolling text banner',
  defaults: () => ({
    text: 'CRAFTED FOR PROFESSIONALS • 4K READY • OPTIMIZED WORKFLOW • EEVEE NEXT SUPPORT • ',
    bgColor: '#3b82f6',
    textColor: '#ffffff',
    speed: '20s',
    baseSurfaceStyle: 'margin:24px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const id = 'mar-' + Math.random().toString(36).slice(2, 9);
    return `
    <div class="block" data-type="animatedMarquee">
      <style>
        @keyframes anim_${id} { 0%{transform:translate3d(0,0,0);} 100%{transform:translate3d(-50%,0,0);} }
        #${id} { overflow:hidden; white-space:nowrap; padding:16px 0; background:${attr(p.bgColor)}; color:${attr(p.textColor)}; font-weight:900; font-size:24px; border-radius:12px; transform:rotate(-1deg); width:105%; margin-left:-2.5%; }
        #${id} .track { display:flex; width:max-content; animation: anim_${id} ${attr(p.speed)} linear infinite; }
        #${id} span { padding:0 30px; }
      </style>
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div id="${id}">
          <div class="track">
             <span>${html(p.text)}</span><span>${html(p.text)}</span><span>${html(p.text)}</span><span>${html(p.text)}</span>
          </div>
        </div>
      </div>
    </div>`;
  }
};
