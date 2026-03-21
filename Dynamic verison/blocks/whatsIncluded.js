export default {
  label: '📦 What\'s Included',
  desc: 'Breakdown of included files and assets',
  defaults: () => ({
    title: 'What\'s Included in the Download',
    subtitle: 'Everything you need to get started immediately.',
    items: [
      { icon: 'zip', title: 'Addon Archive', desc: 'Ready-to-install .zip file containing the addon.' },
      { icon: 'image', title: '24 High-Res Textures', desc: '4K Diffuse, Normal, Roughness, and Displacement maps.' },
      { icon: 'file', title: 'Example Scenes', desc: '3 fully set up .blend files to study.' },
      { icon: 'code', title: 'Source Code', desc: 'Unobfuscated Python scripts for learning.' },
      { icon: 'pdf', title: 'Documentation', desc: 'Comprehensive PDF guide covering all features.' }
    ],
    titleColor: '#1e293b',
    subtitleColor: '#64748b',
    cardBgColor: '#f8fafc',
    cardBorderColor: '#e2e8f0',
    iconBgColor: '#eef2ff',
    iconColor: '#4f46e5',
    itemTitleColor: '#1e293b',
    itemDescColor: '#64748b',
    baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:14px;padding:32px;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => {
    const icons = {
      zip: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>`,
      image: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      video: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`,
      file: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
      pdf: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
      code: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
      folder: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`
    };
    
    return `
    <div class="block" data-type="whatsIncluded">
      <div class="sh-card-soft" data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h3 style="margin:0 0 8px 0; font-size:24px; font-weight:700; color:${p.titleColor}; text-align:center;">${html(p.title)}</h3>
        <p style="margin:0 0 32px 0; font-size:15px; color:${p.subtitleColor}; text-align:center;">${html(p.subtitle)}</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
          ${p.items.map(item => `
            <div style="display:flex; align-items:flex-start; gap:16px; padding:16px; background:${p.cardBgColor}; border:1px solid ${p.cardBorderColor}; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
              <div style="width:40px; height:40px; flex-shrink:0; background:${p.iconBgColor}; color:${p.iconColor}; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                <div style="width:20px; height:20px;">
                  ${icons[item.icon] || icons['file']}
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                <strong style="font-size:15px; color:${p.itemTitleColor}; font-weight:600;">${html(item.title)}</strong>
                <span style="font-size:13.5px; color:${p.itemDescColor}; line-height:1.5;">${html(item.desc)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`
  }
};
