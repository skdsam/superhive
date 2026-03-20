export default (f, p, render, { field }) => {
    f.appendChild(field('Headline','text',p.headline,(v)=>{ p.headline=v; render(); }));
    f.appendChild(field('Subhead','text',p.sub,(v)=>{ p.sub=v; render(); }));
    f.appendChild(field('Main Image','text',p.image,(v)=>{ p.image=v; render(); }));
    f.appendChild(field('GIF URL','text',p.gif,(v)=>{ p.gif=v; render(); }));
    f.appendChild(field('Text Color','text', p.color || '', (v)=>{ p.color=v; render(); }));
  };
