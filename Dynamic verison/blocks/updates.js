export default {
  label: '🆕 Release Updates',
  desc: 'Version notes list',
  defaults: () => ({
    title: 'Recent Improvements',
    badgeText: 'UPDATES',
    items: [
      { v:'v1.0.8', notes:['Improved light analysis algorithm','New "Warmth" setting for light temperature','UI performance optimisations'] },
      { v:'v1.0.7', notes:['Added Cycles light grouping','Fixed world background sync bug'] },
    ],
    badgeBgColor:'#eaf0ff',
    badgeTextColor:'#2a3566',
    titleColor:'#1a1a1a',
    versionColor:'#2a3566',
    notesColor:'#5a6286',
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="updates">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;color:${attr(p.titleColor || '#1a1a1a')};">
          <span style="background:${attr(p.badgeBgColor || '#eaf0ff')};color:${attr(p.badgeTextColor || '#2a3566')};padding:2px 8px;border-radius:6px;font-size:11px;">${html(p.badgeText || 'UPDATES')}</span>
          <span>${html(p.title || 'Recent Improvements')}</span>
        </div>
        ${(p.items || []).map(it=>`
          <div style="display:flex;margin-bottom:14px;">
            <div style="flex:0 0 70px;font-weight:700;color:${attr(p.versionColor || '#2a3566')};font-size:13px;">${html(it.v)}</div>
            <ul style="margin:0;padding-left:14px;font-size:13px;color:${attr(p.notesColor || '#5a6286')};">
              ${(it.notes||[]).map(n=>`<li>${html(n)}</li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
    </div>`
};
