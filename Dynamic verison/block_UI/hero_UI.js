export default (f, p, render, { field, textarea, arrayEditor }) => {
  f.appendChild(field('Title', 'text', p.title, (v) => { p.title = v; render(); }));
  f.appendChild(field('Subtitle', 'text', p.subtitle, (v) => { p.subtitle = v; render(); }));
  f.appendChild(field('Image URL', 'text', p.image.src, (v) => { p.image.src = v; render(); }));
  f.appendChild(field('Image Alt', 'text', p.image.alt, (v) => { p.image.alt = v; render(); }));
  f.appendChild(textarea('Intro HTML', p.blurbHTML, (v) => { p.blurbHTML = v; render(); }));

  f.appendChild(arrayEditor('Badges', ['text', 'bgColor', 'textColor'], p.badges, (a) => {
    p.badges = a; render();
  }));
};
