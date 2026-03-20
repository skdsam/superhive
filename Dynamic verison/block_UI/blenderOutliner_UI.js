export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Scene Name','text',p.sceneName,(v)=>{ p.sceneName=v; render(); }));
    f.appendChild(arrayEditor('Collections', ['name','type','items'], p.collections, (a)=>{ p.collections=a; render(); }));
  };
