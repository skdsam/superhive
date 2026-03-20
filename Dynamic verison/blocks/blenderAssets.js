export default {
  label: '🖼️ Blender Assets',
  desc: 'Asset Browser UI Grid',
  defaults: () => ({
    title: 'Current File',
    items: [
      { name:'SciFi Building A', img:'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg' },
      { name:'SciFi Building B', img:'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg' },
      { name:'Street Prop', img:'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG' },
      { name:'Neon Sign', img:'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg' }
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:40px 24px; background:#18181b; border-radius:16px;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const items = p.items.map(i=>`
      <div style="background:#3d3d3d; border-radius:6px; overflow:hidden; display:flex; flex-direction:column; border:1px solid #222; cursor:pointer;">
        <div style="aspect-ratio:1/1; background:#222; overflow:hidden; border-bottom:1px solid #111;">
          <img src="${attr(i.img)}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        </div>
        <div style="padding:8px 6px; font-size:11px; color:#e5e7eb; text-align:center; font-family:sans-serif; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">${html(i.name)}</div>
      </div>
    `).join('');
    return `
    <div class="block" data-type="blenderAssets">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <div style="width:100%; background:#282828; border-radius:8px; border:1px solid #111; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <div style="background:#222; padding:10px 16px; font-family:sans-serif; font-size:13px; color:#aaa; display:flex; justify-content:space-between; border-bottom:1px solid #111;">
             <span style="font-weight:700; color:#fff;">📚 ${html(p.title)}</span>
             <span style="background:#111; padding:2px 12px; border-radius:12px; font-size:11px; border:1px solid #333;">🔍 Search Assets...</span>
          </div>
          <div style="padding:16px; display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:16px; max-height:400px; overflow-y:auto; background:#303030;">
             ${items}
          </div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Asset Folder','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Assets', ['name','img'], p.items, (a)=>{ p.items=a; render(); }));
  }
};
