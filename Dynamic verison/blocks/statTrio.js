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
    cardColor:'',
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
    </div>`,
  inspector: (f, p, render, { field, addCountControls, ensureLength }) => {
    addCountControls(f, 'Items', p.items.length, (n)=>{
      p.items = ensureLength(p.items, n, ()=>({label:'Label', value:'Value'}));
      render();
    });
    p.items.forEach((it,idx)=>{
      f.appendChild(field(`Item ${idx+1} Label`,'text',it.label,(v)=>{ it.label=v; render(); }));
      f.appendChild(field(`Item ${idx+1} Value`,'text',it.value,(v)=>{ it.value=v; render(); }));
    });
    f.appendChild(field('Background','text', p.bg || '', (v)=>{ p.bg=v; render(); }));
    f.appendChild(field('Text Color','text', p.color || '', (v)=>{ p.color=v; render(); }));
    f.appendChild(field('Card Background','text', p.cardBg || '', (v)=>{ p.cardBg=v; render(); }));
    f.appendChild(field('Card Text Color','text', p.cardColor || '', (v)=>{ p.cardColor=v; render(); }));
  }
};
