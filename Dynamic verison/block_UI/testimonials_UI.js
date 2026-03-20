export default (f, p, render, { field, select, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    
    const types = [{l:'Initials',v:'initials'}, {l:'Generic Icon',v:'icon'}, {l:'Custom Image',v:'image'}];
    f.appendChild(select('Avatar Type', p.avatarType, types, (v)=>{ p.avatarType=v; render(); }));

    f.appendChild(arrayEditor('Reviews', ['name','role','text','stars','thumb'], p.reviews, (a)=>{ p.reviews=a; render(); }));
  };
