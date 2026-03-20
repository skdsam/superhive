export default (f, p, render, { field }) => {
  f.appendChild(field('Title', 'text', p.title, (v) => { p.title = v; render(); }));
  f.appendChild(field('Subtitle', 'text', p.subtitle, (v) => { p.subtitle = v; render(); }));
  f.appendChild(field('Price Tag', 'text', p.price, (v) => { p.price = v; render(); }));
  f.appendChild(field('Limit Count', 'number', p.limitCount, (v) => { p.limitCount = parseInt(v) || 0; render(); }));
  f.appendChild(field('Accent Color', 'text', p.accentColor, (v) => { p.accentColor = v; render(); }));
  f.appendChild(field('Background Color', 'text', p.bgColor, (v) => { p.bgColor = v; render(); }));
  f.appendChild(field('Text Color', 'text', p.textColor, (v) => { p.textColor = v; render(); }));
  f.appendChild(field('Badge Text Color', 'text', p.badgeTextColor, (v) => { p.badgeTextColor = v; render(); }));
};
