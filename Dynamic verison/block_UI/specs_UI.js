export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Rows', ['label','val'], p.rows, (a)=>{ p.rows=a; render(); }));
  };
