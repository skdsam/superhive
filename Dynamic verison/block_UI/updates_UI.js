export default (f, p, render, { field, textarea, addCountControls, ensureLength }) => {
    addCountControls(f, 'Versions', p.items.length, (n)=>{
      p.items = ensureLength(p.items, n, ()=>({v:'1.0.x', notes:['Note']}));
      render();
    });
    p.items.forEach((it,idx)=>{
      f.appendChild(field(`Version ${idx+1}`,'text',it.v,(v)=>{ it.v=v; render(); }));
      f.appendChild(textarea(`Notes ${idx+1}`,(it.notes||[]).join('\n'),(v)=>{ it.notes=v.split(/\n+/).filter(Boolean); render(); }));
    });
  };
