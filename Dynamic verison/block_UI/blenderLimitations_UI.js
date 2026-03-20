export default (f, p, render, { field, arrayEditor }) => {
  f.appendChild(field('Title', 'text', p.title, (v) => { p.title = v; render(); }));
  f.appendChild(field('Subtitle', 'text', p.subtitle, (v) => { p.subtitle = v; render(); }));
  f.appendChild(field('Accent Color', 'text', p.accentColor, (v) => { p.accentColor = v; render(); }));
  f.appendChild(field('Background Color', 'text', p.bgColor, (v) => { p.bgColor = v; render(); }));
  f.appendChild(field('Text Color', 'text', p.textColor, (v) => { p.textColor = v; render(); }));
  f.appendChild(arrayEditor('Limitations', ['icon', 'title', 'desc'], p.items, (a) => { p.items = a; render(); }));
};
