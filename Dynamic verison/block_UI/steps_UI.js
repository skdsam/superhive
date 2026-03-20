export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(field('Circle Background','text',p.circleBg || '#3b82f6',(v)=>{ p.circleBg=v; render(); }));
    f.appendChild(field('Circle Text Color','text',p.circleColor || '#ffffff',(v)=>{ p.circleColor=v; render(); }));
    f.appendChild(arrayEditor('Steps', ['num','title','desc'], p.steps, (a)=>{ p.steps=a; render(); }));
  };
