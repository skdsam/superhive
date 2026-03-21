animatedMarquee export default (f, p, render, { field, select, addCountControls, ensureLength }) => {
    const rowWrap = document.createElement('div');
    rowWrap.className = 'row';
    rowWrap.appendChild(field('Items Per Row','number',p.itemsPerRow||3,(v)=>{ p.itemsPerRow=Math.max(1,parseInt(v)||1); render(); }));
    rowWrap.appendChild(field('Image Gap px','number',p.gap !== undefined ? p.gap : 12,(v)=>{ p.gap=Math.max(0,parseInt(v)||0); render(); }));
    f.appendChild(rowWrap);

    f.appendChild(select('Aspect Ratio', p.aspectRatio || '16/9', [
        { label: '16:9 (Wide)', value: '16/9' },
        { label: '4:3 (Photo)', value: '4/3' },
        { label: '1:1 (Square)', value: '1/1' },
        { label: '3:2 (Camera)', value: '3/2' },
        { label: '2:1 (Panorama)', value: '2/1' },
        { label: '9:16 (Portrait)', value: '9/16' },
        { label: 'Original', value: 'auto' }
    ], (v) => { p.aspectRatio = v; render(); }));

    if (!p.links) p.links = p.imgs.map(() => '');

    // addCountControls will call updateInspector after onChange thanks to shHelpers wiring
    addCountControls(f, 'Images', p.imgs.length, (n) => {
      p.imgs  = ensureLength(p.imgs,  n, () => ('https://picsum.photos/800/450?random=' + Math.random()));
      p.links = ensureLength(p.links, n, () => '');
      render();
    });

    p.imgs.forEach((src, idx) => {
      f.appendChild(field(`Image ${idx+1} URL`,  'text', src,               (v) => { p.imgs[idx]  = v; render(); }));
      f.appendChild(field(`Image ${idx+1} Link`, 'text', p.links[idx] || '', (v) => { p.links[idx] = v; render(); }));
    });
};
