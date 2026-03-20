export default {
  label: '🚨 Neon Showcase',
  desc: 'Glowing frame for media',
  defaults: () => ({
    title: 'Experience Vertical Excellence',
    neonColor: '#00f2ff',
    image: 'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:60px 24px; background:#000; display:flex; flex-direction:column; align-items:center; border-radius:32px; overflow:hidden;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const isVideo = p.image.match(/\\.(mp4|webm|ogg)$/i);
    return `
    <div class="block" data-type="neonShowcase">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h2 style="font-size:32px; font-weight:900; color:#fff; text-align:center; margin:0 0 40px 0; text-transform:uppercase; letter-spacing:2px; text-shadow:0 0 20px ${attr(p.neonColor)}">${html(p.title)}</h2>
        <div style="position:relative; width:100%; max-width:500px; aspect-ratio:9/16; border-radius:24px; padding:8px; background:linear-gradient(45deg, ${attr(p.neonColor)}, #fff, ${attr(p.neonColor)}); box-shadow:0 0 50px ${attr(p.neonColor)}66, inset 0 0 20px rgba(255,255,255,0.5);">
          <div style="width:100%; height:100%; border-radius:18px; overflow:hidden; background:#111;">
            ${isVideo 
              ? `<video src="${attr(p.image)}" autoplay muted loop style="width:100%; height:100%; object-fit:cover;"></video>`
              : `<img src="${attr(p.image)}" style="width:100%; height:100%; object-fit:cover;">`
            }
          </div>
          <div style="position:absolute; inset:0; border-radius:24px; box-shadow:inset 0 0 100px rgba(0,0,0,0.8); pointer-events:none;"></div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Neon Color','text',p.neonColor,(v)=>{ p.neonColor=v; render(); }));
    f.appendChild(field('Image/Video URL','text',p.image,(v)=>{ p.image=v; render(); }));
  }
};
