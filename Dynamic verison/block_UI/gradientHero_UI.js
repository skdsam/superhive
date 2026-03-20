export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Subtitle',p.subtitle,(v)=>{ p.subtitle=v; render(); }));
    f.appendChild(field('Button Text','text',p.btnText,(v)=>{ p.btnText=v; render(); }));
    f.appendChild(field('Button URL','text',p.btnHref,(v)=>{ p.btnHref=v; render(); }));
    f.appendChild(field('Gradient Color 1','text',p.gradA,(v)=>{ p.gradA=v; render(); }));
    f.appendChild(field('Gradient Color 2','text',p.gradB,(v)=>{ p.gradB=v; render(); }));
    f.appendChild(field('Gradient Color 3','text',p.gradC,(v)=>{ p.gradC=v; render(); }));
  };
