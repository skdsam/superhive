export default {
  label: '💻 Code Snippet',
  desc: 'Faux code editor window',
  defaults: () => ({
    title: 'chromalight_setup.py',
    lines: [
      { text: 'import bpy' },
      { text: 'from chromalight import utils' },
      { text: '' },
      { text: '# 1-Click analysis and matching' },
      { text: 'utils.match_lighting(image_path="/refs/look_01.jpg")' }
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="code">
      <div data-surface="1" style="background:#1e1e1e; border-radius:12px; overflow:hidden; font-family:monospace; border:1px solid #333; box-shadow:0 20px 25px -5px rgba(0,0,0,0.3); ${mergeSurfaceStyle(p)}">
        <div style="background:#2d2d2d; padding:8px 16px; display:flex; gap:8px; align-items:center; border-bottom:1px solid #111;">
          <div style="display:flex; gap:6px;"><div style="width:10px;height:10px;border-radius:50%;background:#ff5f56;"></div><div style="width:10px;height:10px;border-radius:50%;background:#ffbd2e;"></div><div style="width:10px;height:10px;border-radius:50%;background:#27c93f;"></div></div>
          <div style="color:#94a3b8; font-size:12px; margin-left:8px;">${html(p.title)}</div>
        </div>
        <div style="padding:16px; font-size:13px; color:#d1d5db; line-height:1.5; overflow-x:auto;">
          ${p.lines.map((l,idx)=>`
            <div style="display:flex; gap:16px;">
              <span style="color:#4b5563; min-width:20px; text-align:right;">${idx+1}</span>
              <span style="white-space:pre-wrap;">${html(l.text)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('File Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Code Lines', ['text'], p.lines, (a)=>{ p.lines=a; render(); }));
  }
};
