export default {
  label: '🔢 Step-by-Step',
  desc: 'Numbered workflow',
  defaults: () => ({
    title: 'How It Works',
    circleBg: '#3b82f6',
    circleColor: '#ffffff',
    steps: [
      { num:'1', title:'Import Image', desc:'Drag any reference photo into Blender.' },
      { num:'2', title:'Analyse',      desc:'ChromaLight extracts the primary lighting data.' },
      { num:'3', title:'Match',        desc:'1-Click to apply the lighting to your scene.' }
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="steps">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h3 style="text-align:center; font-size:24px; margin-bottom:32px; color:#111827;">${html(p.title)}</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:32px;">
          ${p.steps.map(s=>`
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
              <div style="width:48px;height:48px;border-radius:50%;background:${attr(p.circleBg)};color:${attr(p.circleColor)};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;margin-bottom:16px;box-shadow:0 10px 15px -3px rgba(59,130,246,0.3);">${html(s.num)}</div>
              <div style="font-weight:800; margin-bottom:8px; color:#111827;">${html(s.title)}</div>
              <p style="margin:0; font-size:14px; color:#4b5563; line-height:1.5;">${html(s.desc)}</p>
            </div>`).join('')}
        </div>
      </div>
    </div>`
};
