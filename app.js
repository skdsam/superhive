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
    label: '🚀 Hero Header',
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
    label:'📊 Stats Trio',
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
    label:'📝 Overview Box',
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
    label:'✨ Six Feature Grid',
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
    label:'📷 Media Panel',
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
    label:'📺 YouTube Embed',
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
    label:'🔔 Updates List',
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
    label:'📋 Bulleted Highlights',
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
    label:'🖼️ Image Row',
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

  testimonials: {
    label: '🗣️ Testimonials',
    desc: 'Grid of user quotes and stars',
    defaults: ()=>({
      title: 'Loved by Creators',
      reviews: [
        { name:'Sarah K.', role:'3D Animator', text:'This addon cut my rendering time in half. Absolute lifesaver.', stars:5, thumb:'https://ui-avatars.com/api/?name=SK&background=0D8ABC&color=fff' },
        { name:'John D.', role:'Environment Artist', text:'I use this on every single scene I build now. Highly recommended!', stars:5, thumb:'https://ui-avatars.com/api/?name=JD&background=10B981&color=fff' },
        { name:'Marcus T.', role:'Indie Dev', text:'The best $20 I have spent on my workflow this year.', stars:5, thumb:'https://ui-avatars.com/api/?name=MT&background=F59E0B&color=fff' }
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:48px 24px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:16px;',
      style:''
    }),
    render: (p)=> {
      const cards = p.reviews.map(r => `
        <div style="background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:24px; text-align:left; flex:1; min-width:280px; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
          <div style="color:#fbbf24; font-size:18px; margin-bottom:12px;">${'★'.repeat(r.stars||5)}${'☆'.repeat(5-(r.stars||5))}</div>
          <p style="margin:0 0 20px 0; font-size:15px; color:#374151; line-height:1.6; font-style:italic;">"${html(r.text)}"</p>
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${attr(r.thumb)}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
            <div>
              <div style="font-weight:700; color:#111827; font-size:14px;">${html(r.name)}</div>
              <div style="font-size:12px; color:#6b7280;">${html(r.role)}</div>
            </div>
          </div>
        </div>
      `).join('');
      return `
      <div class="block" data-type="testimonials">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 32px 0;">${html(p.title)}</h2>
          <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">
            ${cards}
          </div>
        </div>
      </div>`;
    }
  },

  comparison: {
    label: '⚖️ Before & After',
    desc: 'Side-by-side images',
    defaults: ()=>({
      leftImg: 'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
      leftLabel: 'Without Addon',
      rightImg: 'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
      rightLabel: 'With Addon',
      baseSurfaceStyle: 'margin:0 0 18px 0;',
      style:''
    }),
    render: (p)=> `
      <div class="block" data-type="comparison">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <div style="flex:1; min-width:280px; position:relative; overflow:hidden; border-radius:12px;">
              <div style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.6); color:#fff; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:700; backdrop-filter:blur(4px); z-index:2;">${html(p.leftLabel)}</div>
              <img src="${attr(p.leftImg)}" style="width:100%; height:auto; display:block;">
            </div>
            <div style="flex:1; min-width:280px; position:relative; overflow:hidden; border-radius:12px;">
              <div style="position:absolute; top:12px; left:12px; background:rgba(37,99,235,0.9); color:#fff; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:700; backdrop-filter:blur(4px); z-index:2;">${html(p.rightLabel)}</div>
              <img src="${attr(p.rightImg)}" style="width:100%; height:auto; display:block;">
            </div>
          </div>
        </div>
      </div>`
  },

  steps: {
    label: '🚶 How it Works',
    desc: 'Numbered workflow steps',
    defaults: ()=>({
      title: 'Workflow in 3 Easy Steps',
      steps: [
        { num:'1', title:'Select Object', desc:'Select any mesh or object in your Blender scene.' },
        { num:'2', title:'Apply Generator', desc:'Open the addon panel and click Generate.' },
        { num:'3', title:'Adjust Sliders', desc:'Tweak the modifier values via the custom panel.' }
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:40px 24px; background:#fff; border:1px solid #e5e7eb; border-radius:16px;',
      style:'',
      circleBg: '#2563eb',
      circleColor: '#ffffff'
    }),
    render: (p)=> {
      const items = p.steps.map(s => `
        <div style="display:flex; gap:20px; text-align:left; flex:1; min-width:240px; margin-bottom:24px;">
          <div style="width:40px; height:40px; border-radius:50%; background:${p.circleBg || '#2563eb'}; color:${p.circleColor || '#ffffff'}; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:800; flex-shrink:0;">${html(s.num)}</div>
          <div>
            <h3 style="margin:0 0 8px 0; font-size:18px; color:#111827; font-weight:700;">${html(s.title)}</h3>
            <p style="margin:0; font-size:14px; color:#4b5563; line-height:1.6;">${html(s.desc)}</p>
          </div>
        </div>
      `).join('');
      return `
      <div class="block" data-type="steps">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 40px 0;">${html(p.title)}</h2>
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; max-width:900px; margin:0 auto;">
            ${items}
          </div>
        </div>
      </div>`;
    }
  },

  specs: {
    label: '⚙️ Technical Specs',
    desc: 'Compatibility grid',
    defaults: ()=>({
      title: 'System Requirements & Compatibility',
      rows: [
        { label:'Supported Versions', val:'Blender 3.6 LTS, 4.0, 4.1' },
        { label:'Render Engines', val:'Cycles (Supported), Eevee (Supported)' },
        { label:'Operating Systems', val:'Windows, macOS, Linux' },
        { label:'Dependencies', val:'None (No external scripts required)' }
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:32px 0; background:#fefefe; border:1px solid #e5e7eb; border-radius:16px;',
      style:''
    }),
    render: (p)=> {
      const trs = p.rows.map((r, i) => `
        <div style="display:flex; flex-wrap:wrap; border-top:1px solid #e5e7eb; padding:16px 24px; background:${i%2===0 ? 'transparent' : '#f9fafb'};">
          <div style="flex:1; min-width:150px; font-weight:700; color:#4b5563; font-size:14px;">${html(r.label)}</div>
          <div style="flex:2; min-width:200px; color:#111827; font-size:15px; font-weight:500;">${html(r.val)}</div>
        </div>
      `).join('');
      return `
      <div class="block" data-type="specs">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <h2 style="text-align:center; font-size:22px; font-weight:800; color:#111827; margin:0 0 24px 0;">${html(p.title)}</h2>
          <div style="max-width:700px; margin:0 auto; border-bottom:1px solid #e5e7eb;">
            ${trs}
          </div>
        </div>
      </div>`;
    }
  },

  pricing: {
    label: '💰 Pricing Matrix',
    desc: 'Compare product tiers',
    defaults: ()=>({
      tiers: [
        { name:'Standard License', price:'$15', desc:'For personal projects.', btn:'Buy Standard', highlight:'false', feats:['Full Features','1 User'] },
        { name:'Studio License', price:'$45', desc:'For commercial work.', btn:'Buy Studio', highlight:'true', feats:['Full Features','Up to 5 Users','Priority Support'] }
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:48px 24px; background:#fff; border:1px dashed #cbd5e1; border-radius:16px;',
      style:''
    }),
    render: (p)=> {
      const cards = p.tiers.map(t => {
        const lis = (t.feats||[]).map(f => `<li style="margin-bottom:12px; display:flex; align-items:flex-start; gap:8px;"><span style="color:#10b981; font-weight:800;">✓</span> <span>${html(f)}</span></li>`).join('');
        const isHl = t.highlight==='true' || t.highlight===true;
        const hlStyle = isHl ? 'border:2px solid #2563eb; box-shadow:0 20px 25px -5px rgba(37,99,235,0.1); transform:translateY(-8px);' : 'border:1px solid #e5e7eb; margin-top:8px;';
        const badge = isHl ? `<div style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:#2563eb; color:#fff; font-size:12px; font-weight:800; padding:4px 12px; border-radius:99px; letter-spacing:1px; text-transform:uppercase;">Recommended</div>` : '';
        const btnStyle = isHl ? 'background:#2563eb; color:#fff;' : 'background:#f3f4f6; color:#111827;';
        
        return `
          <div style="flex:1; min-width:280px; max-width:380px; background:#fff; border-radius:16px; padding:32px 24px; position:relative; transition:transform 0.2s; ${hlStyle}">
            ${badge}
            <h3 style="margin:0 0 12px 0; font-size:20px; color:#111827; font-weight:700; text-align:center;">${html(t.name)}</h3>
            <div style="text-align:center; font-size:48px; font-weight:800; color:#111827; margin-bottom:16px;">${html(t.price)}</div>
            <p style="text-align:center; color:#6b7280; font-size:14px; margin:0 0 32px 0; min-height:40px;">${html(t.desc)}</p>
            <ul style="list-style:none; padding:0; margin:0 0 32px 0; font-size:15px; color:#4b5563;">
              ${lis}
            </ul>
            <a href="#" style="display:block; text-align:center; text-decoration:none; padding:14px; border-radius:8px; font-weight:700; font-size:16px; transition:opacity 0.2s; ${btnStyle}">${html(t.btn)}</a>
          </div>
        `;
      }).join('');
      return `
      <div class="block" data-type="pricing">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div style="display:flex; flex-wrap:wrap; gap:32px; justify-content:center; align-items:stretch;">
            ${cards}
          </div>
        </div>
      </div>`;
    }
  },

  code: {
    label: '💻 Code Snippet',
    desc: 'Syntax highlighted box',
    defaults: ()=>({
      title: 'addon_script.py',
      code: 'import bpy\n\n# Initialize the auto-generator\nbpy.ops.node.add_geometry_generator()\nprint("Node tree successfully created!")',
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:24px; background:#0f111a; border:1px solid #1e2433; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.25);',
      style:''
    }),
    render: (p)=> `
      <div class="block" data-type="code">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #2a3143; padding-bottom:12px; margin-bottom:16px;">
            <div style="display:flex; gap:6px;">
              <div style="width:12px; height:12px; border-radius:50%; background:#ef4444;"></div>
              <div style="width:12px; height:12px; border-radius:50%; background:#f59e0b;"></div>
              <div style="width:12px; height:12px; border-radius:50%; background:#10b981;"></div>
            </div>
            <div style="color:#94a3b8; font-family:monospace; font-size:12px;">${html(p.title)}</div>
          </div>
          <pre style="margin:0; padding:0; overflow-x:auto;"><code style="font-family:Consolas, Monaco, monospace; font-size:14px; color:#e2e8f0; line-height:1.5; white-space:pre;">${html(p.code)}</code></pre>
        </div>
      </div>`
  },

  faq: {
    label: '❓ FAQ List',
    desc: 'Stacked question/answers',
    defaults: ()=>({
      title: 'Frequently Asked Questions',
      faqs: [
        { q:'Does this work on Mac OS?', a:'Yes! The addon supports Windows, Mac OS, and Linux platforms completely.' },
        { q:'Are future updates included?', a:'Absolutely. Once you purchase the Studio or Standard license, all minor updates are free forever.' },
        { q:'Can I use generated assets commercially?', a:'Yes, any assets created using this addon are completely yours to use.' }
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:48px 24px; background:#fff; border:1px solid #e5e7eb; border-radius:16px;',
      style:''
    }),
    render: (p)=> {
      const items = p.faqs.map(f => `
        <div style="margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid #f3f4f6;">
          <h3 style="margin:0 0 8px 0; font-size:18px; color:#111827; font-weight:700;">${html(f.q)}</h3>
          <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.6;">${html(f.a)}</p>
        </div>
      `).join('');
      return `
      <div class="block" data-type="faq">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 40px 0;">${html(p.title)}</h2>
          <div style="max-width:800px; margin:0 auto;">
            ${items}
          </div>
        </div>
      </div>`;
    }
  },

  ctaBanner: {
    label:'📢 CTA Banner',
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

  bentoGrid: {
    label: '🍱 Bento Grid', desc: 'Asymmetrical features',
    defaults: ()=>({
      c1_title: 'Procedural Generation', c1_desc: 'Instantly build sprawling cities.', c1_img:'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
      c2_title: '1-Click Export', c2_desc: 'Ready for Unreal Engine.', c2_img:'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG',
      c3_title: 'Non-Destructive', c3_desc: 'Always editable at any time.',
      c4_title: 'Optimized', c4_desc: 'Perfect for massive scenes.',
      baseSurfaceStyle: 'margin:0 0 18px 0;',
      style: ''
    }),
    render: (p)=> {
      const id = 'bento-' + Math.random().toString(36).slice(2, 9);
      return `
      <div class="block" data-type="bentoGrid">
        <style>
          #${id} { display:grid; grid-template-columns:2fr 1fr; gap:16px; auto-rows: minmax(180px, auto); }
          #${id} .b-card { background:#fff; border:1px solid #e5e7eb; border-radius:24px; padding:24px; display:flex; flex-direction:column; overflow:hidden; position:relative; box-shadow:0 10px 15px -3px rgba(0,0,0,0.02); }
          #${id} .b-card h3 { margin:0 0 8px 0; font-size:20px; font-weight:800; color:#111827; position:relative; z-index:2; }
          #${id} .b-card p { margin:0; font-size:15px; color:#4b5563; position:relative; z-index:2; line-height:1.5; }
          #${id} .c1 { grid-column:span 1; grid-row:span 2; min-height:400px; justify-content:flex-end; }
          #${id} .c2 { grid-column:span 1; grid-row:span 1; min-height:200px; justify-content:flex-end; }
          #${id} .c34-wrap { grid-column:span 1; grid-row:span 1; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
          #${id} .bg-img { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:0; }
          #${id} .overlay { position:absolute; bottom:0; left:0; width:100%; height:60%; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); z-index:1; }
          @media(max-width:768px) { #${id}, #${id} .c34-wrap { grid-template-columns:1fr; } #${id} .c1 { grid-row:span 1; min-height:300px; } }
        </style>
        <div id="${id}" data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div class="b-card c1">
            ${p.c1_img ? `<img src="${attr(p.c1_img)}" class="bg-img"><div class="overlay"></div>` : ''}
            <h3 style="${p.c1_img?'color:#fff;':''}">${html(p.c1_title)}</h3>
            <p style="${p.c1_img?'color:#e5e7eb;':''}">${html(p.c1_desc)}</p>
          </div>
          <div class="b-card c2">
            ${p.c2_img ? `<img src="${attr(p.c2_img)}" class="bg-img"><div class="overlay"></div>` : ''}
            <h3 style="${p.c2_img?'color:#fff;':''}">${html(p.c2_title)}</h3>
            <p style="${p.c2_img?'color:#e5e7eb;':''}">${html(p.c2_desc)}</p>
          </div>
          <div class="c34-wrap">
            <div class="b-card c3">
              <h3>${html(p.c3_title)}</h3><p>${html(p.c3_desc)}</p>
            </div>
            <div class="b-card c4">
              <h3>${html(p.c4_title)}</h3><p>${html(p.c4_desc)}</p>
            </div>
          </div>
        </div>
      </div>`;
    }
  },

  proConList: {
    label: '🚦 Old Way vs Addon', desc: 'Compare manual vs automated',
    defaults: ()=>({
      title: 'Stop Wasting Time',
      oldTitle: 'The Old Way',
      oldDesc: 'Hours of tedious manual work',
      oldItems: ['Manually unwrap UVs', 'Bake textures map by map', 'Guess lighting values', 'Wait for slow renders'],
      newTitle: 'The Superhive Way',
      newDesc: 'Results in 30 seconds',
      newItems: ['1-Click Smart UVs', 'Auto-bake all channels', 'Procedural sky lighting', 'Real-time Eevee previews'],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:24px;',
      style: ''
    }),
    render: (p)=> {
      const olds = p.oldItems.map(i=>`<li style="margin-bottom:12px; display:flex; align-items:flex-start; gap:12px;"><div style="width:20px;height:20px;background:#fef2f2;color:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;margin-top:2px;">✕</div> <span style="opacity:0.8;">${html(i)}</span></li>`).join('');
      const news = p.newItems.map(i=>`<li style="margin-bottom:12px; display:flex; align-items:flex-start; gap:12px;"><div style="width:20px;height:20px;background:#10b981;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;margin-top:2px;box-shadow:0 0 10px rgba(16,185,129,0.4);">✓</div> <span style="font-weight:500;">${html(i)}</span></li>`).join('');
      return `
      <div class="block" data-type="proConList">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 32px 0;">${html(p.title)}</h2>
          <div style="display:flex; flex-wrap:wrap; gap:24px;">
            <div style="flex:1; min-width:280px; background:#fafafa; border:1px solid #f3f4f6; border-radius:24px; padding:32px;">
              <h3 style="margin:0 0 8px 0; font-size:22px; color:#6b7280; font-weight:700;">${html(p.oldTitle)}</h3>
              <p style="margin:0 0 24px 0; color:#9ca3af; font-size:15px;">${html(p.oldDesc)}</p>
              <ul style="list-style:none; padding:0; margin:0; color:#4b5563;">${olds}</ul>
            </div>
            <div style="flex:1; min-width:280px; background:#ecfdf5; border:1px solid #10b981; border-radius:24px; padding:32px; position:relative; box-shadow:0 20px 25px -5px rgba(16,185,129,0.1);">
              <div style="position:absolute; top:-12px; right:32px; background:#10b981; color:#fff; font-size:12px; font-weight:800; padding:4px 12px; border-radius:99px; letter-spacing:1px; text-transform:uppercase;">Recommended</div>
              <h3 style="margin:0 0 8px 0; font-size:22px; color:#065f46; font-weight:800;">${html(p.newTitle)}</h3>
              <p style="margin:0 0 24px 0; color:#059669; font-size:15px;">${html(p.newDesc)}</p>
              <ul style="list-style:none; padding:0; margin:0; color:#064e3b;">${news}</ul>
            </div>
          </div>
        </div>
      </div>`;
    }
  },

  gradientHero: {
    label: '✨ Animated Gradient Hero', desc: 'Massive colorful title',
    defaults: ()=>({
      title: 'Design at the speed of thought.',
      subtitle: 'The ultimate tool for Blender artists building sci-fi environments.',
      btnText: 'Get Early Access',
      btnHref: '#',
      gradA: '#ec4899', gradB: '#8b5cf6', gradC: '#3b82f6',
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:80px 24px; text-align:center; background:#020617; border-image:linear-gradient(to right, #ec4899, #3b82f6) 1; border-width:1px; border-style:solid; border-radius:24px; color:#f8fafc; overflow:hidden; position:relative;',
      style: ''
    }),
    render: (p)=> {
      const id = 'grad-' + Math.random().toString(36).slice(2, 9);
      return `
      <div class="block" data-type="gradientHero">
        <style>
          @keyframes anim_${id} { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
          #${id}-text { background: linear-gradient(90deg, ${p.gradA}, ${p.gradB}, ${p.gradC}, ${p.gradA}); background-size: 300% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: anim_${id} 4s linear infinite; }
          #${id}-btn { background: linear-gradient(90deg, ${p.gradA}, ${p.gradB}); transition:opacity 0.2s, transform 0.2s; }
          #${id}-btn:hover { opacity:0.9; transform:scale(1.05); }
        </style>
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div style="position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle at 50% 50%, ${attr(p.gradB)}33 0%, transparent 50%); z-index:0; pointer-events:none;"></div>
          <div style="position:relative; z-index:1; max-width:800px; margin:0 auto;">
            <h1 id="${id}-text" style="font-size: clamp(40px, 6vw, 72px); font-weight:900; line-height:1.1; margin:0 0 24px 0; padding-bottom:8px;">${html(p.title)}</h1>
            <p style="font-size:20px; color:#94a3b8; margin:0 0 40px 0; line-height:1.6;">${html(p.subtitle)}</p>
            <a id="${id}-btn" href="${attr(p.btnHref)}" style="display:inline-block; color:#fff; text-decoration:none; padding:16px 32px; border-radius:99px; font-weight:800; font-size:18px; box-shadow:0 10px 25px ${attr(p.gradA)}66;">${html(p.btnText)}</a>
          </div>
        </div>
      </div>`;
    }
  },

  roadmap: {
    label: '🗺️ Product Roadmap', desc: 'Timeline of updates',
    defaults: ()=>({
      title: 'Development Timeline',
      steps: [
        { version:'v1.0', title:'Initial Release', desc:'Core features and geometry nodes setup.', status:'done' },
        { version:'v1.5', title:'Performance Update', desc:'5x faster generation and new UI.', status:'current' },
        { version:'v2.0', title:'Eevee Next Support', desc:'Full compatibility with upcoming Blender 4.2 features.', status:'upcoming' }
      ],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:48px 24px; background:#fff; border:1px solid #e2e6f4; border-radius:24px;',
      style: ''
    }),
    render: (p)=> {
      const items = p.steps.map((s, idx) => {
        let dotColor = '#e5e7eb';
        let titleColor = '#9ca3af';
        let activeGlow = '';
        if(s.status==='done') { dotColor = '#10b981'; titleColor = '#111827'; }
        if(s.status==='current') { dotColor = '#3b82f6'; titleColor = '#111827'; activeGlow = 'box-shadow:0 0 0 4px rgba(59,130,246,0.2);'; }
        
        return `
        <div style="position:relative; margin-bottom:${idx===p.steps.length-1?'0':'32px'}; clear:both;">
          <div style="position:absolute; left:-33px; top:4px; width:16px; height:16px; border-radius:50%; background:${dotColor}; ${activeGlow}"></div>
          <div style="float:left; width:60px; font-weight:800; color:${dotColor}; font-size:14px; margin-top:2px;">${html(s.version)}</div>
          <div style="margin-left:70px;">
            <h3 style="margin:0 0 4px 0; font-size:18px; font-weight:800; color:${titleColor};">${html(s.title)}</h3>
            <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.5;">${html(s.desc)}</p>
          </div>
        </div>`;
      }).join('');
      return `
      <div class="block" data-type="roadmap">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <h2 style="text-align:center; font-size:28px; font-weight:800; color:#111827; margin:0 0 40px 0;">${html(p.title)}</h2>
          <div style="max-width:600px; margin:0 auto; padding-left:24px; border-left:2px solid #e5e7eb;">
            ${items}
          </div>
        </div>
      </div>`;
    }
  },

  fauxNode: {
    label: '🧩 Blender Node UI', desc: 'Mimics the Node Editor',
    defaults: ()=>({
      nodeTitle: 'Superhive Generator',
      nodeColor: '#3b82f6',
      inputs: ['Geometry', 'Seed', 'Density'],
      outputs: ['Mesh', 'Materials'],
      baseSurfaceStyle: 'margin:0 0 18px 0; padding:60px 24px; background:#1e1e1e; border-radius:16px; display:flex; justify-content:center; overflow:hidden;',
      style: ''
    }),
    render: (p)=> {
      const ins = p.inputs.map(i=>`<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; position:relative; left:-6px;"><div style="width:12px;height:12px;border-radius:50%;border:1px solid #000;background:#38bdf8;"></div><span style="color:#d1d5db;font-size:14px;">${html(i)}</span></div>`).join('');
      const outs = p.outputs.map(i=>`<div style="display:flex; align-items:center; justify-content:flex-end; gap:8px; margin-bottom:8px; position:relative; right:-6px;"><span style="color:#d1d5db;font-size:14px;">${html(i)}</span><div style="width:12px;height:12px;border-radius:50%;border:1px solid #000;background:#10b981;"></div></div>`).join('');
      return `
      <div class="block" data-type="fauxNode">
        <div data-surface="1" style="${attr(mergeSurfaceStyle(p))}">
          <div style="width:100%; max-width:320px; background:#333333; border:1px solid #111; border-radius:8px; overflow:hidden; box-shadow:0 15px 30px rgba(0,0,0,0.5); font-family:sans-serif;">
            <div style="background:linear-gradient(to right, ${attr(p.nodeColor)} 0%, #475569 50%, #333333 100%); padding:10px 16px; color:#fff; font-weight:700; font-size:15px; text-shadow:0 1px 2px rgba(0,0,0,0.5); display:flex; justify-content:space-between;">
              <span>▼ ${html(p.nodeTitle)}</span>
            </div>
            <div style="padding:16px; display:flex; justify-content:space-between; background:#3b3b3b; position:relative;">
              
              <!-- Faux input wires -->
              <svg style="position:absolute; right:100%; top:24px; width:60px; height:120px; overflow:visible; pointer-events:none; opacity:0.6;"><path d="M-60,0 C-20,0 -10,0 0,0" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>

              <div>${ins}</div>
              <div style="text-align:right;">${outs}</div>
              
              <!-- Faux output wires -->
              <svg style="position:absolute; left:100%; top:24px; width:60px; height:120px; overflow:visible; pointer-events:none; opacity:0.6;"><path d="M0,0 C20,0 40,30 60,30" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>

            </div>
          </div>
        </div>
      </div>`;
    }
  },

  moreAddons: {
    label:'🧩 More Add-ons Grid',
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

  spacer: {
    label: '⬍ Empty Spacer', desc: 'Vertical blank space',
    defaults:()=>({
      height: '40px',
      baseSurfaceStyle: '',
      style: ''
    }),
    render: (p)=> `<div class="block" data-type="spacer"><div data-surface="1" style="height:${attr(p.height)}; ${attr(mergeSurfaceStyle(p))}"></div></div>`
  },

  divider: {
    label: '➖ Divider Line', desc: 'Horizontal rule',
    defaults:()=>({
      color: '#e5e7eb',
      thickness: '1px',
      margin: '32px 0',
      baseSurfaceStyle: '',
      style: ''
    }),
    render: (p)=> `<div class="block" data-type="divider"><div data-surface="1" style="padding:1px; ${attr(mergeSurfaceStyle(p))}"><hr style="border:none; border-top:${attr(p.thickness)} solid ${attr(p.color)}; margin:${attr(p.margin)}; width:100%;"></div></div>`
  },

  raw: {
    label:'📜 Raw HTML', desc:'Paste custom snippet',
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

function textarea(label, val, onChange){
  const el = document.createElement('div'); el.className='field';
  const l = document.createElement('label'); l.innerText = label;
  const i = document.createElement('textarea'); i.value=val;
  i.oninput = (e)=>onChange(e.target.value);
  el.appendChild(l); el.appendChild(i); return el;
}

function arrayEditor(label, keys, arr, onChange){
  const el = document.createElement('div'); el.className='field';
  const l = document.createElement('label'); l.innerText = label; el.appendChild(l);
  
  const list = document.createElement('div'); list.style.marginTop='8px';
  (arr||[]).forEach((item, idx) => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--panel2); border:1px solid var(--border); padding:8px; border-radius:6px; margin-bottom:8px; position:relative;';
    
    const btnDel = document.createElement('button');
    btnDel.innerText = 'Delete';
    btnDel.style.cssText = 'font-size:10px; border:1px solid #fecaca; background:#fee2e2; color:#ef4444; border-radius:4px; padding:2px 6px; cursor:pointer; float:right; margin-bottom:4px;';
    btnDel.onclick = () => { arr.splice(idx, 1); onChange(arr); updateInspector(); };
    card.appendChild(btnDel);

    keys.forEach(k => {
      const row = document.createElement('div'); row.style.marginBottom='6px'; row.style.clear='both';
      const klabel = document.createElement('div'); klabel.innerText=k; klabel.style.cssText='font-size:10px; color:var(--muted); text-transform:uppercase; margin-bottom:2px;';
      const isLarge = k==='desc' || k==='text' || k==='code' || k==='a';
      const inp = document.createElement(isLarge ? 'textarea' : 'input');
      inp.value = Array.isArray(item[k]) ? item[k].join(', ') : item[k];
      inp.style.cssText = `width:100%; box-sizing:border-box; padding:6px; font-size:12px; border:1px solid var(--border); border-radius:4px; background:var(--panel); color:var(--text); font-family:${k.includes('code')?'monospace':'inherit'};`;
      if(isLarge) inp.style.height = '60px';
      
      inp.oninput = (e) => { 
        if(Array.isArray(item[k])) item[k] = e.target.value.split(',').map(s=>s.trim());
        else item[k] = e.target.value; 
        onChange(arr); 
      };
      
      row.appendChild(klabel); row.appendChild(inp);
      card.appendChild(row);
    });
    list.appendChild(card);
  });
  el.appendChild(list);

  const btnAdd = document.createElement('button');
  btnAdd.innerText = '+ Add ' + label;
  btnAdd.className = 'tool';
  btnAdd.style.width = '100%';
  btnAdd.onclick = () => { 
    const nu = {}; keys.forEach(k=>{
      if(k==='stars') nu[k]=5; else if(k==='highlight') nu[k]='false'; else if(k==='feats') nu[k]=['Feature']; else nu[k]='';
    }); 
    arr.push(nu); onChange(arr); updateInspector();
  };
  el.appendChild(btnAdd);
  
  return el;
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
  // keep selection without completely destroying the inspector DOM to preserve input focus!
  if(state.selectedId) selectBlock(state.selectedId, false);
  autosave();
  
  if(!$('#panel-layers').classList.contains('hidden')) {
    renderLayers();
  }
}

/* -------------------------
   Selection + Inspector
------------------------- */
function getSelected(){ return state.blocks.find(b=>b.id===state.selectedId); }

function selectBlock(id, doUpdateInspector=true){
  state.selectedId = id;
  $$('#canvas .block').forEach(el=> el.classList.toggle('sel', el.dataset.id===id));
  $$('.layer-item').forEach(el=> el.classList.toggle('sel', el.dataset.id===id));
  if(doUpdateInspector) updateInspector();
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
  
  if(sel.type==='testimonials'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(arrayEditor('Reviews', ['name','role','text','stars','thumb'], sel.props.reviews, (a)=>{ sel.props.reviews=a; render(); }));
  }
  if(sel.type==='comparison'){
    f.appendChild(field('Left Image URL','text',sel.props.leftImg,(v)=>{ sel.props.leftImg=v; render(); }));
    f.appendChild(field('Left Label','text',sel.props.leftLabel,(v)=>{ sel.props.leftLabel=v; render(); }));
    f.appendChild(field('Right Image URL','text',sel.props.rightImg,(v)=>{ sel.props.rightImg=v; render(); }));
    f.appendChild(field('Right Label','text',sel.props.rightLabel,(v)=>{ sel.props.rightLabel=v; render(); }));
  }
  if(sel.type==='steps'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(field('Circle Background','text',sel.props.circleBg || '#2563eb',(v)=>{ sel.props.circleBg=v; render(); }));
    f.appendChild(field('Circle Text Color','text',sel.props.circleColor || '#ffffff',(v)=>{ sel.props.circleColor=v; render(); }));
    f.appendChild(arrayEditor('Steps', ['num','title','desc'], sel.props.steps, (a)=>{ sel.props.steps=a; render(); }));
  }
  if(sel.type==='specs'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(arrayEditor('Rows', ['label','val'], sel.props.rows, (a)=>{ sel.props.rows=a; render(); }));
  }
  if(sel.type==='pricing'){
    f.appendChild(arrayEditor('Tiers', ['name','price','desc','btn','highlight','feats'], sel.props.tiers, (a)=>{ sel.props.tiers=a; render(); }));
  }
  if(sel.type==='code'){
    f.appendChild(field('File Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(textarea('Code Content',sel.props.code,(v)=>{ sel.props.code=v; render(); }));
  }
  if(sel.type==='faq'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(arrayEditor('Questions', ['q','a'], sel.props.faqs, (a)=>{ sel.props.faqs=a; render(); }));
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

  if(sel.type==='bentoGrid'){
    f.appendChild(field('Card 1 Title','text',sel.props.c1_title,(v)=>{ sel.props.c1_title=v; render(); }));
    f.appendChild(textarea('Card 1 Desc',sel.props.c1_desc,(v)=>{ sel.props.c1_desc=v; render(); }));
    f.appendChild(field('Card 1 Img URL','text',sel.props.c1_img,(v)=>{ sel.props.c1_img=v; render(); }));
    f.appendChild(field('Card 2 Title','text',sel.props.c2_title,(v)=>{ sel.props.c2_title=v; render(); }));
    f.appendChild(textarea('Card 2 Desc',sel.props.c2_desc,(v)=>{ sel.props.c2_desc=v; render(); }));
    f.appendChild(field('Card 2 Img URL','text',sel.props.c2_img,(v)=>{ sel.props.c2_img=v; render(); }));
    f.appendChild(field('Card 3 Title','text',sel.props.c3_title,(v)=>{ sel.props.c3_title=v; render(); }));
    f.appendChild(textarea('Card 3 Desc',sel.props.c3_desc,(v)=>{ sel.props.c3_desc=v; render(); }));
    f.appendChild(field('Card 4 Title','text',sel.props.c4_title,(v)=>{ sel.props.c4_title=v; render(); }));
    f.appendChild(textarea('Card 4 Desc',sel.props.c4_desc,(v)=>{ sel.props.c4_desc=v; render(); }));
  }

  if(sel.type==='proConList'){
    f.appendChild(field('Main Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(field('Old Title','text',sel.props.oldTitle,(v)=>{ sel.props.oldTitle=v; render(); }));
    f.appendChild(textarea('Old Desc',sel.props.oldDesc,(v)=>{ sel.props.oldDesc=v; render(); }));
    f.appendChild(textarea('Old Items (comma separated)',sel.props.oldItems.join(', '),(v)=>{ sel.props.oldItems=v.split(',').map(s=>s.trim()); render(); }));
    f.appendChild(field('New Title','text',sel.props.newTitle,(v)=>{ sel.props.newTitle=v; render(); }));
    f.appendChild(textarea('New Desc',sel.props.newDesc,(v)=>{ sel.props.newDesc=v; render(); }));
    f.appendChild(textarea('New Items (comma separated)',sel.props.newItems.join(', '),(v)=>{ sel.props.newItems=v.split(',').map(s=>s.trim()); render(); }));
  }

  if(sel.type==='gradientHero'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(textarea('Subtitle',sel.props.subtitle,(v)=>{ sel.props.subtitle=v; render(); }));
    f.appendChild(field('Button Text','text',sel.props.btnText,(v)=>{ sel.props.btnText=v; render(); }));
    f.appendChild(field('Button URL','text',sel.props.btnHref,(v)=>{ sel.props.btnHref=v; render(); }));
    f.appendChild(field('Gradient Color 1','text',sel.props.gradA,(v)=>{ sel.props.gradA=v; render(); }));
    f.appendChild(field('Gradient Color 2','text',sel.props.gradB,(v)=>{ sel.props.gradB=v; render(); }));
    f.appendChild(field('Gradient Color 3','text',sel.props.gradC,(v)=>{ sel.props.gradC=v; render(); }));
  }

  if(sel.type==='roadmap'){
    f.appendChild(field('Title','text',sel.props.title,(v)=>{ sel.props.title=v; render(); }));
    f.appendChild(arrayEditor('Steps', ['version','title','desc','status'], sel.props.steps, (a)=>{ sel.props.steps=a; render(); }));
  }

  if(sel.type==='fauxNode'){
    f.appendChild(field('Node Title','text',sel.props.nodeTitle,(v)=>{ sel.props.nodeTitle=v; render(); }));
    f.appendChild(field('Node Header Color','text',sel.props.nodeColor,(v)=>{ sel.props.nodeColor=v; render(); }));
    f.appendChild(textarea('Inputs (comma separated)',sel.props.inputs.join(', '),(v)=>{ sel.props.inputs=v.split(',').map(s=>s.trim()); render(); }));
    f.appendChild(textarea('Outputs (comma separated)',sel.props.outputs.join(', '),(v)=>{ sel.props.outputs=v.split(',').map(s=>s.trim()); render(); }));
  }

  if(sel.type==='spacer'){
    f.appendChild(field('Height (px, rem)', 'text', sel.props.height, (v)=>{ sel.props.height=v; render(); }));
  }

  if(sel.type==='divider'){
    f.appendChild(field('Line Color', 'text', sel.props.color, (v)=>{ sel.props.color=v; render(); }));
    f.appendChild(field('Thickness', 'text', sel.props.thickness, (v)=>{ sel.props.thickness=v; render(); }));
    f.appendChild(field('Margin', 'text', sel.props.margin, (v)=>{ sel.props.margin=v; render(); }));
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

