export default (f, p, render, { field, textarea, addCountControls, ensureLength }) => {
    addCountControls(f, 'Cards', p.cards.length, (n)=>{
      p.cards = ensureLength(p.cards, n, ()=>({t:'Title', d:'Description'}));
      render();
    });
    p.cards.forEach((c,idx)=>{
      f.appendChild(field(`Card ${idx+1} Title`,'text',c.t,(v)=>{ c.t=v; render(); }));
      f.appendChild(textarea(`Card ${idx+1} Desc`, c.d,(v)=>{ c.d=v; render(); }));
    });
    f.appendChild(field('Background','text', p.bg || '', (v)=>{ p.bg=v; render(); }));
    f.appendChild(field('Text Color','text', p.color || '', (v)=>{ p.color=v; render(); }));
    f.appendChild(field('Card Background','text', p.cardBg || '', (v)=>{ p.cardBg=v; render(); }));
    f.appendChild(field('Card Text Color','text', p.cardColor || '', (v)=>{ p.cardColor=v; render(); }));
  };
