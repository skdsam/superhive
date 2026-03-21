export default (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title', 'text', p.title, (v)=>{ p.title=v; render(); }));
    f.appendChild(field('Title Color', 'color', p.titleColor, (v)=>{ p.titleColor=v; render(); }));
    f.appendChild(field('Heading Color', 'color', p.headingColor, (v)=>{ p.headingColor=v; render(); }));
    f.appendChild(field('Card BG Color', 'color', p.cardBgColor, (v)=>{ p.cardBgColor=v; render(); }));
    f.appendChild(field('Card Border Color', 'color', p.cardBorderColor, (v)=>{ p.cardBorderColor=v; render(); }));
    f.appendChild(field('Badge BG Color', 'color', p.badgeBgColor, (v)=>{ p.badgeBgColor=v; render(); }));
    f.appendChild(field('Badge Text Color', 'color', p.badgeTextColor, (v)=>{ p.badgeTextColor=v; render(); }));
    f.appendChild(field('Badge Border Color', 'color', p.badgeBorderColor, (v)=>{ p.badgeBorderColor=v; render(); }));
    f.appendChild(field('Icon Color', 'color', p.iconColor, (v)=>{ p.iconColor=v; render(); }));
    f.appendChild(arrayEditor('Groups', ['name','items'], p.groups, (a)=>{ p.groups=a; render(); }));
  };
