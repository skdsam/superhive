export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Questions', ['q','a'], p.faqs, (a)=>{ p.faqs=a; render(); }));
  };
