export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Bullets', p.bullets.join('\n'),(v)=>{ p.bullets=v.split(/\n+/).filter(Boolean); render(); }));
  };
