export default {
  label: '🧩 Compatibility Matrix',
  desc: 'Displays supported software, engines, and OS',
  defaults: () => ({
    title: 'Verified Compatibility',
    groups: [
      { name: 'Blender Versions', items: '3.6 LTS, 4.0, 4.1, 4.2' },
      { name: 'Render Engines', items: 'Cycles, Eevee, Octane' },
      { name: 'Operating Systems', items: 'Windows, macOS, Linux' }
    ],
    titleColor: '#1e293b',
    headingColor: '#64748b',
    cardBgColor: '#f8fafc',
    cardBorderColor: '#e2e8f0',
    badgeBgColor: '#ffffff',
    badgeTextColor: '#334155',
    badgeBorderColor: '#cbd5e1',
    iconColor: '#10b981',
    baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:14px;padding:24px;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="compatibilityMatrix">
      <div class="sh-card-soft" data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h3 style="margin:0 0 20px 0; font-size:20px; font-weight:700; color:${p.titleColor}; text-align:center;">${html(p.title)}</h3>
        <div style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center;">
          ${p.groups.map(g => `
            <div style="flex:1; min-width:220px; background:${p.cardBgColor}; border-radius:12px; padding:16px; border:1px solid ${p.cardBorderColor}; display:flex; flex-direction:column; gap:12px;">
              <div style="font-size:12px; font-weight:700; color:${p.headingColor}; text-transform:uppercase; letter-spacing:0.5px;">
                ${html(g.name)}
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${g.items.split(',').map(item => item.trim()).filter(Boolean).map(item => `
                  <span style="background:${p.badgeBgColor}; border:1px solid ${p.badgeBorderColor}; color:${p.badgeTextColor}; padding:6px 12px; border-radius:6px; font-size:13px; font-weight:600; display:inline-flex; align-items:center; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
                    <svg style="width:14px; height:14px; margin-right:6px; color:${p.iconColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    ${html(item)}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`
};
