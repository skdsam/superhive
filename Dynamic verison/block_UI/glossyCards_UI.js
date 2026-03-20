export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Title Color','text',p.titleColor || '#ffffff',(v)=>{ p.titleColor=v; render(); }));
    f.appendChild(field('Description Color','text',p.descColor || '#cbd5e1',(v)=>{ p.descColor=v; render(); }));
    f.appendChild(field('Glass Tint','text',p.glassTint,(v)=>{ p.glassTint=v; render(); }));
    f.appendChild(field('Glow Color','text',p.glowColor,(v)=>{ p.glowColor=v; render(); }));
    const colF = field('Grid Columns','number',p.cols,(v)=>{ p.cols=v; render(); });
    colF.querySelector('input').min = 1;
    colF.querySelector('input').max = 6;
    f.appendChild(colF);
    f.appendChild(arrayEditor('Cards', ['icon','title','desc'], p.cards, (a)=>{ p.cards=a; render(); }));
  };
