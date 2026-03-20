export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Heading','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Paragraph', p.text,(v)=>{ p.text=v; render(); }));
  };
