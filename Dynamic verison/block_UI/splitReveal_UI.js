export default (f, p, render, { field }) => {
    f.appendChild(field('Left Image','text',p.leftImg,(v)=>{ p.leftImg=v; render(); }));
    f.appendChild(field('Right Image','text',p.rightImg,(v)=>{ p.rightImg=v; render(); }));
    f.appendChild(field('Left Label','text',p.leftLabel,(v)=>{ p.leftLabel=v; render(); }));
    f.appendChild(field('Right Label','text',p.rightLabel,(v)=>{ p.rightLabel=v; render(); }));
    f.appendChild(field('Line Color','text',p.lineColor,(v)=>{ p.lineColor=v; render(); }));
  };
