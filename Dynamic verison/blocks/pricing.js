export default {
  label: '💰 Pricing Tiers',
  desc: 'Subscription or flat fee',
  defaults: () => ({
    tiers: [
      { name:'Basic', price:'$19', desc:'For hobbyists', btn:'Buy Basic', highlight:'false', feats:['Core Tool','Cycles Support','Standard Updates'] },
      { name:'Pro',   price:'$39', desc:'Best for freelancers', btn:'Get Pro', highlight:'true', feats:['Core Tool','Cycles/Eevee Support','Kelvin Controls','Priority Support'] },
      { name:'Studio', price:'$99', desc:'For agencies', btn:'Buy Studio', highlight:'false', feats:['Up to 5 seats','Volume licensing','All Pro features'] }
    ],
    baseSurfaceStyle:'margin:0 0 32px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="pricing">
      <div data-surface="1" style="display:flex; flex-wrap:wrap; align-items:flex-end; gap:20px; justify-content:center; ${mergeSurfaceStyle(p)}">
        ${p.tiers.map(t=> {
          const isHi = t.highlight === 'true';
          return `
            <div class="sh-card" style="flex:1; min-width:260px; max-width:320px; display:flex; flex-direction:column; gap:20px; background:#fff; ${isHi?'border:2px solid #3b82f6; box-shadow:0 20px 25px -5px rgba(59,130,246,0.1); transform:scale(1.05); z-index:2;':''}">
              <div>
                <div style="font-weight:800; font-size:20px; margin-bottom:4px;">${html(t.name)}</div>
                <p style="margin:0; font-size:14px; color:#6b7280;">${html(t.desc)}</p>
              </div>
              <div style="font-size:36px; font-weight:900; color:#111827;">${html(t.price)}</div>
              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:14px; color:#4b5563;">
                ${(t.feats||[]).map(f=>`<li><span style="color:#10b981; margin-right:8px;">✓</span>${html(f)}</li>`).join('')}
              </ul>
              <button style="width:100%; border:none; padding:12px; border-radius:8px; font-weight:800; cursor:pointer; background:${isHi?'#3b82f6':'#1f2937'}; color:#fff;">${html(t.btn)}</button>
            </div>`;
        }).join('')}
      </div>
    </div>`,
  inspector: (f, p, render, { arrayEditor }) => {
    f.appendChild(arrayEditor('Tiers', ['name','price','desc','btn','highlight','feats'], p.tiers, (a)=>{ p.tiers=a; render(); }));
  }
};
