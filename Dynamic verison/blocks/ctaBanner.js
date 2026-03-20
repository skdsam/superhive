export default {
  label: '📢 CTA Banner',
  desc: 'Hero-style call to action',
  defaults: () => ({
    headline: 'Ready to elevate your renders?',
    sub: 'Get ChromaLight today and match your reference lighting in seconds.',
    image:'https://assets.superhivemarket.com/cache/4220398c8b981fce85a6d08f76cd32d1.gif',
    gif:'https://assets.superhivemarket.com/cache/4220398c8b981fce85a6d08f76cd32d1.gif',
    color:'',
    baseSurfaceStyle:'margin:0 0 18px 0; background:linear-gradient(135deg,#0f1220,#1b2451); color:#eaf0ff; padding:48px 24px; border-radius:16px; text-align:center;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="ctaBanner">
      <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
        <h2 style="font-size:32px; font-weight:900; margin:0 0 12px 0;">${html(p.headline)}</h2>
        <p style="font-size:18px; opacity:0.7; margin:0 0 32px 0;">${html(p.sub)}</p>
        <div style="max-width:400px; margin:0 auto; overflow:hidden; border-radius:12px; border:1px solid rgba(255,255,255,0.2);">
          <img src="${attr(p.image)}" style="width:100%; display:block;">
        </div>
      </div>
    </div>`
};
