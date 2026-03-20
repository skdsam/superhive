export default {
  label:'🧩 More Add-ons Grid',
  desc:'Cards linked directly to Global Template',
  defaults:()=>({
    introTitle:'Discover more Blender add-ons',
    introSub:'Hand-picked tools to speed up your workflow',
    baseSurfaceStyle:'color:#0f1220;',
    style:''
  }),
  render:(p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="moreAddons">
      <div class="sh-container" data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div style="position:relative;border-radius:16px;overflow:hidden;margin:0 0 14px 0;">
          <div style="position:absolute;background:radial-gradient(900px 280px at -10% -20%, rgba(255,255,255,.08), transparent 60%) , radial-gradient(700px 240px at 110% 120%, rgba(198,255,238,.10), transparent 60%);"></div>
          <div style="position:relative;display:flex;align-items:center;background:linear-gradient(135deg,#0f1220,#1b2451);border:1px solid rgba(255,255,255,.15);color:#eaf0ff;padding:16px;border-radius:16px;">
            <div style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);border-radius:12px;font-size:18px;flex:0 0 auto;">✨</div>
            <div style="flex:1 1 auto;">
              <div style="font-weight:700;font-size:18px;line-height:1.25;margin:0 0 2px 0;">${html(p.introTitle)}</div>
              <div style="font-size:13px;color:#c9d6ff;">${html(p.introSub)}</div>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap; gap:12px;">
          ${(window.globalAddonsRegistry || []).map(c=>`
            <a href="${attr(c.href)}" style="flex:1 1 260px;min-width:240px;box-sizing:border-box;max-width:100%;text-decoration:none;color:inherit;background:#ffffff;border:1px solid #e2e6f4;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;">
              <div style="aspect-ratio:16 / 9;background:#f2f4fb;overflow:hidden;">
                <img src="${attr(c.img)}" alt="${attr(c.title)}" style="width:100%;height:100%;display:block;">
              </div>
              <div style="padding:12px;">
                <div style="font-weight:700;margin-bottom:4px;">${html(c.title)}</div>
                <div style="font-size:13px;color:#394067;">${html(c.sub)}</div>
                <div style="display:flex;flex-wrap:wrap;margin-top:8px; gap:6px;">
                  ${(c.tags||[]).map(t=>`<span class="tag">${html(t)}</span>`).join('')}
                </div>
              </div>
            </a>`).join('')}
        </div>
      </div>
    </div>`,
  inspector: (f, p, render, { field, openGlobalAddonsModal }) => {
    f.appendChild(field('Intro Title','text',p.introTitle,(v)=>{ p.introTitle=v; render(); }));
    f.appendChild(field('Intro Sub','text',p.introSub,(v)=>{ p.introSub=v; render(); }));
    
    const notice = document.createElement('div');
    notice.className = 'field';
    notice.innerHTML = `<label>Global Config</label><button class="tool" style="width:100%; border-color:var(--accent); color:var(--accent);">Edit Global Add-ons Template</button>`;
    notice.querySelector('button').onclick = () => openGlobalAddonsModal();
    f.appendChild(notice);
  }
};
