export default {
  label: '⚖️ Before/After Comparison',
  desc: 'Side-by-side images',
  defaults: () => ({
    leftImg: 'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
    leftLabel: 'Before ChromaLight',
    rightImg: 'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG',
    rightLabel: 'After 1-Click Match',
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="comparison">
      <div data-surface="1" style="display:flex; flex-wrap:wrap; gap:12px; ${mergeSurfaceStyle(p)}">
        <div style="flex:1; min-width:300px; position:relative;">
          <img src="${attr(p.leftImg)}" style="width:100%; border-radius:12px; display:block;">
          <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.6); color:#fff; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:700;">${html(p.leftLabel)}</div>
        </div>
        <div style="flex:1; min-width:300px; position:relative;">
          <img src="${attr(p.rightImg)}" style="width:100%; border-radius:12px; display:block;">
          <div style="position:absolute; bottom:12px; left:12px; background:rgba(59,130,246,0.8); color:#fff; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:700;">${html(p.rightLabel)}</div>
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field }) => {
    f.appendChild(field('Left Image URL','text',p.leftImg,(v)=>{ p.leftImg=v; render(); }));
    f.appendChild(field('Left Label','text',p.leftLabel,(v)=>{ p.leftLabel=v; render(); }));
    f.appendChild(field('Right Image URL','text',p.rightImg,(v)=>{ p.rightImg=v; render(); }));
    f.appendChild(field('Right Label','text',p.rightLabel,(v)=>{ p.rightLabel=v; render(); }));
  }
};
