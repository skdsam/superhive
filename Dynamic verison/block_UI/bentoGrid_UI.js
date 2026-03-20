export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Card 1 Title','text',p.c1_title,(v)=>{ p.c1_title=v; render(); }));
    f.appendChild(textarea('Card 1 Desc',p.c1_desc,(v)=>{ p.c1_desc=v; render(); }));
    f.appendChild(field('Card 1 Img URL','text',p.c1_img,(v)=>{ p.c1_img=v; render(); }));
    f.appendChild(field('Card 2 Title','text',p.c2_title,(v)=>{ p.c2_title=v; render(); }));
    f.appendChild(textarea('Card 2 Desc',p.c2_desc,(v)=>{ p.c2_desc=v; render(); }));
    f.appendChild(field('Card 2 Img URL','text',p.c2_img,(v)=>{ p.c2_img=v; render(); }));
    f.appendChild(field('Card 3 Title','text',p.c3_title,(v)=>{ p.c3_title=v; render(); }));
    f.appendChild(textarea('Card 3 Desc',p.c3_desc,(v)=>{ p.c3_desc=v; render(); }));
    f.appendChild(field('Card 4 Title','text',p.c4_title,(v)=>{ p.c4_title=v; render(); }));
    f.appendChild(textarea('Card 4 Desc',p.c4_desc,(v)=>{ p.c4_desc=v; render(); }));
  };
