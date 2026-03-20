export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Steps', ['version','title','desc','status'], p.steps, (a)=>{ p.steps=a; render(); }));
  };
