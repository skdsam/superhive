export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Watermark Text','text',p.watermark,(v)=>{ p.watermark=v; render(); }));
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Accent Color','text',p.accent,(v)=>{ p.accent=v; render(); }));
    f.appendChild(field('Text Color','text',p.textColor,(v)=>{ p.textColor=v; render(); }));
    f.appendChild(field('Image URL','text',p.image,(v)=>{ p.image=v; render(); }));
    f.appendChild(textarea('Bullets (comma separated)',p.bullets.join(', '),(v)=>{ p.bullets=v.split(',').map(s=>s.trim()); render(); }));
  };
