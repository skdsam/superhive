export default {
  label: '🏃 Animated Marquee',
  desc: 'Scrolling text banner',
  defaults: () => ({
    text: 'CRAFTED FOR PROFESSIONALS • 4K READY • OPTIMIZED WORKFLOW • EEVEE NEXT SUPPORT • ',
    bgColor: '#3b82f6',
    textColor: '#ffffff',
    speed: '20s',
    rotation: -1,
    fontSize: 24,
    reverse: false,
    pauseOnHover: true,
    padding: 16,
    baseSurfaceStyle: 'margin:24px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const id = 'mar-' + Math.random().toString(36).slice(2, 9);
    const direction = p.reverse ? 'reverse' : 'normal';
    const pauseStyle = p.pauseOnHover ? `#${id}:hover .track { animation-play-state: paused; }` : '';
    
    return `
    <div class="block" data-type="animatedMarquee">
      <style>
        @keyframes anim_${id} { 0%{transform:translate3d(0,0,0);} 100%{transform:translate3d(-50%,0,0);} }
        #${id} { 
          overflow:hidden; 
          white-space:nowrap; 
          padding:${p.padding}px 0; 
          background:${attr(p.bgColor)}; 
          color:${attr(p.textColor)}; 
          font-weight:900; 
          font-size:${p.fontSize}px; 
          border-radius:12px; 
          transform:rotate(${p.rotation}deg); 
          width:110%; 
          margin-left:-5%;
          position:relative;
          z-index:1;
        }
        #${id} .track { 
          display:flex; 
          width:max-content; 
          animation: anim_${id} ${attr(p.speed)} linear infinite ${direction}; 
        }
        #${id} span { padding:0 30px; }
        ${pauseStyle}
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
