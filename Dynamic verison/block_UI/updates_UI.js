export default (f, p, render, { field, arrayEditor }) => {
  f.appendChild(field('Main Title', 'text', p.title, (v) => { p.title = v; render(); }));
  f.appendChild(field('Badge Text', 'text', p.badgeText, (v) => { p.badgeText = v; render(); }));
  
  f.appendChild(field('Badge Background', 'text', p.badgeBgColor, (v) => { p.badgeBgColor = v; render(); }));
  f.appendChild(field('Badge Text Color', 'text', p.badgeTextColor, (v) => { p.badgeTextColor = v; render(); }));
  f.appendChild(field('Title Color', 'text', p.titleColor, (v) => { p.titleColor = v; render(); }));
  f.appendChild(field('Version Color', 'text', p.versionColor, (v) => { p.versionColor = v; render(); }));
  f.appendChild(field('Notes Color', 'text', p.notesColor, (v) => { p.notesColor = v; render(); }));
  
  // Transform notes from array to newline string for the editor
  const editorItems = (p.items || []).map(it => ({
    ...it,
    notes: Array.isArray(it.notes) ? it.notes.join('\n') : (it.notes || '')
  }));

  f.appendChild(arrayEditor('Update Versions', ['v', 'notes'], editorItems, (a) => { 
    p.items = a.map(it => ({
      ...it,
      // Transform notes from newline string back to list for the block
      notes: typeof it.notes === 'string' ? it.notes.split(/\n+/).filter(Boolean) : (it.notes || [])
    }));
    render(); 
  }));
};
