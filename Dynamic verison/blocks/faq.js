export default {
  label: '❓ FAQ Accordion',
  desc: 'Collapsible Q&A',
  defaults: () => ({
    title: 'Common Questions',
    faqs: [
      { q:'Does this support Eevee?', a:'Yes, ChromaLight fully supports Eevee Next in Blender 4.2+ and legacy Eevee in 3.6.' },
      { q:'Can I use my own lights?', a:'Absolutely. You can choose to update existing lights in your scene rather than creating new ones.' }
    ],
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="faq">
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h3 style="margin-bottom:24px; font-size:22px; color:#111827;">${html(p.title)}</h3>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${p.faqs.map(f=>`
            <div class="sh-card" style="background:#fff;">
              <div style="font-weight:700; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; color:#111827;">
                ${html(f.q)} <span style="font-size:10px; color:#94a3b8;">▼</span>
              </div>
              <div style="font-size:14px; color:#4b5563; line-height:1.5;">${html(f.a)}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, arrayEditor }) => {
    f.appendChild(field('Title','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(arrayEditor('Questions', ['q','a'], p.faqs, (a)=>{ p.faqs=a; render(); }));
  }
};
