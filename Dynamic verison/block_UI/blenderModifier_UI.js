export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Panel Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Modifiers', ['name','icon','active','expanded','details'], p.items, (a)=>{ p.items=a; render(); }));
  };
