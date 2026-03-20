export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Main Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Old Title','text',p.oldTitle,(v)=>{ p.oldTitle=v; render(); }));
    f.appendChild(textarea('Old Desc',p.oldDesc,(v)=>{ p.oldDesc=v; render(); }));
    f.appendChild(textarea('Old Items (comma separated)',p.oldItems.join(', '),(v)=>{ p.oldItems=v.split(',').map(s=>s.trim()); render(); }));
    f.appendChild(field('New Title','text',p.newTitle,(v)=>{ p.newTitle=v; render(); }));
    f.appendChild(textarea('New Desc',p.newDesc,(v)=>{ p.newDesc=v; render(); }));
    f.appendChild(textarea('New Items (comma separated)',p.newItems.join(', '),(v)=>{ p.newItems=v.split(',').map(s=>s.trim()); render(); }));
  };
