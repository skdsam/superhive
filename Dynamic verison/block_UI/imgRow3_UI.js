export default (f, p, render, { field, addCountControls, ensureLength }) => {
    const rowWrap = document.createElement('div');
    rowWrap.className = 'row';
    rowWrap.appendChild(field('Items Per Row','number',p.itemsPerRow||3,(v)=>{ p.itemsPerRow=Math.max(1,parseInt(v)||1); render(); }));
    rowWrap.appendChild(field('Wrap Min Width px','number',p.minWidth||240,(v)=>{ p.minWidth=Math.max(0,parseInt(v)||0); render(); }));
    f.appendChild(rowWrap);

    addCountControls(f, 'Images', p.imgs.length, (n)=>{
      p.imgs = ensureLength(p.imgs, n, ()=>('https://picsum.photos/800/450?blur=0&random=' + Math.random()));
      render();
    });
    p.imgs.forEach((src,idx)=>{
      f.appendChild(field(`Image ${idx+1} URL`,'text',src,(v)=>{ p.imgs[idx]=v; render(); }));
    });
  };
