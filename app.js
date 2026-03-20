/* =========================
   SuperHive Builder (fixed surfaces + DnD)
   ========================= */

const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* -------------------------
   Global Definitions
------------------------- */
const defaultGlobalAddons = [
  { href:'https://superhivemarket.com/products/collection-compactor', img:'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG', title:'Collection Compactor', sub:'Hide/show collections, compact the Outliner, search hidden items.', tags:['Outliner','Blender 3.6–4.5'] },
  { href:'https://superhivemarket.com/products/isometric-room-generator', img:'https://assets.superhivemarket.com/cache/af9e9b8a5b31fb6b079b116b78f1ccd5.png', title:'IRG — Isometric Room Generator', sub:'Generate square/round rooms + windows in seconds.', tags:['Isometric','Windows'] },
  { href:'https://superhivemarket.com/products/key-capture', img:'https://assets.superhivemarket.com/cache/f191b28230006e8ecfecb21dc44d0bfe.gif', title:'Key Capture', sub:'Show keys & mouse live in the viewport for tutorials.', tags:['Teaching','HUD'] },
  { href:'https://superhivemarket.com/products/maze-maker', img:'https://assets.superhivemarket.com/cache/5ab8e4f8c67678fe4eee5c26a0077211.png', title:'Maze Maker', sub:'Procedural mazes, rooms, loop probability + BFS path.', tags:['Procedural','Path'] },
];

window.globalAddonsRegistry = [];
try {
  const savedGlobal = localStorage.getItem('sh_global_addons');
  window.globalAddonsRegistry = savedGlobal ? JSON.parse(savedGlobal) : defaultGlobalAddons;
} catch(e) {
  window.globalAddonsRegistry = defaultGlobalAddons;
}

function saveGlobalAddonsRegistry() {
  localStorage.setItem('sh_global_addons', JSON.stringify(window.globalAddonsRegistry));
  render(); // Updates any active moreAddons blocks immediately on canvas!
}

/* -------------------------
   State
------------------------- */
const state = {
  blocks: [],
  selectedId: null,
  drag: {
    sourceId: null,
    newType: null,
    overId: null,
    where: 'before'
  }
};

const uid = () => 'b_' + Math.random().toString(36).slice(2, 9);

/* -------------------------
   Block registry
   NOTE: each render returns a single “surface” element inside the .block
         (the one that should receive style overrides).
         We mark it with data-surface="1".
------------------------- */
const Blocks = {
  hero: {
    label: 'Hero Header',
    desc: 'Logo/GIF, title, subtitle, badges',
    defaults: () => ({
      title: 'ChromaLight',
      subtitle: 'Blender Add-on',
      badges: [
        { text:'Image-Based Lighting', style:'display:inline-block;background:#3a2d17;color:#ffeec6;border:1px solid rgba(255,238,198,.25);padding:6px 10px;border-radius:999px;font-size:12px;' },
        { text:'Automatic Light Setup', style:'display:inline-block;background:#17323a;color:#c6ffee;border:1px solid rgba(198,255,238,.25);padding:6px 10px;border-radius:999px;font-size:12px;' },
        { text:'Colour Grading',        style:'display:inline-block;background:#2a3566;color:#eaf0ff;border:1px solid rgba(255,255,255,.15);padding:6px 10px;border-radius:999px;font-size:12px;' },
      ],
      image: { src:'https://assets.superhivemarket.com/cache/4220398c8b981fce85a6d08f76cd32d1.gif', alt:'Preview', style:'width:92px;height:92px;border-radius:14px;border:1px solid rgba(255,255,255,.2);' },
      blurbHTML: '<strong>Instantly match your lighting to any image.</strong> ChromaLight analyses your reference image and extracts its colour palette to automatically generate or update your scene lights and world background — giving your render a cohesive mood and professional grade.',
      // immutable defaults for the surface (your edits override these)
      baseSurfaceStyle: 'background:linear-gradient(135deg,#0f1220,#1b2451);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:28px 26px;color:#eaf0ff;',
      style: '' // user overrides
    }),
    render: (p) => `
      <div class="block" data-type="hero">
        <div data-surface="1" style="${mergeSurfaceStyle(p)}">
          <div style="display:flex;align-items:center;flex-wrap:wrap;">
            <img src="${attr(p.image.src)}" alt="${attr(p.image.alt)}" style="${p.image.style}">
            <div style="flex:1 1 320px;">
              <div style="font-size:13px;letter-spacing:.08em;">&nbsp;${html(p.subtitle)}</div>
              <h1 style="margin:6px 0 8px 0;font-size:28px;line-height:1.2;">&nbsp;${html(p.title)}&nbsp;</h1>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${p.badges.map(b=>`<span style="${b.style}">${html(b.text)}</span>`).join('')}
              </div>
            </div>
          </div>
          <div style="margin-top:14px;font-size:14px;">${p.blurbHTML}</div>
        </div>
      </div>`
  },

  statTrio: {
    label:'Stats Trio',
    desc:'Blender versions, Platforms, Includes',
    defaults: () => ({
      items:[
        { label:'Blender',   value:'3.6 – 4.5' },
        { label:'Platforms', value:'Windows • macOS • Linux' },
        { label:'Includes',  value:'Palette extraction • Light creation • World sync' },
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0;',
      style:'',
    
      bg:'',
      color:'',
      cardBg:'',
      cardColor:'',
}),
    render:(p)=>`
      <div class="block" data-type="statTrio">
        <div data-surface="1" style="${mergeSurfaceStyle(p)}">
          <div style="display:flex;flex-wrap:wrap;gap:12px;">
            ${p.items.map(it=>`
              <div class="sh-card-soft" style="flex:1 1 180px;color:inherit;${p.cardBg?`background:${p.cardBg};`:``}${p.cardColor?`color:${p.cardColor};`:``}">
                <div style="font-size:12px;color:#5a6286;">${html(it.label)}</div>
                <div style="font-weight:700;">${html(it.value)}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>`
  },

  overview: {
    label:'Overview Box',
    desc:'h2 + paragraph',
    defaults:()=>({
      title:'Overview',
      text:'ChromaLight uses image colour data to design lighting that fits your reference perfectly. Generate multiple lights from an image palette or update existing lights and world settings to reflect your reference tone. Ideal for look development, colour matching, or creating cinematic lighting setups inspired by real photos and concept art.',
      baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:16px;color:#0f1220;',
      style:''
    }),
    render:(p)=>`
      <div class="block" data-type="overview">
        <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
          <h2 style="margin:0 0 10px 0;font-size:20px;">${html(p.title)}</h2>
          <p style="margin:0;">${html(p.text)}</p>
        </div>
      </div>`
  },

  features6: {
    label:'Six Feature Grid',
    desc:'6 cards with title + desc',
    defaults:()=>({
      cards:[
        {t:'Extract Palette from Any Image',d:'Automatically sample key colours and brightness levels from your reference image.'},
        {t:'Auto Light Generation',d:'Create lights using extracted colours to form balanced, realistic illumination.'},
        {t:'Update Existing Lights',d:'Adapt your scene lighting dynamically to match new palettes or references.'},
        {t:'World Background Sync',d:'Automatically adjust world background colour to maintain tone consistency.'},
        {t:'Mood-Based Lighting',d:'Get cinematic, painterly lighting by referencing colour compositions from art or film.'},
        {t:'Editable Output',d:'Fine-tune light strength, hue, and world exposure after generation.'},
      ],
      baseSurfaceStyle:'margin:0 0 18px 0;',
      style:'',
    
      bg:'',
      color:'',
      cardBg:'',
      cardColor:'',
}),
    render:(p)=>`
      <div class="block" data-type="features6">
        <div data-surface="1" style="${mergeSurfaceStyle(p)}">
          <div style="display:flex;flex-wrap:wrap; gap:12px;">
            ${p.cards.map(c=>`
            <div class="sh-card" style="flex:1 1 260px;${p.cardBg?`background:${p.cardBg};`:``}${p.cardColor?`color:${p.cardColor};`:``}">
              <div style="font-weight:700;margin-bottom:6px;">${html(c.t)}</div>
              <div style="color:#394067;">${html(c.d)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`
  },

  media: {
    label:'Media Panel',
    desc:'Single image/GIF',
    defaults:()=>({
      src:'https://assets.superhivemarket.com/cache/04ebdd07537f7103c5b4b0e6bfda8814.gif',
      alt:'Demo',
      baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:16px;color:#0f1220;text-align:center;',
      style:''
    }),
    render:(p)=>`
      <div class="block" data-type="media">
        <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
          <img src="${attr(p.src)}" alt="${attr(p.alt)}" style="max-width:100%;"/>
        </div>
      </div>`
  },

  youtube: {
    label:'YouTube Embed',
    desc:'16:9 iframe',
    defaults:()=>({
      url:'https://www.youtube-nocookie.com/embed/fSUy4PF8ReI',
      baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:0;color:#0f1220;',
      style:''
    }),
    render:(p)=>`
      <div class="block" data-type="youtube">
        <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
          <div class="ratio ratio-16x9" style="position:relative;padding-top:56.25%;overflow:hidden;border-radius:16px;">
            <iframe src="${attr((p.url||'').replace('youtube.com', 'youtube-nocookie.com'))}" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </div>
      </div>`
  },

  updates: {
    label:'Updates List',
    desc:'Version bullets',
    defaults:()=>({
      items:[
        {v:'1.0.2', notes:['Added ability to save palettes from reference image and quickly recall them']},
        {v:'1.0.1', notes:['Slight UI update']},
        {v:'1.0.0', notes:['First release']},
      ],
      baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:16px;color:#0f1220;',
      style:''
    }),
    render:(p)=>`
      <div class="block" data-type="updates">
        <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
          <h2 style="margin:0 0 10px 0;font-size:20px;">Updates</h2>
          <ul style="margin:0 0 10px 18px; font-size:16px;">
            ${p.items.map(it=>`<li>Version ${html(it.v)}<ul>${(it.notes||[]).map(n=>`<li>${html(n)}</li>`).join('')}</ul></li>`).join('')}
          </ul>
        </div>
      </div>`
  },

  bullets: {
    label:'Bulleted Highlights',
    desc:'Simple UL',
    defaults:()=>({
      title:'Adjust and amend to create new lighting moods and concept art',
      bullets:[
        'Lighting extracted from real photographs and concept art.',
        'Works with your current lights.',
        'Perfect for environment artists, look-dev, and colour stylization.'
      ],
      baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:16px;color:#0f1220;',
      style:''
    }),
    render:(p)=>`
      <div class="block" data-type="bullets">
        <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
          <p><b>${html(p.title)}</b></p>
          <ul style="margin:0 0 10px 18px;">${p.bullets.map(b=>`<li>${html(b)}</li>`).join('')}</ul>
        </div>
      </div>`
  },

  imgRow3: {
    label:'Image Row',
    desc:'N images inline (editable count & wrap constraints)',
    defaults:()=>({
      imgs:[
        'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
        'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
        'https://assets.superhivemarket.com/cache/58bf6f8ac617786dd784f758e667889a.jpg'
      ],
      itemsPerRow: 3,
      minWidth: 240,
      baseSurfaceStyle:'margin:0 0 18px 0;background:#ffffff;border:1px solid #e2e6f4;border-radius:16px;padding:16px;color:#0f1220;',
      style:''
    }),
    render:(p)=>`
      <div class="block" data-type="imgRow3">
        <div class="sh-card" data-surface="1" style="${mergeSurfaceStyle(p)}">
          <div style="display:flex;flex-wrap:wrap;gap:12px;">
            ${p.imgs.map(src=>`
              <div style="flex:1 1 calc(100% / ${p.itemsPerRow || 3} - 12px); min-width:${p.minWidth || 240}px; box-sizing:border-box; max-width:100%;">
                <img src="${attr(src)}" style="width:100%;height:auto;border-radius:10px;border:1px solid #d7dcf0;display:block;">
              </div>`).join('')}
          </div>
        </div>
      </div>`
  },

  wow: {
    label:'✨ Highlight / Wow',
    desc:'Eye-catching feature showcase',
    defaults:()=>({
      badge:'NEW UPDATE',
      title:'Meet Geometry Nodes 2.0',
      desc:'A completely rewritten computational framework that gives you full node-based control over the asset generation pipeline.',
      theme:'neon-blue',
      layout:'center-stacked',
      baseSurfaceStyle:'margin:0 0 18px 0;',
      style:''
    }),
    render:(p)=> {
      const themes = {
        'neon-blue': { bg: '#0b0f19', border: '1px solid #2563eb', shadow: '0 0 40px rgba(37,99,235,0.15)', text: '#eff6ff', badgeBg: '#2563eb', badgeText: '#ffffff' },
        'cyber-pink': { bg: '#180910', border: '1px solid #ec4899', shadow: '0 0 40px rgba(236,72,153,0.15)', text: '#fdf2f8', badgeBg: '#ec4899', badgeText: '#ffffff' },
        'blender-orange': { bg: '#1c130d', border: '1px solid #ea580c', shadow: '0 0 40px rgba(234,88,12,0.15)', text: '#fff7ed', badgeBg: '#ea580c', badgeText: '#ffffff' },
        'emerald-glow': { bg: '#062016', border: '1px solid #10b981', shadow: '0 0 40px rgba(16,185,129,0.15)', text: '#ecfdf5', badgeBg: '#10b981', badgeText: '#ffffff' },
        'royal-purple': { bg: '#1c102a', border: '1px solid #8b5cf6', shadow: '0 0 40px rgba(139,92,246,0.15)', text: '#f5f3ff', badgeBg: '#8b5cf6', badgeText: '#ffffff' },
        'solar-flare': { bg: '#2b1b08', border: '1px solid #f59e0b', shadow: '0 0 40px rgba(245,158,11,0.15)', text: '#fffbeb', badgeBg: '#f59e0b', badgeText: '#111111' },
        'glitch-matrix': { bg: '#020617', border: '1px solid #22c55e', shadow: '0 0 40px rgba(34,197,94,0.15)', text: '#f0fdf4', badgeBg: '#22c55e', badgeText: '#000000' },
        'midnight-slate': { bg: '#1e293b', border: '1px solid #475569', shadow: '0 10px 40px rgba(0,0,0,0.5)', text: '#f8fafc', badgeBg: '#3b82f6', badgeText: '#ffffff' },
        'glass-light': { bg: '#ffffff', border: '1px solid #e5e7eb', shadow: '0 10px 30px rgba(0,0,0,0.05)', text: '#111827', badgeBg: '#f3f4f6', badgeText: '#374151' }
      };
      const t = themes[p.theme] || themes['neon-blue'];
      const layout = p.layout || 'center-stacked';

      let innerHtml = '';
      if(layout === 'center-stacked') {
        innerHtml = `
            <div style="position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; text-align:center;">
              <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${t.badgeText}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">${html(p.badge)}</span>
              <h2 style="margin:0 0 16px 0; font-size:32px; font-weight:800; line-height:1.2; letter-spacing:-0.02em;">${html(p.title)}</h2>
              <p style="margin:0 auto; font-size:16px; line-height:1.6; max-width:540px; opacity:0.9;">${html(p.desc)}</p>
            </div>`;
      } else if (layout === 'left-aligned') {
        innerHtml = `
            <div style="position:relative; z-index:1; display:flex; flex-direction:column; align-items:flex-start; text-align:left;">
              <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${t.badgeText}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">${html(p.badge)}</span>
              <h2 style="margin:0 0 16px 0; font-size:32px; font-weight:800; line-height:1.2; letter-spacing:-0.02em;">${html(p.title)}</h2>
              <p style="margin:0; font-size:16px; line-height:1.6; max-width:540px; opacity:0.9;">${html(p.desc)}</p>
            </div>`;
      } else if (layout === 'split-row') {
        innerHtml = `
            <div style="position:relative; z-index:1; display:flex; flex-direction:row; align-items:center; text-align:left; flex-wrap:wrap; gap:24px;">
              <div style="flex:1; min-width:280px; align-self:flex-start;">
                <span style="display:inline-block; padding:6px 14px; border-radius:999px; background:${t.badgeBg}; color:${t.badgeText}; font-size:12px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">${html(p.badge)}</span>
                <h2 style="margin:0; font-size:32px; font-weight:800; line-height:1.2; letter-spacing:-0.02em;">${html(p.title)}</h2>
              </div>
              <div style="flex:1; min-width:280px;">
                <p style="margin:0; font-size:16px; line-height:1.6; opacity:0.9;">${html(p.desc)}</p>
              </div>
            </div>`;
      }

      let glowAlign = layout==='left-aligned' || layout==='split-row' ? 'left:-50px; transform:translateY(-50%);' : 'left:50%; transform:translate(-50%, -50%);';
      
      return `
      <div class="block" data-type="wow">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div style="border-radius:24px; padding:48px 32px; background:${t.bg}; border:${t.border}; box-shadow:${t.shadow}; color:${t.text}; position:relative; overflow:hidden;">
            <!-- Subtle backdrop glow -->
            <div style="position:absolute; top:50%; ${glowAlign} width:400px; height:400px; background:${t.badgeBg}; filter:blur(100px); opacity:0.12; border-radius:50%; pointer-events:none;"></div>
            ${innerHtml}
          </div>
        </div>
      </div>`;
    }
  },

  ctaBanner: {
    label:'CTA Banner',
    desc:'Headline + sub + image',
    defaults:()=>({
      headline:'Match your scene to your mood.',
      sub:'Transform images into immersive lighting setups with one click.',
      image:'https://assets.superhivemarket.com/cache/879c0e355fea9942235109ad46c0aa85.jpg',
      gif:'https://assets.superhivemarket.com/cache/6ff9f473c367245e682100801c184cd9.gif',
      baseSurfaceStyle:'margin:0 0 18px 0;background:#1b2451;color:#eaf0ff;border-radius:16px;padding:16px;border:1px solid rgba(255,255,255,.15);',
      style:'',

      bg:'',
      color:'',
}),
    render:(p)=>`
      <div class="block" data-type="ctaBanner">
        <div data-surface="1" style="${mergeSurfaceStyle(p)}">
          <div>
            <div style="font-weight:700;font-size:18px;">${html(p.headline)}</div>
            <div style="font-size:16px;">${html(p.sub)}</div>
            <div style="margin:10px 0;"><img src="${attr(p.image)}" style="max-width:100%;"></div>
            <div><b>Create palette templates from reference images.</b><br>Quickly save and recall previous image palettes.</div>
            <div style="margin-top:10px;"><img src="${attr(p.gif)}" style="max-width:100%;"></div>
          </div>
        </div>
      </div>`
  },

  moreAddons: {
    label:'More Add-ons Grid',
    desc:'Cards linked directly to Global Template',
    defaults:()=>({
      introTitle:'Discover more Blender add-ons',
      introSub:'Hand-picked tools to speed up your workflow',
      baseSurfaceStyle:'color:#0f1220;',
      style:''
    }),
    render:(p)=>`
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
      </div>`
  },

  raw: {
    label:'Raw HTML', desc:'Paste custom snippet',
    defaults:()=>({
      html:'<div style="padding:16px;border:1px dashed #e2e6f4;border-radius:12px;background:#fff;color:#0f1220;">Custom HTML…</div>',
      baseSurfaceStyle:'',
      style:''
    }),
    render:(p)=>`<div class="block" data-type="raw"><div data-surface="1" style="${mergeSurfaceStyle(p)}">${p.html}</div></div>`
  }
};

/* -------------------------
   Helpers (style + escaping)
------------------------- */
function mergeSurfaceStyle(p){
  // ensure a default margin on the SURFACE so spacing survives export
  const baseRaw = (p.baseSurfaceStyle || '').trim();
  const hasMargin = /(^|;)\\s*margin\\s*:/.test(baseRaw);
  const base = (hasMargin ? baseRaw : `margin:20px 0;${baseRaw}`);
  const user = (p.style || '').trim();
  // user overrides appear after base
  return `${base}${base && !base.endsWith(';') ? ';' : ''}${user}`;
}

function html(s=''){ return (''+s).replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function attr(s=''){ return (''+s).replace(/"/g,'&quot;'); }

/* -------------------------
   Library UI + Layers UI
------------------------- */
$('#tab-lib').onclick = () => {
  $('#tab-lib').classList.add('active');
  $('#tab-layers').classList.remove('active');
  $('#panel-lib').classList.remove('hidden');
  $('#panel-layers').classList.add('hidden');
};
$('#tab-layers').onclick = () => {
  $('#tab-layers').classList.add('active');
  $('#tab-lib').classList.remove('active');
  $('#panel-layers').classList.remove('hidden');
  $('#panel-lib').classList.add('hidden');
  renderLayers();
};

function renderLayers() {
  const list = $('#layers-list');
  if(!list) return;
  list.innerHTML = '';
  
  if(state.blocks.length === 0) {
    list.innerHTML = '<div class="hint">No blocks added yet.</div>';
    return;
  }
  
  state.blocks.forEach((blk, idx) => {
    const el = document.createElement('div');
    el.className = 'layer-item';
    if(blk.id === state.selectedId) el.classList.add('sel');
    
    el.draggable = true;
    el.dataset.id = blk.id;
    
    el.addEventListener('dragstart', e => {
      state.drag.sourceId = blk.id;
      state.drag.newType = null;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', blk.id);
    });
    
    el.addEventListener('dragenter', e => e.preventDefault());
    el.addEventListener('dragover', e => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      state.drag.overId = blk.id;
      state.drag.where = y < rect.height/2 ? 'before' : 'after';
      
      clearLayerDropLines();
      const line = document.createElement('div');
      line.className = 'layer-drop-line';
      if(state.drag.where === 'before') el.before(line); else el.after(line);
    });
    
    el.addEventListener('dragleave', () => clearLayerDropLines());
    el.addEventListener('drop', e => {
      e.preventDefault();
      onDropCommit();
      renderLayers();
    });
    
    el.onclick = (e) => {
      selectBlock(blk.id);
    };
    
    const info = document.createElement('div');
    info.className = 'layer-info';
    info.innerHTML = `
      <div class="layer-title">${html(blk.name || Blocks[blk.type].label)}</div>
      <div class="layer-type">${blk.type}</div>
    `;
    
    const actions = document.createElement('div');
    actions.className = 'layer-actions';
    
    const btnUp = document.createElement('button');
    btnUp.className = 'layer-btn';
    btnUp.innerHTML = '↑';
    btnUp.title = 'Move Up';
    btnUp.onclick = (e) => {
      e.stopPropagation();
      if(idx > 0) {
        [state.blocks[idx-1], state.blocks[idx]] = [state.blocks[idx], state.blocks[idx-1]];
        render(); selectBlock(blk.id); 
      }
    };
    
    const btnDown = document.createElement('button');
    btnDown.className = 'layer-btn';
    btnDown.innerHTML = '↓';
    btnDown.title = 'Move Down';
    btnDown.onclick = (e) => {
      e.stopPropagation();
      if(idx < state.blocks.length - 1) {
        [state.blocks[idx+1], state.blocks[idx]] = [state.blocks[idx], state.blocks[idx+1]];
        render(); selectBlock(blk.id); 
      }
    };
    
    actions.appendChild(btnUp);
    actions.appendChild(btnDown);
    el.appendChild(info);
    el.appendChild(actions);
    list.appendChild(el);
  });
}

function clearLayerDropLines() {
  $$('.layer-drop-line').forEach(el => el.remove());
}

function buildLibrary(){
  const list = $('#lib-list');
  list.innerHTML = '';
  Object.entries(Blocks).forEach(([type,def])=>{
    const card = document.createElement('div');
    card.className = 'block-card';
    card.draggable = true;
    card.dataset.type = type;
    card.innerHTML = `<h4>${def.label}</h4><p>${def.desc}</p>`;
    card.addEventListener('dragstart', e=>{
      state.drag.newType = type;
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/plain', 'new-block');
    });
    list.appendChild(card);
  });
  $('#lib-search').addEventListener('input',(e)=>{
    const q = e.target.value.toLowerCase();
    $$('#lib-list .block-card').forEach(el=>{
      const s = `${Blocks[el.dataset.type].label} ${Blocks[el.dataset.type].desc}`.toLowerCase();
      el.classList.toggle('hidden', !s.includes(q));
    });
  });
}

/* -------------------------
   Render canvas
------------------------- */
function render(){
  const root = $('#canvas');
  root.innerHTML = state.blocks.map(b=>Blocks[b.type].render(b.props)).join('');
  // tag ids
  let i=0; root.querySelectorAll('.block').forEach(el=>{ el.dataset.id = state.blocks[i++].id; });
  attachCanvasHandlers();
  // keep selection
  if(state.selectedId) selectBlock(state.selectedId);
  autosave();
  
  if(!$('#panel-layers').classList.contains('hidden')) {
    renderLayers();
  }
}

/* -------------------------
   Selection + Inspector
------------------------- */
function getSelected(){ return state.blocks.find(b=>b.id===state.selectedId); }

function selectBlock(id){
  state.selectedId = id;
  $$('#canvas .block').forEach(el=> el.classList.toggle('sel', el.dataset.id===id));
  $$('.layer-item').forEach(el=> el.classList.toggle('sel', el.dataset.id===id));
  updateInspector();
}

function updateInspector(){
  const sel = getSelected();
  $('#content-fields').innerHTML = '';
  $('#sel-path').textContent = sel ? `Selected: ${sel.type} (${sel.id})` : 'No selection';

  // style binds (read)
  const st = sel?.props || {};
  $('#st-margin').value = readCSS(st.style,'margin');
  $('#st-padding').value = readCSS(st.style,'padding');
  $('#st-bg').value      = readCSS(st.style,'background');
  $('#st-border').value  = readCSS(st.style,'border');
  $('#st-radius').value  = readCSS(st.style,'border-radius');
  $('#st-color').value   = readCSS(st.style,'color');
  $('#st-inline').value  = inlineRemainder(st.style, ['margin','padding','background','border','border-radius','color']);
  $('#blk-name').value   = sel?.name || '';
  $('#blk-visible').value = (sel?.hidden ? 'hidden' : '');

  if(!sel) return;

  const f = $('#content-fields');

  if(sel.type==='hero'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(field('Subtitle','text',sel.props.subtitle,(v)=>{ sel.props.subtitle=v; render(); }));
    f.appendChild(field('Image URL','text',sel.props.image.src,(v)=>{ sel.props.image.src=v; render(); }));
    f.appendChild(field('Image Alt','text',sel.props.image.alt,(v)=>{ sel.props.image.alt=v; render(); }));
    f.appendChild(textarea('Intro HTML', sel.props.blurbHTML,(v)=>{ sel.props.blurbHTML=v; render(); }));
    // badges (editable count)
    addCountControls(f, 'Badges', sel.props.badges.length, (n)=>{
      sel.props.badges = ensureLength(sel.props.badges, n, ()=>({text:'New badge',style:'display:inline-block;background:#2a3566;color:#eaf0ff;border:1px solid rgba(255,255,255,.15);padding:6px 10px;border-radius:999px;font-size:12px;'}));
      render();
    });
    sel.props.badges.forEach((b,idx)=>{
      f.appendChild(field(`Badge ${idx+1} Text`,'text',b.text,(v)=>{ b.text=v; render(); }));
      f.appendChild(textarea(`Badge ${idx+1} Style`, b.style,(v)=>{ b.style=v; render(); }));
    });
  }

  if(sel.type==='statTrio'){
    addCountControls(f, 'Items', sel.props.items.length, (n)=>{
      sel.props.items = ensureLength(sel.props.items, n, ()=>({label:'Label', value:'Value'}));
      render();
    });
    sel.props.items.forEach((it,idx)=>{
      f.appendChild(field(`Item ${idx+1} Label`,'text',it.label,(v)=>{ it.label=v; render(); }));
      f.appendChild(field(`Item ${idx+1} Value`,'text',it.value,(v)=>{ it.value=v; render(); }));
    });

    // --- Surface colours ---
    f.appendChild(field('Background','text', sel.props.bg || '', (v)=>{ sel.props.bg=v; render(); }));
    f.appendChild(field('Text Color','text', sel.props.color || '', (v)=>{ sel.props.color=v; render(); }));
    // --- Inner card overrides ---
    f.appendChild(field('Card Background','text', sel.props.cardBg || '', (v)=>{ sel.props.cardBg=v; render(); }));
    f.appendChild(field('Card Text Color','text', sel.props.cardColor || '', (v)=>{ sel.props.cardColor=v; render(); }));

  }

  if(sel.type==='overview'){
    f.appendChild(field('Heading','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(textarea('Paragraph', sel.props.text,(v)=>{ sel.props.text=v; render(); }));
  }

  if(sel.type==='features6'){
    addCountControls(f, 'Cards', sel.props.cards.length, (n)=>{
      sel.props.cards = ensureLength(sel.props.cards, n, ()=>({t:'Title', d:'Description'}));
      render();
    });
    sel.props.cards.forEach((c,idx)=>{
      f.appendChild(field(`Card ${idx+1} Title`,'text',c.t,(v)=>{ c.t=v; render(); }));
      f.appendChild(textarea(`Card ${idx+1} Desc`, c.d,(v)=>{ c.d=v; render(); }));
    });

    // --- Surface colours ---
    f.appendChild(field('Background','text', sel.props.bg || '', (v)=>{ sel.props.bg=v; render(); }));
    f.appendChild(field('Text Color','text', sel.props.color || '', (v)=>{ sel.props.color=v; render(); }));
    // --- Inner card overrides ---
    f.appendChild(field('Card Background','text', sel.props.cardBg || '', (v)=>{ sel.props.cardBg=v; render(); }));
    f.appendChild(field('Card Text Color','text', sel.props.cardColor || '', (v)=>{ sel.props.cardColor=v; render(); }));

  }

  if(sel.type==='media'){
    f.appendChild(field('Image/GIF URL','text',sel.props.src,(v)=>{ sel.props.src=v; render(); }));
    f.appendChild(field('Alt text','text',sel.props.alt,(v)=>{ sel.props.alt=v; render(); }));
  }

  if(sel.type==='youtube'){
    f.appendChild(field('Embed URL','text',sel.props.url,(v)=>{ sel.props.url=v; render(); }));
  }

  if(sel.type==='updates'){
    addCountControls(f, 'Versions', sel.props.items.length, (n)=>{
      sel.props.items = ensureLength(sel.props.items, n, ()=>({v:'1.0.x', notes:['Note']}));
      render();
    });
    sel.props.items.forEach((it,idx)=>{
      f.appendChild(field(`Version ${idx+1}`,'text',it.v,(v)=>{ it.v=v; render(); }));
      f.appendChild(textarea(`Notes ${idx+1}`,(it.notes||[]).join('\n'),(v)=>{ it.notes=v.split(/\n+/).filter(Boolean); render(); }));
    });
  }

  if(sel.type==='bullets'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(textarea('Bullets', sel.props.bullets.join('\n'),(v)=>{ sel.props.bullets=v.split(/\n+/).filter(Boolean); render(); }));
  }

  if(sel.type==='imgRow3'){
    const rowWrap = document.createElement('div');
    rowWrap.className = 'row';
    rowWrap.appendChild(field('Items Per Row','number',sel.props.itemsPerRow||3,(v)=>{ sel.props.itemsPerRow=Math.max(1,parseInt(v)||1); render(); }));
    rowWrap.appendChild(field('Wrap Min Width px','number',sel.props.minWidth||240,(v)=>{ sel.props.minWidth=Math.max(0,parseInt(v)||0); render(); }));
    f.appendChild(rowWrap);

    addCountControls(f, 'Images', sel.props.imgs.length, (n)=>{
      sel.props.imgs = ensureLength(sel.props.imgs, n, ()=>('https://picsum.photos/800/450?blur=0&random=' + Math.random()));
      render();
    });
    sel.props.imgs.forEach((src,idx)=>{
      f.appendChild(field(`Image ${idx+1} URL`,'text',src,(v)=>{ sel.props.imgs[idx]=v; render(); }));
    });
  }

  if(sel.type==='wow'){
    f.appendChild(field('Badge Text','text',sel.props.badge,(v)=>{ sel.props.badge=v; render(); }));
    f.appendChild(field('Headline','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(textarea('Description',sel.props.desc,(v)=>{ sel.props.desc=v; render(); }));
    
    const themeWrap = document.createElement('div'); themeWrap.className='field';
    themeWrap.innerHTML = `<label>Wow Theme</label><select>
      <option value="neon-blue" ${sel.props.theme==='neon-blue'?'selected':''}>Neon Blue</option>
      <option value="cyber-pink" ${sel.props.theme==='cyber-pink'?'selected':''}>Cyber Pink</option>
      <option value="blender-orange" ${sel.props.theme==='blender-orange'?'selected':''}>Blender Orange</option>
      <option value="emerald-glow" ${sel.props.theme==='emerald-glow'?'selected':''}>Emerald Glow</option>
      <option value="royal-purple" ${sel.props.theme==='royal-purple'?'selected':''}>Royal Purple</option>
      <option value="solar-flare" ${sel.props.theme==='solar-flare'?'selected':''}>Solar Flare</option>
      <option value="glitch-matrix" ${sel.props.theme==='glitch-matrix'?'selected':''}>Glitch Matrix</option>
      <option value="midnight-slate" ${sel.props.theme==='midnight-slate'?'selected':''}>Midnight Slate</option>
      <option value="glass-light" ${sel.props.theme==='glass-light'?'selected':''}>Glass Light</option>
    </select>`;
    themeWrap.querySelector('select').onchange = (e)=>{ sel.props.theme = e.target.value; render(); };
    f.appendChild(themeWrap);

    const layoutWrap = document.createElement('div'); layoutWrap.className='field';
    layoutWrap.innerHTML = `<label>Layout Style</label><select>
      <option value="center-stacked" ${sel.props.layout==='center-stacked'?'selected':''}>Center Stacked</option>
      <option value="left-aligned" ${sel.props.layout==='left-aligned'?'selected':''}>Left Aligned</option>
      <option value="split-row" ${sel.props.layout==='split-row'?'selected':''}>Split Row</option>
    </select>`;
    layoutWrap.querySelector('select').onchange = (e)=>{ sel.props.layout = e.target.value; render(); };
    f.appendChild(layoutWrap);
  }

  if(sel.type==='ctaBanner'){
    f.appendChild(field('Headline','text',sel.props.headline,(v)=>{ sel.props.headline=v; render(); }));
    f.appendChild(field('Subhead','text',sel.props.sub,(v)=>{ sel.props.sub=v; render(); }));
    f.appendChild(field('Main Image','text',sel.props.image,(v)=>{ sel.props.image=v; render(); }));
    f.appendChild(field('GIF URL','text',sel.props.gif,(v)=>{ sel.props.gif=v; render(); }));

    // --- Surface colours ---
    f.appendChild(field('Background','text', sel.props.bg || '', (v)=>{ sel.props.bg=v; render(); }));
    f.appendChild(field('Text Color','text', sel.props.color || '', (v)=>{ sel.props.color=v; render(); }));

  }

  if(sel.type==='moreAddons'){
    f.appendChild(field('Intro Title','text',sel.props.introTitle,(v)=>{ sel.props.introTitle=v; render(); }));
    f.appendChild(field('Intro Sub','text',sel.props.introSub,(v)=>{ sel.props.introSub=v; render(); }));
    
    const notice = document.createElement('div');
    notice.className = 'field';
    notice.innerHTML = `<label>Global Config</label><button class="tool" style="width:100%; border-color:var(--accent); color:var(--accent);">Edit Global Add-ons Template</button>`;
    notice.querySelector('button').onclick = () => openGlobalAddonsModal();
    f.appendChild(notice);
  }

  if(sel.type==='raw'){
    f.appendChild(textarea('Raw HTML', sel.props.html,(v)=>{ sel.props.html=v; render(); }));
  }
}

function field(label, type, value, on){
  const d = document.createElement('div'); d.className='field';
  d.innerHTML = `<label>${label}</label><input type="${type}" value="${attr(value)}"/>`;
  d.querySelector('input').addEventListener('input', e=> on(e.target.value));
  return d;
}
function textarea(label, value, on){
  const d = document.createElement('div'); d.className='field';
  d.innerHTML = `<label>${label}</label><textarea>${html(value)}</textarea>`;
  d.querySelector('textarea').addEventListener('input', e=> on(e.target.value));
  return d;
}
function addCountControls(container, label, count, onChange){
  const wrap = document.createElement('div'); wrap.className='field';
  wrap.innerHTML = `<label>${label} (count)</label><input type="number" min="0" value="${count}">`;
  wrap.querySelector('input').addEventListener('input', e=>{
    const n = Math.max(0, parseInt(e.target.value||'0',10));
    onChange(n);
  });
  container.appendChild(wrap);
}
function ensureLength(arr, n, makeItem){
  const a = arr.slice(0, n);
  while(a.length < n) a.push(makeItem());
  return a;
}

/* -------------------------
   Style helpers
------------------------- */
function readCSS(inline, key){
  if(!inline) return '';
  const m = (inline.match(new RegExp(key+":\\s*[^;]+"))||[])[0];
  return m ? m.split(':').slice(1).join(':').trim() : '';
}
function inlineRemainder(inline, keys){
  if(!inline) return '';
  const parts = inline.split(';').map(s=>s.trim()).filter(Boolean).filter(kv=>!keys.some(k=>kv.startsWith(k+':')));
  return parts.join('; ');
}
function kv(k,v){ return v ? `${k}:${v};` : ''; }

function rebuildStyle(){
  const sel = getSelected(); if(!sel) return;
  const v = {
    margin:  $('#st-margin').value,
    padding: $('#st-padding').value,
    background: $('#st-bg').value,
    border:  $('#st-border').value,
    radius:  $('#st-radius').value,
    color:   $('#st-color').value,
    rest:    $('#st-inline').value
  };
  sel.props.style =
    `${kv('margin',v.margin)}${kv('padding',v.padding)}${kv('background',v.background)}${kv('border',v.border)}${kv('border-radius',v.radius)}${kv('color',v.color)}${v.rest ? (v.rest.endsWith(';')? v.rest : v.rest+';') : ''}`;
  render(); selectBlock(sel.id);
}

/* -------------------------
   Drag & drop (predictable)
------------------------- */
function attachCanvasHandlers(){
  const root = $('#canvas');

  // remove old drop lines
  clearDropLines();

  root.querySelectorAll('.block').forEach(el=>{
    const id = el.dataset.id;

    // Add a visible drag handle to reduce accidental drags
    if(!el.querySelector('.drag-handle')){
      const h = document.createElement('div');
      h.className = 'drag-handle';
      h.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 4h4v2h-4V4m0 14h4v2h-4v-2M4 10h2v4H4v-4m14 0h2v4h-2v-4M6.5 6.5l1.4-1.4L9.8 7L8.4 8.4L6.5 6.5m0 11l1.9-1.9L9.8 17l-1.9 1.9l-1.4-1.4m11-11L17.5 8.4L15.6 6.5l1.4-1.4l1.5 1.4m0 11l-1.5 1.4l-1.4-1.4l1.9-1.9l1 1.9Z"/></svg>';
      el.appendChild(h);

      h.addEventListener('dragstart', e=>{
        state.drag.sourceId = id;
        state.drag.newType = null;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
      });
      h.setAttribute('draggable','true');
    }

    el.addEventListener('click', e=>{ selectBlock(id); e.stopPropagation(); });

    el.addEventListener('dragenter', e=>{ e.preventDefault(); });
    el.addEventListener('dragover', e=>{
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const where = y < rect.height/2 ? 'before' : 'after';
      showDropLine(el, where);
      state.drag.overId = id;
      state.drag.where = where;
    });

    el.addEventListener('dragleave', ()=> { clearDropLines(); });

    el.addEventListener('drop', e=>{
      e.preventDefault();
      onDropCommit();
    });
  });

  root.addEventListener('click', ()=> selectBlock(null));
  root.addEventListener('dragenter', e=>{ e.preventDefault(); });
  root.addEventListener('dragover', e=>{ e.preventDefault(); });
  root.addEventListener('drop', e=>{
    e.preventDefault();
    // drop on empty canvas area -> append
    if(!state.drag.overId){
      onDropCommit(true);
    }
  });
}

function onDropCommit(dropToEnd=false){
  clearDropLines();
  const { sourceId, newType, overId, where } = state.drag;

  if(newType){ // from library
    const blk = { id:uid(), type:newType, props:Blocks[newType].defaults() };
    if(dropToEnd || !overId){
      state.blocks.push(blk);
    }else{
      const idx = state.blocks.findIndex(b=>b.id===overId);
      state.blocks.splice(where==='before'? idx : idx+1, 0, blk);
    }
    render(); selectBlock(blk.id);
  } else if(sourceId){ // reorder
    const from = state.blocks.findIndex(b=>b.id===sourceId);
    if(from<0) return;
    const [blk] = state.blocks.splice(from,1);
    if(dropToEnd || !overId){
      state.blocks.push(blk);
    }else{
      const to = state.blocks.findIndex(b=>b.id===overId);
      state.blocks.splice(where==='before'? to : to+1, 0, blk);
    }
    render(); selectBlock(blk.id);
  }

  // reset drag state
  state.drag = { sourceId:null, newType:null, overId:null, where:'before' };
}

function showDropLine(target, where){
  clearDropLines();
  const line = document.createElement('div');
  line.className = 'drop-line';
  if(where==='before') target.before(line); else target.after(line);
}
function clearDropLines(){ $$('.drop-line').forEach(el=>el.remove()); }

/* -------------------------
   Toolbar
------------------------- */
$('#btn-dup').onclick = ()=>{
  const sel=getSelected(); if(!sel) return;
  const i=state.blocks.findIndex(b=>b.id===sel.id);
  state.blocks.splice(i+1,0, JSON.parse(JSON.stringify({ ...sel, id:uid() })));
  render();
};
$('#btn-del').onclick = ()=>{
  const sel=getSelected(); if(!sel) return;
  state.blocks = state.blocks.filter(b=>b.id!==sel.id);
  state.selectedId=null; render();
};
$('#btn-up').onclick = ()=>{
  const sel=getSelected(); if(!sel) return;
  const i=state.blocks.findIndex(b=>b.id===sel.id);
  if(i>0){ [state.blocks[i-1],state.blocks[i]]=[state.blocks[i],state.blocks[i-1]]; render(); selectBlock(sel.id);}
};
$('#btn-down').onclick = ()=>{
  const sel=getSelected(); if(!sel) return;
  const i=state.blocks.findIndex(b=>b.id===sel.id);
  if(i<state.blocks.length-1){ [state.blocks[i+1],state.blocks[i]]=[state.blocks[i],state.blocks[i+1]]; render(); selectBlock(sel.id);}
};

/* style inputs -> live */
$('#st-margin').addEventListener('input', rebuildStyle);
$('#st-padding').addEventListener('input', rebuildStyle);
$('#st-bg').addEventListener('input', rebuildStyle);
$('#st-border').addEventListener('input', rebuildStyle);
$('#st-radius').addEventListener('input', rebuildStyle);
$('#st-color').addEventListener('input', rebuildStyle);
$('#st-inline').addEventListener('input', rebuildStyle);

$('#blk-name').addEventListener('input', e=>{ 
  const sel=getSelected(); 
  if(sel){ 
    sel.name=e.target.value; 
    if(!$('#panel-layers').classList.contains('hidden')) renderLayers(); 
  }
});
$('#blk-visible').addEventListener('change', e=>{
  const sel=getSelected(); if(sel){
    sel.hidden = !!e.target.value;
    const el=$(`.block[data-id="${sel.id}"]`);
    if(el){ el.style.display = sel.hidden? 'none':''; }
  }
});

/* -------------------------
   JSON File Up/Down Utilities
------------------------- */
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function uploadJSON(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target.result);
        callback(json);
      } catch (err) {
        alert('Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* -------------------------
   Top bar (new/save/load/import/export)
------------------------- */
$('#btn-new').onclick = ()=>{ if(confirm('Start a new page? Unsaved changes will be lost.')){ loadDefault(); }};
$('#btn-save').onclick = ()=>{ openModal('modal-save'); $('#save-name').value = `Template ${new Date().toLocaleString()}`; };
$('#save-do').onclick = ()=>{
  const name=$('#save-name').value.trim(); if(!name) return;
  const list = JSON.parse(localStorage.getItem('sh_templates')||'[]');
  list.unshift({ name, data: JSON.stringify(state.blocks) });
  localStorage.setItem('sh_templates', JSON.stringify(list.slice(0,50)));
  closeModal('modal-save'); alert('Saved to local storage.');
};
$('#save-file-do').onclick = ()=>{
  const name=$('#save-name').value.trim() || 'template';
  downloadJSON(state.blocks, `superhive_layout_${name.toLowerCase().replace(/\s+/g, '_')}.json`);
  closeModal('modal-save');
};

$('#btn-load').onclick = ()=>{ openModal('modal-load'); buildLoadList(); };
$('#load-do').onclick = ()=>{
  const sel=$('#load-select').value; if(!sel) return;
  state.blocks = JSON.parse(sel); state.selectedId=null; render(); closeModal('modal-load');
};
$('#load-file-do').onclick = ()=>{
  uploadJSON(json => {
    if(!Array.isArray(json)) return alert('Invalid template file (must be an array of blocks).');
    state.blocks = json;
    state.selectedId = null;
    render();
    closeModal('modal-load');
  });
};
$('#btn-import').onclick = ()=>{ openModal('modal-import'); };
$('#import-do').onclick = ()=>{
  const html=$('#import-html').value; importHTML(html); closeModal('modal-import');
};

$('#btn-export').onclick = ()=>{ exportHTML(); };
$('#btn-bg-variants').onclick = ()=>{ openBGVariants(); };
$('#btn-copy').onclick   = ()=>{ copyExportHTML(); };

function buildLoadList(){
  const list = JSON.parse(localStorage.getItem('sh_templates')||'[]');
  const sel = $('#load-select'); sel.innerHTML='';
  list.forEach(t=>{
    const o=document.createElement('option'); o.textContent=t.name; o.value=t.data; sel.appendChild(o);
  });
}

/* -------------------------
   Import / Export
------------------------- */
function importHTML(htmlStr){
  const safe = htmlStr.replace(/<script[\s\S]*?<\/script>/gi,'');
  state.blocks = [{ id:uid(), type:'raw', props: Blocks.raw.defaults() }];
  state.blocks[0].props.html = safe;
  render();
}

// Build the final exported HTML string (body-only fragment)


/* -------------------------
   Autosave
------------------------- */
function autosave(){ localStorage.setItem('sh_autosave', JSON.stringify(state.blocks)); }
function tryRestore(){ const a=localStorage.getItem('sh_autosave'); if(a){ state.blocks = JSON.parse(a); render(); return true; } return false; }

/* -------------------------
   Modals + misc
------------------------- */
function openModal(id){ $('#'+id).style.display='flex'; }
function closeModal(id){ $('#'+id).style.display='none'; }

/* -------------------------
   Boot
------------------------- */
function loadDefault(){
  state.blocks = [
    { id:uid(), type:'hero',        props:Blocks.hero.defaults() },
    { id:uid(), type:'statTrio',    props:Blocks.statTrio.defaults() },
    { id:uid(), type:'overview',    props:Blocks.overview.defaults() },
    { id:uid(), type:'features6',   props:Blocks.features6.defaults() },
    { id:uid(), type:'media',       props:Blocks.media.defaults() },
    { id:uid(), type:'youtube',     props:Blocks.youtube.defaults() },
    { id:uid(), type:'updates',     props:Blocks.updates.defaults() },
    { id:uid(), type:'bullets',     props:Blocks.bullets.defaults() },
    { id:uid(), type:'wow',         props:Blocks.wow.defaults() },
    { id:uid(), type:'imgRow3',     props:Blocks.imgRow3.defaults() },
    { id:uid(), type:'ctaBanner',   props:Blocks.ctaBanner.defaults() },
    { id:uid(), type:'moreAddons',  props:Blocks.moreAddons.defaults() },
  ];
  state.selectedId=null; render();
}

buildLibrary();
if(!tryRestore()) loadDefault();

// shortcuts
window.addEventListener('keydown', (e)=>{
  if(e.key==='Delete'){ $('#btn-del').click(); }
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='s'){ e.preventDefault(); $('#btn-save').click(); }
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='e'){ e.preventDefault(); $('#btn-export').click(); }
});


// ===== Export helpers (non-destructive inline styles) =====
function buildExportHTML(){
  const raw = state.blocks.map(b => Blocks[b.type].render(b.props)).join('\n');

  const container = document.createElement('div');
  container.innerHTML = raw;
  container.querySelectorAll('.block').forEach(bl => {
    const parent = bl.parentNode;
    while (bl.firstChild) parent.insertBefore(bl.firstChild, bl);
    parent.removeChild(bl);
  });

  function mergeInlineIfMissing(el, kvs){
    const current = (el.getAttribute('style') || '').trim();
    const map = {};
    if(current){
      current.split(';').forEach(s=>{
        const t=s.trim(); if(!t) return;
        const i=t.indexOf(':');
        if(i>0){
          map[t.slice(0,i).trim().toLowerCase()] = t.slice(i+1).trim();
        }
      });
    }
    Object.entries(kvs).forEach(([k,v])=>{
      const key = k.toLowerCase();
      if(!(key in map)) map[key] = v;
    });
    const out = Object.entries(map).map(([k,v])=>`${k}:${v}`).join('; ');
    if(out) el.setAttribute('style', out + ';');
  }

  container.querySelectorAll('.sh-card').forEach(el=>{
    mergeInlineIfMissing(el, {
      background:'#ffffff',
      border:'1px solid #e2e6f4',
      'border-radius':'16px',
      padding:'16px'
    });
  });
  container.querySelectorAll('.sh-card-soft').forEach(el=>{
    mergeInlineIfMissing(el, {
      background:'#f6f7fb',
      border:'1px solid #e2e6f4',
      'border-radius':'14px',
      padding:'14px'
    });
  });
  container.querySelectorAll('.sh-hero').forEach(el=>{
    mergeInlineIfMissing(el, {
      background:'linear-gradient(135deg,#0f1220,#1b2451)',
      color:'#eaf0ff',
      border:'1px solid rgba(255,255,255,.15)',
      'border-radius':'16px',
      padding:'28px 26px'
    });
  });
  container.querySelectorAll('.tag').forEach(el=>{
    mergeInlineIfMissing(el, {
      display:'inline-block',
      padding:'4px 8px',
      'border-radius':'999px',
      background:'#f6f7fb',
      border:'1px solid #e2e6f4',
      color:'#394067',
      'font-size':'11px'
    });
  });

  const shell = document.createElement('div');
  shell.setAttribute('style', [
    'max-width:880px',
    'margin:0 auto',
    'font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    'color:#0f1220',
    'line-height:1.55'
  ].join('; ') + ';');
  shell.innerHTML = container.innerHTML;
  return shell.outerHTML;
}

function exportHTML(){
  const finalBodyOnly = buildExportHTML();
  const blob = new Blob([finalBodyOnly], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'superhive_body_inline.html';
  a.click();
  URL.revokeObjectURL(url);
}

async function copyExportHTML(){
  const html = buildExportHTML();
  try{
    await navigator.clipboard.writeText(html);
    alert('Exported HTML copied to clipboard ✔');
  }catch(err){
    console.error(err);
    prompt('Copy blocked by browser. Select and copy:', html);
  }
}



// ===== Global Addons Template Modal logic =====
let tempGlobalAddons = [];
const btnGlobal = document.getElementById('btn-global-addons');
if(btnGlobal) btnGlobal.onclick = ()=> openGlobalAddonsModal();

function openGlobalAddonsModal() {
  tempGlobalAddons = JSON.parse(JSON.stringify(window.globalAddonsRegistry || []));
  renderGlobalAddonsModalFields();
  openModal('modal-global-addons');
}

function renderGlobalAddonsModalFields() {
  const f = document.getElementById('global-addons-fields');
  if(!f) return;
  f.innerHTML = '';
  
  addCountControls(f, 'Total Cards in Global Template', tempGlobalAddons.length, (n)=>{
    tempGlobalAddons = ensureLength(tempGlobalAddons, n, ()=>({ href:'#', img:'https://picsum.photos/800/450?random='+Math.random(), title:'New Add-on', sub:'Description', tags:['Tag'] }));
    renderGlobalAddonsModalFields();
  });
  
  tempGlobalAddons.forEach((c,idx)=>{
    f.appendChild(field(`Card ${idx+1} Title`,'text',c.title,(v)=>{ c.title=v; }));
    f.appendChild(field(`Card ${idx+1} Link URL`,'text',c.href,(v)=>{ c.href=v; }));
    f.appendChild(field(`Card ${idx+1} Image URL`,'text',c.img,(v)=>{ c.img=v; }));
    f.appendChild(textarea(`Card ${idx+1} Tags (comma separated)`, (c.tags||[]).join(', '),(v)=>{ c.tags=v.split(',').map(s=>s.trim()).filter(Boolean); }));
    
    // Add visual separator between cards
    const hr = document.createElement('hr');
    hr.style.margin = "16px 0";
    hr.style.border = "none";
    hr.style.borderTop = "1px solid var(--border)";
    f.appendChild(hr);
  });
}

const btnSaveGlobal = document.getElementById('save-global-addons-do');
if(btnSaveGlobal){
  btnSaveGlobal.onclick = ()=> {
    window.globalAddonsRegistry = tempGlobalAddons;
    saveGlobalAddonsRegistry();
    closeModal('modal-global-addons');
  };
}

const btnExportGlobal = document.getElementById('export-global-addons-btn');
if(btnExportGlobal){
  btnExportGlobal.onclick = ()=> {
    downloadJSON(tempGlobalAddons, 'superhive_global_addons.json');
  };
}

const btnImportGlobal = document.getElementById('import-global-addons-btn');
if(btnImportGlobal){
  btnImportGlobal.onclick = ()=> {
    uploadJSON(json => {
      if(!Array.isArray(json)) return alert('Invalid addons file (must be an array).');
      tempGlobalAddons = json;
      renderGlobalAddonsModalFields();
    });
  };
}


// ===== Background Variants modal & actions =====
const BG_VARIANTS = [
  // Core Solids
  { name:'Solid • Deep Navy', css:'#0f1220' },
  { name:'Solid • Midnight',  css:'#0b0f19' },
  
  // Premium Linear Gradients (Dark)
  { name:'Linear • Obsidian Slate', css:'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { name:'Linear • Carbon Fiber',   css:'linear-gradient(135deg, #1c1c1c 0%, #151515 100%)' },
  { name:'Linear • Synthwave',      css:'linear-gradient(135deg, #130cb7 0%, #5218fa 100%)' },
  { name:'Linear • Biohazard',      css:'linear-gradient(135deg, #142a1b 0%, #0d1a10 100%)' },
  { name:'Linear • Deep Space',     css:'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { name:'Linear • Blender UI',     css:'linear-gradient(135deg, #353535 0%, #212121 100%)' },
  { name:'Linear • Blender Orange', css:'linear-gradient(135deg, #e87b28 0%, #c45700 100%)' },

  // Premium Linear Gradients (Colorful / Distinct)
  { name:'Linear • Golden Sand',    css:'linear-gradient(135deg, #ecc440 0%, #ffb88c 100%)' },
  { name:'Linear • Cyber Pink',     css:'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
  { name:'Linear • Oceanic Aqua',   css:'linear-gradient(135deg, #2af598 0%, #009efd 100%)' },

  // Superhive-Safe Complex Layers
  { name:'Glassmorphic • Obsidian Prism', css:'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01)), #050608' },
  { name:'Layered • Dual Glow Dark', css:'radial-gradient(ellipse 900px 280px at 0% 0%, rgba(86,240,193,.1) 0%, transparent 50%), radial-gradient(ellipse 700px 240px at 100% 100%, rgba(122,162,255,.1) 0%, transparent 50%), #0f1220' },
  { name:'Layered • Crimson Nova', css:'radial-gradient(ellipse 800px 300px at 0% 0%, rgba(220,38,38,.15) 0%, transparent 50%), radial-gradient(ellipse 800px 300px at 100% 100%, rgba(139,92,246,.15) 0%, transparent 50%), #0f1220' },
  
  // Custom Safe Patterns
  { name:'Pattern • Dark Dots', css:'repeating-radial-gradient(circle at 0 0, rgba(255,255,255,.04) 0, rgba(255,255,255,.04) 1px, transparent 1px, transparent 12px), #0b0f19' },
  { name:'Pattern • Grid Lines', css:'repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 20px), #16192b' },

  // Moving Animated Backgrounds
  { name:'Animated • Premium Loop (Blue)', css:'url(\'https://assets.superhivemarket.com/cache/04ebdd07537f7103c5b4b0e6bfda8814.gif\') center/cover no-repeat, #0b0f19' },
];

function openBGVariants(){
  buildBGVariantsGrid();
  if (typeof openModal === 'function') {
    openModal('modal-bg');
  } else {
    document.getElementById('modal-bg')?.classList.add('show');
    document.getElementById('modal-bg').style.display = 'flex';
  }
}

function buildBGVariantsGrid(){
  const grid = document.getElementById('bg-variants-grid');
  if(!grid) return;
  grid.innerHTML = '';
  BG_VARIANTS.forEach(v=>{
    const item = document.createElement('div');
    item.className = 'bg-item';

    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = v.css;
    item.appendChild(sw);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const left = document.createElement('div');
    left.innerHTML = `<div>${html ? html(v.name) : v.name}</div><code>${html ? html(v.css) : v.css}</code>`;
    meta.appendChild(left);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnUse = document.createElement('button');
    btnUse.textContent = 'Use';
    btnUse.title = 'Apply to selected block background';
    btnUse.onclick = ()=> applyBGToSelected(v.css);

    const btnCopy = document.createElement('button');
    btnCopy.textContent = 'Copy';
    btnCopy.title = 'Copy to clipboard';
    btnCopy.onclick = ()=> copyBG(v.css);

    actions.appendChild(btnUse);
    actions.appendChild(btnCopy);
    meta.appendChild(actions);

    item.appendChild(meta);
    grid.appendChild(item);
  });
}

function applyBGToSelected(cssValue){
  const sel = (typeof getSelected === 'function') ? getSelected() : (window.selectedBlock || null);
  if(!sel){
    alert('Select a block first, then choose a background.');
    return;
  }
  const bgInput = document.getElementById('st-bg');
  if(bgInput){
    bgInput.value = cssValue;
  }
  if (typeof rebuildStyle === 'function'){
    rebuildStyle();
  }
  if (typeof closeModal === 'function') {
    closeModal('modal-bg');
  } else {
    const m = document.getElementById('modal-bg');
    if(m){ m.style.display='none'; }
  }
}

async function copyBG(cssValue){
  try{
    await navigator.clipboard.writeText(cssValue);
    alert('Background copied ✔');
  }catch(e){
    prompt('Copy this value:', cssValue);
  }
}

