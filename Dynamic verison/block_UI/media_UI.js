export default (f, p, render, { field }) => {
    f.appendChild(field('Image/GIF URL','text',p.src,(v)=>{ p.src=v; render(); }));
    f.appendChild(field('Alt text','text',p.alt,(v)=>{ p.alt=v; render(); }));
  };
