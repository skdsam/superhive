export default {
  label: '🖼️ Responsive Image Row',
  desc: 'Configurable grid of images',
  defaults: () => ({
    itemsPerRow: 3,
    minWidth: 240,
    imgs: [
      'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
      'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
      'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG'
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, attr }) => `
    <div class="block" data-type="imgRow3">
      <div data-surface="1" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(${p.minWidth}px, 1fr)); gap:12px; ${mergeSurfaceStyle(p)}">
        ${p.imgs.map(src=>`<img src="${attr(src)}" style="width:100%; border-radius:12px; display:block;">`).join('')}
      </div>
    </div>`
};
