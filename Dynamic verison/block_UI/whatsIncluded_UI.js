export default (f, p, render, { field, select, textarea, addCountControls, ensureLength }) => {
    f.appendChild(field('Title', 'text', p.title, (v) => { p.title = v; render(); }));
    f.appendChild(field('Subtitle', 'text', p.subtitle, (v) => { p.subtitle = v; render(); }));
    f.appendChild(field('Title Color', 'color', p.titleColor, (v) => { p.titleColor = v; render(); }));
    f.appendChild(field('Subtitle Color', 'color', p.subtitleColor, (v) => { p.subtitleColor = v; render(); }));
    f.appendChild(field('Card BG Color', 'color', p.cardBgColor, (v) => { p.cardBgColor = v; render(); }));
    f.appendChild(field('Card Border Color', 'color', p.cardBorderColor, (v) => { p.cardBorderColor = v; render(); }));
    f.appendChild(field('Icon BG Color', 'color', p.iconBgColor, (v) => { p.iconBgColor = v; render(); }));
    f.appendChild(field('Icon Color', 'color', p.iconColor, (v) => { p.iconColor = v; render(); }));
    f.appendChild(field('Item Title Color', 'color', p.itemTitleColor, (v) => { p.itemTitleColor = v; render(); }));
    f.appendChild(field('Item Desc Color', 'color', p.itemDescColor, (v) => { p.itemDescColor = v; render(); }));

    addCountControls(f, 'Items', p.items.length, (n) => {
        p.items = ensureLength(p.items, n, () => ({ icon: 'file', title: 'New Item', desc: 'Description' }));
        render();
    });

    const iconOptions = [
      { label: '📦 ZIP Archive', value: 'zip' },
      { label: '🖼️ Image/Texture', value: 'image' },
      { label: '🎥 Video', value: 'video' },
      { label: '📄 Document (PDF)', value: 'pdf' },
      { label: '📁 Folder', value: 'folder' },
      { label: '💻 Source Code', value: 'code' },
      { label: '📃 Generic File', value: 'file' }
    ];

    p.items.forEach((item, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'sh-ui-group';
        wrap.style.cssText = 'margin-top:10px; padding:12px; background:var(--panel2); border:1px solid var(--border); border-radius:6px;';
        
        wrap.appendChild(field(`Item ${idx+1} Title`, 'text', item.title, (v) => { item.title = v; render(); }));
        wrap.appendChild(select('Icon Type', item.icon, iconOptions, (v) => { item.icon = v; render(); }));
        wrap.appendChild(textarea('Description', item.desc, (v) => { item.desc = v; render(); }));
        
        f.appendChild(wrap);
    });
};
