export default (f, p, render, { field }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Neon Color','text',p.neonColor,(v)=>{ p.neonColor=v; render(); }));
    f.appendChild(field('Image/Video URL','text',p.image,(v)=>{ p.image=v; render(); }));
  };
