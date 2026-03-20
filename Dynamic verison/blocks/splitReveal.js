export default {
  label: '🌓 Split Reveal',
  desc: 'Side-by-side labels + images',
  defaults: () => ({
    leftImg: 'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
    rightImg: 'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG',
    leftLabel: 'NIGHT MODE',
    rightLabel: 'DAY MODE',
    lineColor: '#3b82f6',
    baseSurfaceStyle: 'margin:24px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="splitReveal">
      <div data-surface="1" style="display:flex; height:600px; border-radius:32px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); ${mergeSurfaceStyle(p)}">
        <div style="flex:1; position:relative; overflow:hidden;">
          <img src="${attr(p.leftImg)}" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; inset:0; background:linear-gradient(to right, rgba(0,0,0,0.8), transparent);"></div>
          <div style="position:absolute; bottom:40px; left:40px; font-size:24px; font-weight:900; color:#fff; letter-spacing:4px;">${html(p.leftLabel)}</div>
        </div>
        <div style="width:4px; background:${attr(p.lineColor)}; position:relative; z-index:2; box-shadow:0 0 30px ${attr(p.lineColor)};"></div>
        <div style="flex:1; position:relative; overflow:hidden;">
          <img src="${attr(p.rightImg)}" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; inset:0; background:linear-gradient(to left, rgba(0,0,0,0.8), transparent);"></div>
          <div style="position:absolute; bottom:40px; right:40px; font-size:24px; font-weight:900; color:#fff; letter-spacing:4px; text-align:right;">${html(p.rightLabel)}</div>
        </div>
      </div>
    </div>`
};
