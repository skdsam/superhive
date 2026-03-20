export default (f, p, render, { field }) => {
    f.appendChild(field('Left Image URL','text',p.leftImg,(v)=>{ p.leftImg=v; render(); }));
    f.appendChild(field('Left Label','text',p.leftLabel,(v)=>{ p.leftLabel=v; render(); }));
    f.appendChild(field('Right Image URL','text',p.rightImg,(v)=>{ p.rightImg=v; render(); }));
    f.appendChild(field('Right Label','text',p.rightLabel,(v)=>{ p.rightLabel=v; render(); }));
  };
