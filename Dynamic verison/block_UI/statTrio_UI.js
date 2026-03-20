export default (f, p, render, { field, addCountControls, ensureLength }) => {
    addCountControls(f, 'Items', p.items.length, (n)=>{
      p.items = ensureLength(p.items, n, ()=>({label:'Label', value:'Value'}));
      render();
    });
    p.items.forEach((it,idx)=>{
      f.appendChild(field(`Item ${idx+1} Label`,'text',it.label,(v)=>{ it.label=v; render(); }));
      f.appendChild(field(`Item ${idx+1} Value`,'text',it.value,(v)=>{ it.value=v; render(); }));
    });
    f.appendChild(field('Background','text', p.bg || '', (v)=>{ p.bg=v; render(); }));
    f.appendChild(field('Text Color','text', p.color || '', (v)=>{ p.color=v; render(); }));
    f.appendChild(field('Card Background','text', p.cardBg || '', (v)=>{ p.cardBg=v; render(); }));
    f.appendChild(field('Card Text Color','text', p.cardColor || '', (v)=>{ p.cardColor=v; render(); }));
  };
