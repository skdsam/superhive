export default (f, p, render, { field }) => {
    f.appendChild(field('Line Color', 'text', p.color, (v)=>{ p.color=v; render(); }));
    f.appendChild(field('Thickness', 'text', p.thickness, (v)=>{ p.thickness=v; render(); }));
    f.appendChild(field('Margin', 'text', p.margin, (v)=>{ p.margin=v; render(); }));
  };
