export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Accent Color','text',p.accent,(v)=>{ p.accent=v; render(); }));
    f.appendChild(arrayEditor('Stats', ['val','label'], p.stats, (a)=>{ p.stats=a; render(); }));
  };
