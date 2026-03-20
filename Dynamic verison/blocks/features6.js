export default {
  label: '📦 6-Feature Grid',
  desc: 'Grid of 6 icon + title + desc',
  defaults: () => ({
    cards: [
      { t:'Auto-Generate Lights', d:'Click once to create lights from image colours.' },
      { t:'Match Reference',     d:'Analyse a reference image for perfect lighting.' },
      { t:'Live Preview',        d:'See changes instantly in Eevee or Cycles.' },
      { t:'Light Temperature',   d:'Automatic Kelvin temperature conversion.' },
      { t:'World Environment',   d:'Sync world background to reference tone.' },
      { t:'Easy Setup',          d:'No complex node setups required.' },
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:'',
    bg:'',
    color:'',
    cardBg:'',
    cardColor:''
}),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="features6">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
          ${p.cards.map(c=>`
            <div class="sh-card" style="color:inherit;${p.cardBg?`background:${p.cardBg};`:``}${p.cardColor?`color:${p.cardColor};`:``}">
              <div style="font-weight:700;margin-bottom:4px;">${html(c.t)}</div>
              <div style="font-size:14px;color:#5a6286;${p.cardColor?`color:inherit;`:``}">${html(c.d)}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`
};
