export default {
  label: '📂 Blender Outliner',
  desc: 'Mimics the Hierarchy',
  defaults: () => ({
    sceneName: 'Scene Collection',
    collections: [
      { name:'Environment', type:'col', items:['Ground', 'Lighting'] },
      { name:'Superhive Result', type:'active', items:['Generated_City_01'] }
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:60px 24px; background:#e5e7eb; border-radius:16px; display:flex; justify-content:center;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const cols = p.collections.map(c => `
      <div style="padding:4px 8px 4px 24px; font-size:12px; display:flex; justify-content:space-between; background:#303030; cursor:pointer;">
        <span style="display:flex; gap:6px; align-items:center; opacity:0.9;">
          <span style="font-size:10px;">▼</span>
          <span style="color:${c.type==='active'?'#eab308':'#ccc'};">📁</span>
          <span style="color:${c.type==='active'?'#fff':'#ccc'};">${html(c.name)}</span>
        </span>
        <span style="display:flex; gap:8px; align-items:center; opacity:0.7;"><span>👁</span><span>📷</span></span>
      </div>
      ${(c.items||[]).map(i=>`
        <div style="padding:4px 8px 4px 44px; font-size:12px; display:flex; justify-content:space-between; ${c.type==='active'?'background:#2a364a; color:#38bdf8;':'background:#303030; color:#aaa;'} border-left:1px dashed #444; margin-left:28px;">
          <span style="display:flex; gap:6px; align-items:center;">
            <span style="color:${c.type==='active'?'#38bdf8':'#ed8936'};">🟧</span>
            <span>${html(i)}</span>
          </span>
          <span style="display:flex; gap:8px; align-items:center; opacity:${c.type==='active'?'1':'0.5'};"><span>👁</span><span>📷</span></span>
        </div>
      `).join('')}
    `).join('');
    return `
    <div class="block" data-type="blenderOutliner">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <div style="width:100%; max-width:340px; background:#303030; color:#cccccc; font-family:sans-serif; border-radius:8px; overflow:hidden; border:1px solid #111; box-shadow:0 20px 40px rgba(0,0,0,0.4);">
          <div style="background:#282828; padding:8px 12px; font-size:12px; border-bottom:1px solid #111; display:flex; justify-content:space-between;">
             <span>🔍 Search...</span><span>▦</span>
          </div>
          <div style="padding:6px 8px; font-size:12px; display:flex; gap:6px; background:#3d3d3d; font-weight:600; color:#fff; align-items:center;">
            <span style="font-size:10px; opacity:0.7;">▼</span><span>📦</span><span>${html(p.sceneName)}</span>
          </div>
          ${cols}
          <div style="height:60px; background:#303030;"></div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Scene Name','text',p.sceneName,(v)=>{ p.sceneName=v; render(); }));
    f.appendChild(arrayEditor('Collections', ['name','type','items'], p.collections, (a)=>{ p.collections=a; render(); }));
  }
};
