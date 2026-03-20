export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Reviews', ['name','role','text','stars','thumb'], p.reviews, (a)=>{ p.reviews=a; render(); }));
  };
