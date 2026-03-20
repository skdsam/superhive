export default (f, p, render, { arrayEditor }) => {
    f.appendChild(arrayEditor('Tiers', ['name','price','desc','highlight','feats'], p.tiers, (a)=>{ p.tiers=a; render(); }));
  };
