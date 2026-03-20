export default {
  label: '🧩 Blender Node UI',
  desc: 'Mimics the Node Editor',
  defaults: () => ({
    nodeTitle: 'Superhive Generator',
    nodeColor: '#3b82f6',
    inputs: ['Geometry', 'Seed', 'Density'],
    outputs: ['Mesh', 'Materials'],
    baseSurfaceStyle: 'margin:0 0 18px 0; padding:60px 24px; background:#1e1e1e; border-radius:16px; display:flex; justify-content:center; overflow:hidden;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const ins = p.inputs.map(i=>`<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; position:relative; left:-6px;"><div style="width:12px;height:12px;border-radius:50%;border:1px solid #000;background:#38bdf8;"></div><span style="color:#d1d5db;font-size:14px;">${html(i)}</span></div>`).join('');
    const outs = p.outputs.map(i=>`<div style="display:flex; align-items:center; justify-content:flex-end; gap:8px; margin-bottom:8px; position:relative; right:-6px;"><span style="color:#d1d5db;font-size:14px;">${html(i)}</span><div style="width:12px;height:12px;border-radius:50%;border:1px solid #000;background:#10b981;"></div></div>`).join('');
    return `
    <div class="block" data-type="fauxNode">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <div style="width:100%; max-width:320px; background:#333333; border:1px solid #111; border-radius:8px; overflow:hidden; box-shadow:0 15px 30px rgba(0,0,0,0.5); font-family:sans-serif;">
          <div style="background:linear-gradient(to right, ${attr(p.nodeColor)} 0%, #475569 50%, #333333 100%); padding:10px 16px; color:#fff; font-weight:700; font-size:15px; text-shadow:0 1px 2px rgba(0,0,0,0.5); display:flex; justify-content:space-between;">
            <span>▼ ${html(p.nodeTitle)}</span>
          </div>
          <div style="padding:16px; display:flex; justify-content:space-between; background:#3b3b3b; position:relative;">
            <svg style="position:absolute; right:100%; top:24px; width:60px; height:120px; overflow:visible; pointer-events:none; opacity:0.6;"><path d="M-60,0 C-20,0 -10,0 0,0" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>
            <div>${ins}</div>
            <div style="text-align:right;">${outs}</div>
            <svg style="position:absolute; left:100%; top:24px; width:60px; height:120px; overflow:visible; pointer-events:none; opacity:0.6;"><path d="M0,0 C20,0 40,30 60,30" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
        </div>
      </div>
    </div>`;
  },
  inspector: (f, p, render, { field, textarea }) => {
    f.appendChild(field('Node Title','text',p.nodeTitle,(v)=>{ p.nodeTitle=v; render(); }));
    f.appendChild(field('Node Header Color','text',p.nodeColor,(v)=>{ p.nodeColor=v; render(); }));
    f.appendChild(textarea('Inputs (comma separated)',p.inputs.join(', '),(v)=>{ p.inputs=v.split(',').map(s=>s.trim()); render(); }));
    f.appendChild(textarea('Outputs (comma separated)',p.outputs.join(', '),(v)=>{ p.outputs=v.split(',').map(s=>s.trim()); render(); }));
  }
};
