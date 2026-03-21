export default (f, p, render, { field, textarea, select, color }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));

    const rowWrap = document.createElement('div');
    rowWrap.className = 'row';
    const icons = [
      { label: 'Checkmark (✔)', value: '✔' },
      { label: 'Dot (•)', value: '•' },
      { label: 'Light Check (✓)', value: '✓' },
      { label: 'Star (★)', value: '★' },
      { label: 'Sparkle (✦)', value: '✦' },
      { label: 'Arrow (►)', value: '►' },
      { label: 'Triangle (▸)', value: '▸' },
      { label: 'Square (■)', value: '■' },
      { label: 'Diamond (◆)', value: '◆' },
      { label: 'Dash (-)', value: '-' }
    ];
    if(select) rowWrap.appendChild(select('Bullet Icon', p.bulletIcon || '✔', icons, (v) => { p.bulletIcon = v; render(); }));
    if(color) rowWrap.appendChild(color('Color', p.bulletColor || '#2a3566', (v) => { p.bulletColor = v; render(); }));
    if(select || color) f.appendChild(rowWrap);

    f.appendChild(textarea('Bullets', p.bullets.join('\n'),(v)=>{ p.bullets=v.split(/\n+/).filter(Boolean); render(); }));
  };
