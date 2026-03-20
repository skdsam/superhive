export default {
  label: '🖼️ Single Media',
  desc: 'Image or GIF',
  defaults: () => ({
    src:'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
    alt:'Product Image',
    baseSurfaceStyle:'margin:0 0 18px 0;width:100%;height:auto;border-radius:16px;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, attr }) => `
    <div class="block" data-type="media">
      <img data-surface="1" src="${attr(p.src)}" alt="${attr(p.alt)}" style="${mergeSurfaceStyle(p)}">
    </div>`
};
