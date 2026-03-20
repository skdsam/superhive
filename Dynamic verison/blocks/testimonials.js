export default {
  label: '⭐ Testimonials',
  desc: 'User reviews grid',
  defaults: () => ({
    title: 'What Artists Are Saying',
    avatarType: 'initials', // 'image', 'initials', 'icon'
    reviews: [
      { name:'Alex Rivera', role:'Concept Artist', text:'Matched my reference lighting in 2 minutes. Usually takes me 20.', stars:5, thumb:'' },
      { name:'Sarah Chen',  role:'Env Architect', text:'The color palette extraction is insanely accurate.', stars:5, thumb:'' }
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    const getAvatar = (r) => {
        if(p.avatarType === 'initials') {
            return `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=f3f4f6&color=4b5563&bold=true&rounded=true" style="width:40px;height:40px;border-radius:50%;">`;
        }
        if(p.avatarType === 'icon') {
            return `
            <div style="width:40px;height:40px;border-radius:50%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af;">
                <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>`;
        }
        return `<img src="${attr(r.thumb || 'https://i.pravatar.cc/100?u='+Math.random())}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`;
    };

    return `
    <div class="block" data-type="testimonials">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h3 style="text-align:center; font-size:24px; margin-bottom:24px; color:#111827;">${html(p.title)}</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
          ${p.reviews.map(r=>`
            <div class="sh-card" style="display:flex; flex-direction:column; gap:12px; background:#fff;">
              <div style="display:flex; gap:12px; align-items:center;">
                ${getAvatar(r)}
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
    </div>`;
  }
};
