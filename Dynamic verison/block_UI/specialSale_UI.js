export default (f, p, render, { field }) => {
    f.appendChild(field('Title', 'text', p.title, (v) => { p.title = v; render(); }));
    f.appendChild(field('Subtitle', 'text', p.subtitle, (v) => { p.subtitle = v; render(); }));
    f.appendChild(field('Old Price', 'text', p.oldPrice, (v) => { p.oldPrice = v; render(); }));
    f.appendChild(field('New Price', 'text', p.newPrice, (v) => { p.newPrice = v; render(); }));
    f.appendChild(field('Date Range', 'text', p.dateRange, (v) => { p.dateRange = v; render(); }));
    f.appendChild(field('Button Text', 'text', p.buttonText, (v) => { p.buttonText = v; render(); }));
    f.appendChild(field('Background Color 1', 'text', p.bgColor1, (v) => { p.bgColor1 = v; render(); }));
    f.appendChild(field('Background Color 2', 'text', p.bgColor2, (v) => { p.bgColor2 = v; render(); }));
    f.appendChild(field('Text Color', 'text', p.textColor, (v) => { p.textColor = v; render(); }));
  };
