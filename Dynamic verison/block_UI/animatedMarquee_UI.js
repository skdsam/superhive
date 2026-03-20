export default (f, p, render, { field }) => {
    f.appendChild(field('Text','text',p.text,(v)=>{ p.text=v; render(); }));
    f.appendChild(field('Background Color','text',p.bgColor,(v)=>{ p.bgColor=v; render(); }));
    f.appendChild(field('Text Color','text',p.textColor,(v)=>{ p.textColor=v; render(); }));
    f.appendChild(field('Speed (e.g. 20s)','text',p.speed,(v)=>{ p.speed=v; render(); }));
  };
