export default {
  label: '⭐ Testimonials',
  desc: 'User reviews grid',
  defaults: () => ({
    title: 'What Artists Are Saying',
    reviews: [
      { name:'Alex Rivera', role:'Concept Artist', text:'Matched my reference lighting in 2 minutes. Usually takes me 20.', stars:5, thumb:'https://i.pravatar.cc/100?u=1' },
      { name:'Sarah Chen',  role:'Env Architect', text:'The color palette extraction is insanely accurate.', stars:5, thumb:'https://i.pravatar.cc/100?u=2' }
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="testimonials">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h3 style="text-align:center; font-size:24px; margin-bottom:24px; color:#111827;">${html(p.title)}</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
          ${p.reviews.map(r=>`
            <div class="sh-card" style="display:flex; flex-direction:column; gap:12px; background:#fff;">
              <div style="display:flex; gap:12px; align-items:center;">
                <img src="${attr(r.thumb)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                <div>
                  <div style="font-weight:700; font-size:14px;">${html(r.name)}</div>
                  <div style="font-size:12px; color:#6b7280;">${html(r.role)}</div>
                </div>
              </div>
              <div style="color:#f59e0b; font-size:12px;">${'★'.repeat(r.stars)}</div>
              <p style="margin:0; font-size:14px; color:#374151; line-height:1.5;">"${html(r.text)}"</p>
            </div>`).join('')}
        </div>
      </div>
    </div>`
};
