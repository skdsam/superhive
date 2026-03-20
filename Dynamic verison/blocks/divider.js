export default {
  label: '➖ Divider Line',
  desc: 'Horizontal rule',
  defaults:()=>({
    color: '#e5e7eb',
    thickness: '1px',
    margin: '32px 0',
    baseSurfaceStyle: '',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, attr }) => `<div class="block" data-type="divider"><div data-surface="1" style="padding:1px; ${attr(mergeSurfaceStyle(p))}"><hr style="border:none; border-top:${attr(p.thickness)} solid ${attr(p.color)}; margin:${attr(p.margin)}; width:100%;"></div></div>`,
  inspector: (f, p, render, { field }) => {
    f.appendChild(field('Line Color', 'text', p.color, (v)=>{ p.color=v; render(); }));
    f.appendChild(field('Thickness', 'text', p.thickness, (v)=>{ p.thickness=v; render(); }));
    f.appendChild(field('Margin', 'text', p.margin, (v)=>{ p.margin=v; render(); }));
  }
};
