export default (f, p, render, { field, textarea, addCountControls, ensureLength }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Subtitle','text',p.subtitle,(v)=>{ p.subtitle=v; render(); }));
    f.appendChild(field('Image URL','text',p.image.src,(v)=>{ p.image.src=v; render(); }));
    f.appendChild(field('Image Alt','text',p.image.alt,(v)=>{ p.image.alt=v; render(); }));
    f.appendChild(textarea('Intro HTML', p.blurbHTML,(v)=>{ p.blurbHTML=v; render(); }));
    addCountControls(f, 'Badges', p.badges.length, (n)=>{
      p.badges = ensureLength(p.badges, n, ()=>({text:'New badge',style:'display:inline-block;background:#2a3566;color:#eaf0ff;border:1px solid rgba(255,255,255,.15);padding:6px 10px;border-radius:999px;font-size:12px;'}));
      render();
    });
    p.badges.forEach((b,idx)=>{
      f.appendChild(field(`Badge ${idx+1} Text`,'text',b.text,(v)=>{ b.text=v; render(); }));
      f.appendChild(textarea(`Badge ${idx+1} Style`, b.style,(v)=>{ b.style=v; render(); }));
    });
  };
