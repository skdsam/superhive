export default (f, p, render, { field, select }) => {
    f.appendChild(field('Text','text',p.text,(v)=>{ p.text=v; render(); }));
    f.appendChild(field('Background Color','text',p.bgColor,(v)=>{ p.bgColor=v; render(); }));
    f.appendChild(field('Text Color','text',p.textColor,(v)=>{ p.textColor=v; render(); }));
    f.appendChild(field('Speed (e.g. 20s)','text',p.speed,(v)=>{ p.speed=v; render(); }));
    f.appendChild(field('Rotation (deg)','number',p.rotation,(v)=>{ p.rotation=v; render(); }));
    f.appendChild(field('Font Size (px)','number',p.fontSize,(v)=>{ p.fontSize=v; render(); }));
    f.appendChild(field('Vertical Padding (px)','number',p.padding,(v)=>{ p.padding=v; render(); }));
    
    // Select for Reverse and Pause on Hover
    const boolOptions = [{l:'Yes',v:true}, {l:'No',v:false}];
    f.appendChild(select('Reverse Direction', p.reverse, boolOptions, (v)=>{ p.reverse = (v === 'true' || v === true); render(); }));
    f.appendChild(select('Pause on Hover', p.pauseOnHover, boolOptions, (v)=>{ p.pauseOnHover = (v === 'true' || v === true); render(); }));
  };
