export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Asset Folder','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Assets', ['name','img'], p.items, (a)=>{ p.items=a; render(); }));
  };
