export default (f, p, render, { field, select, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    
    const types = [{label:'Initials',value:'initials'}, {label:'Generic Icon',value:'icon'}, {label:'Custom Image',value:'image'}];
    f.appendChild(select('Avatar Type', p.avatarType, types, (v)=>{ p.avatarType=v; render(); }));

    f.appendChild(arrayEditor('Reviews', ['name','role','text','stars','thumb'], p.reviews, (a)=>{ p.reviews=a; render(); }));
  };
