export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('File Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Code Lines', ['text'], p.lines, (a)=>{ p.lines=a; render(); }));
  };
