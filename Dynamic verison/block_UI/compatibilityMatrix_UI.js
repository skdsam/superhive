export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title', 'text', p.title, (v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Groups', ['name','items'], p.groups, (a)=>{ p.groups=a; render(); }));
  };
