export default (f, p, render, { field }) => {
  f.appendChild(field('Title', 'text', p.title, (v) => { p.title = v; render(); }));
  f.appendChild(field('Promo Code', 'text', p.promoCode, (v) => { p.promoCode = v; render(); }));
  f.appendChild(field('Discount Label', 'text', p.discountLabel, (v) => { p.discountLabel = v; render(); }));
  f.appendChild(field('Validity Info', 'text', p.validity, (v) => { p.validity = v; render(); }));
  f.appendChild(field('Accent Color', 'text', p.accentColor, (v) => { p.accentColor = v; render(); }));
  f.appendChild(field('Background Color', 'text', p.bgColor, (v) => { p.bgColor = v; render(); }));
  f.appendChild(field('Text Color', 'text', p.textColor, (v) => { p.textColor = v; render(); }));
};
