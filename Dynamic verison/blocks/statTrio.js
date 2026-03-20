export default {
  label: '📊 Stats Trio',
  desc: 'Blender versions, Platforms, Includes',
  defaults: () => ({
    items:[
      { label:'Blender',   value:'3.6 – 4.5' },
      { label:'Platforms', value:'Windows • macOS • Linux' },
      { label:'Includes',  value:'Palette extraction • Light creation • World sync' },
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0;',
    style:'',
    bg:'',
    color:'',
    cardBg:'',
    cardColor:''
}),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="statTrio">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="display:flex;flex-wrap:wrap;gap:12px;">
          ${p.items.map(it=>`
            <div class="sh-card-soft" style="flex:1 1 180px;color:inherit;${p.cardBg?`background:${p.cardBg};`:``}${p.cardColor?`color:${p.cardColor};`:``}">
              <div style="font-size:12px;color:#5a6286;">${html(it.label)}</div>
              <div style="font-weight:700;">${html(it.value)}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`
};
