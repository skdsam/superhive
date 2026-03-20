export default {
  label: '⬍ Empty Spacer',
  desc: 'Vertical blank space',
  defaults:()=>({
    height: '40px',
    baseSurfaceStyle: '',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, attr }) => `<div class="block" data-type="spacer"><div data-surface="1" style="height:${attr(p.height)}; ${attr(mergeSurfaceStyle(p))}"></div></div>`,
  inspector: (f, p, render, { field }) => {
    f.appendChild(field('Height (px, rem)', 'text', p.height, (v)=>{ p.height=v; render(); }));
  }
};
