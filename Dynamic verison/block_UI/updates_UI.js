export default (f, p, render, { field, arrayEditor }) => {
  f.appendChild(field('Main Title', 'text', p.title, (v) => { p.title = v; render(); }));
  f.appendChild(field('Badge Text', 'text', p.badgeText, (v) => { p.badgeText = v; render(); }));
  
  f.appendChild(field('Badge Background', 'text', p.badgeBgColor, (v) => { p.badgeBgColor = v; render(); }));
  f.appendChild(field('Badge Text Color', 'text', p.badgeTextColor, (v) => { p.badgeTextColor = v; render(); }));
  f.appendChild(field('Title Color', 'text', p.titleColor, (v) => { p.titleColor = v; render(); }));
  f.appendChild(field('Version Color', 'text', p.versionColor, (v) => { p.versionColor = v; render(); }));
  f.appendChild(field('Notes Color', 'text', p.notesColor, (v) => { p.notesColor = v; render(); }));
  
  f.appendChild(arrayEditor('Update Versions', ['v', 'notes'], p.items, (a) => { 
    p.items = a;
    render(); 
  }));
};
