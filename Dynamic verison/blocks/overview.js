export default {
  label: '📝 Overview Box',
  desc: 'h2 + paragraph',
  defaults: () => ({
    title:'Overview',
    text:'ChromaLight uses image colour data to design lighting that fits your reference perfectly. Generate multiple lights from an image palette or update existing lights and world settings to reflect your reference tone. Ideal for look development, colour matching, or creating cinematic lighting setups inspired by real photos and concept art.',
    baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:16px;color:#0f1220;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, html }) => `
    <div class="block" data-type="overview">
      <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
        <h2 style="margin:0 0 10px 0;font-size:20px;">${html(p.title)}</h2>
        <p style="margin:0;">${html(p.text)}</p>
      </div>
    </div>`,
  inspector: (f, p, render, { field, textarea }) => {
    f.appendChild(field('Heading','text',p.title,(v)=>{ p.title=v; render(); }));
    f.appendChild(textarea('Paragraph', p.text,(v)=>{ p.text=v; render(); }));
  }
};
