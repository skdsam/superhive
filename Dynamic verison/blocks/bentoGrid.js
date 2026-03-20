export default {
  label: '🍱 Bento Grid',
  desc: 'Asymmetrical features',
  defaults: () => ({
    c1_title: 'Procedural Generation', c1_desc: 'Instantly build sprawling cities.', c1_img:'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
    c2_title: '1-Click Export', c2_desc: 'Ready for Unreal Engine.', c2_img:'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG',
    c3_title: 'Non-Destructive', c3_desc: 'Always editable at any time.',
    c4_title: 'Optimized', c4_desc: 'Perfect for massive scenes.',
    baseSurfaceStyle: 'margin:0 0 18px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const id = 'bento-' + Math.random().toString(36).slice(2, 9);
    return `
    <div class="block" data-type="bentoGrid">
      <style>
        #${id} { display:grid; grid-template-columns:2fr 1fr; gap:16px; auto-rows: minmax(180px, auto); }
        #${id} .b-card { background:#fff; border:1px solid #e5e7eb; border-radius:24px; padding:24px; display:flex; flex-direction:column; overflow:hidden; position:relative; box-shadow:0 10px 15px -3px rgba(0,0,0,0.02); }
        #${id} .b-card h3 { margin:0 0 8px 0; font-size:20px; font-weight:800; color:#111827; position:relative; z-index:2; }
        #${id} .b-card p { margin:0; font-size:15px; color:#4b5563; position:relative; z-index:2; line-height:1.5; }
        #${id} .c1 { grid-column:span 1; grid-row:span 2; min-height:400px; justify-content:flex-end; }
        #${id} .c2 { grid-column:span 1; grid-row:span 1; min-height:200px; justify-content:flex-end; }
        #${id} .c34-wrap { grid-column:span 1; grid-row:span 1; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        #${id} .bg-img { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:0; }
        #${id} .overlay { position:absolute; bottom:0; left:0; width:100%; height:60%; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); z-index:1; }
        @media(max-width:768px) { #${id}, #${id} .c34-wrap { grid-template-columns:1fr; } #${id} .c1 { grid-row:span 1; min-height:300px; } }
      </style>
      <div id="${id}" data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <div class="b-card c1">
          ${p.c1_img ? `<img src="${attr(p.c1_img)}" class="bg-img"><div class="overlay"></div>` : ''}
          <h3 style="${p.c1_img?'color:#fff;':''}">${html(p.c1_title)}</h3>
          <p style="${p.c1_img?'color:#e5e7eb;':''}">${html(p.c1_desc)}</p>
        </div>
        <div class="b-card c2">
          ${p.c2_img ? `<img src="${attr(p.c2_img)}" class="bg-img"><div class="overlay"></div>` : ''}
          <h3 style="${p.c2_img?'color:#fff;':''}">${html(p.c2_title)}</h3>
          <p style="${p.c2_img?'color:#e5e7eb;':''}">${html(p.c2_desc)}</p>
        </div>
        <div class="c34-wrap">
          <div class="b-card c3">
            <h3>${html(p.c3_title)}</h3><p>${html(p.c3_desc)}</p>
          </div>
          <div class="b-card c4">
            <h3>${html(p.c4_title)}</h3><p>${html(p.c4_desc)}</p>
          </div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, textarea }) => {
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
  }
};
