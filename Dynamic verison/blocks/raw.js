export default {
  label:'📜 Raw HTML',
  desc:'Paste custom snippet',
  defaults:()=>({
    html:'<div style="padding:16px;border:1px dashed #e2e6f4;border-radius:12px;background:#fff;color:#0f1220;">Custom HTML…</div>',
    baseSurfaceStyle:'',
    style:''
  }),
  render:(p, { mergeSurfaceStyle }) => `<div class="block" data-type="raw"><div data-surface="1" style="${mergeSurfaceStyle(p)}">${p.html}</div></div>`,
  inspector: (f, p, render, { textarea }) => {
    f.appendChild(textarea('Raw HTML', p.html,(v)=>{ p.html=v; render(); }));
  }
};
