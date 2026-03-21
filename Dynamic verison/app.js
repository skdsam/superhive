const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

import { shUI } from './sh_ui.js';

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
  render(); 
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
   Block Registry & Loader
------------------------- */
let Blocks = {};

async function initBlocks() {
  try {
    const res = await fetch('blocks.json');
    const blockNames = await res.json();
    
    const loadPromises = blockNames.map(async name => {
      try {
        const mod = await import(`./blocks/${name}.js`);
        Blocks[name] = mod.default;
        
        try {
          const uiMod = await import(`./block_UI/${name}_UI.js`);
          if (uiMod.default) {
            Blocks[name].inspector = uiMod.default;
          }
        } catch (e) {
          // No separate UI
        }
      } catch (e) {
        console.error(`Failed to load block: ${name}`, e);
      }
    });
    
    await Promise.all(loadPromises);
    console.log('All blocks loaded:', Object.keys(Blocks));
    
    buildLibrary();
    if(!tryRestore()) loadDefault();
  } catch (e) {
    console.error('Failed to initialize blocks:', e);
  }
}

/* -------------------------
   Helpers
------------------------- */
const html = s => {
  if (s == null) return '';
  const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
  return String(s).replace(/[&<>"']/g, m => map[m]);
};
const attr = s => html(s).replace(/"/g, '&quot;');
const mergeSurfaceStyle = (p) => {
  let s = p.baseSurfaceStyle || '';
  if (p.margin) s += (s.endsWith(';') || !s ? '' : ';') + ` margin:${p.margin};`;
  if (p.padding) s += (s.endsWith(';') || !s ? '' : ';') + ` padding:${p.padding};`;
  if (p.bg) s += (s.endsWith(';') || !s ? '' : ';') + ` background:${p.bg};`;
  if (p.border) s += (s.endsWith(';') || !s ? '' : ';') + ` border:${p.border};`;
  if (p.radius) s += (s.endsWith(';') || !s ? '' : ';') + ` border-radius:${p.radius};`;
  if (p.color) s += (s.endsWith(';') || !s ? '' : ';') + ` color:${p.color};`;
  if (p.style) s += (s.endsWith(';') || !s ? '' : ';') + ` ${p.style};`;
  return s.trim();
};

const shHelpers = { 
  html: shUI.html, 
  attr: shUI.attr, 
  mergeSurfaceStyle, 
  field: (...args) => shUI.field(...args), 
  textarea: (...args) => shUI.textarea(...args), 
  select: (...args) => shUI.select(...args),
  arrayEditor: (...args) => shUI.arrayEditor(...args, updateInspector), 
  addCountControls: (...args) => shUI.addCountControls(...args, updateInspector), 
  ensureLength: (...args) => shUI.ensureLength(...args), 
  openGlobalAddonsModal: (...args) => openGlobalAddonsModal(...args) 
};
window.shHelpers = shHelpers;

/* -------------------------
   Render Loop
------------------------- */
function render(){
  const root = $('#canvas');
  if(!root) return;
  root.innerHTML = state.blocks.map(b=>{
    const def = Blocks[b.type];
    if(!def) return `<div class="block-error">Block not loaded: ${b.type}</div>`;
    return def.render(b.props, shHelpers);
  }).join('');
  
  let i=0; 
  root.querySelectorAll('.block').forEach(el=>{ 
    const blk = state.blocks[i++];
    if(blk) {
      el.dataset.id = blk.id; 
      if(blk.hidden) el.style.display = 'none';
    }
  });

  attachCanvasHandlers();
  if(state.selectedId) selectBlock(state.selectedId, false);
  autosave();
  
  if(!$('#panel-layers').classList.contains('hidden')) {
    renderLayers();
  }
}

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
    });
    
    el.onclick = (e) => {
      selectBlock(blk.id);
    };
    
    const info = document.createElement('div');
    info.className = 'layer-info';
    info.innerHTML = `
      <div class="layer-title">${html(blk.name || Blocks[blk.type]?.label || blk.type)} ${blk.hidden ? '👁️‍🗨️' : ''}</div>
      <div class="layer-type">${blk.type}</div>
    `;
    
    const actions = document.createElement('div');
    actions.className = 'layer-actions';
    
    const btnUp = document.createElement('button');
    btnUp.className = 'layer-btn';
    btnUp.innerHTML = '↑';
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
  const f = $('#content-fields');
  f.innerHTML = '';
  $('#sel-path').textContent = sel ? `Selected: ${sel.type} (${sel.id})` : 'No selection';
  
  if(!sel) return;

  // Sync general style fields
  $('#st-margin').value = readCSS(sel.props.style, 'margin');
  $('#st-padding').value = readCSS(sel.props.style, 'padding');
  const bg = readCSS(sel.props.style, 'background');
  $('#st-bg').value = bg;
  if (bg.match(/^#[0-9A-Fa-f]{6}$/)) $('#st-bg-picker').value = bg;
  
  $('#st-border').value = readCSS(sel.props.style, 'border');
  $('#st-radius').value = readCSS(sel.props.style, 'border-radius');
  
  const col = readCSS(sel.props.style, 'color');
  $('#st-color').value = col;
  if (col.match(/^#[0-9A-Fa-f]{6}$/)) $('#st-color-picker').value = col;
  
  $('#st-inline').value = inlineRemainder(sel.props.style, ['margin','padding','background','border','border-radius','color']);
  $('#blk-name').value = sel.name || '';
  $('#blk-visible').value = sel.hidden ? 'hidden' : '';

  const def = Blocks[sel.type];
  if(def && def.inspector) {
    def.inspector(f, sel.props, render, shHelpers);
  }
}

/* -------------------------
   Library
------------------------- */
function buildLibrary(){
  const list = $('#lib-list');
  if(!list) return;
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
  
  const searchInput = $('#lib-search');
  if(searchInput){
    searchInput.oninput = (e)=>{
      const q = e.target.value.toLowerCase();
      $$('#lib-list .block-card').forEach(el=>{
        const type = el.dataset.type;
        const s = `${Blocks[type].label} ${Blocks[type].desc}`.toLowerCase();
        el.style.display = s.includes(q) ? '' : 'none';
      });
    };
  }
}

/* -------------------------
   Drag & Drop Handlers
------------------------- */
function attachCanvasHandlers(){
  const root = $('#canvas');
  clearDropLines();

  root.querySelectorAll('.block').forEach(el=>{
    const id = el.dataset.id;
    
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

    el.onclick = e => { selectBlock(id); e.stopPropagation(); };

    el.addEventListener('dragover', e=>{
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const where = y < rect.height/2 ? 'before' : 'after';
      showDropLine(el, where);
      state.drag.overId = id;
      state.drag.where = where;
    });

    el.addEventListener('dragleave', ()=> clearDropLines());
    el.addEventListener('drop', e=>{ e.preventDefault(); onDropCommit(); });
  });

  root.onclick = () => selectBlock(null);
  root.addEventListener('dragover', e=> e.preventDefault());
  root.addEventListener('drop', e=>{
    e.preventDefault();
    if(!state.drag.overId) onDropCommit(true);
  });
}

function onDropCommit(dropToEnd=false){
  clearDropLines();
  const { sourceId, newType, overId, where } = state.drag;

  if(newType){
    const blk = { id:uid(), type:newType, props:Blocks[newType].defaults() };
    if(dropToEnd || !overId){
      state.blocks.push(blk);
    }else{
      const idx = state.blocks.findIndex(b=>b.id===overId);
      state.blocks.splice(where==='before'? idx : idx+1, 0, blk);
    }
    render(); selectBlock(blk.id);
  } else if(sourceId){
    const from = state.blocks.findIndex(b=>b.id===sourceId);
    if(from<0) return;
    const [blk] = state.blocks.splice(from,1);
    const to = dropToEnd ? state.blocks.length : state.blocks.findIndex(b=>b.id===overId);
    if(to < 0) state.blocks.push(blk);
    else state.blocks.splice(where==='before' ? to : to+1, 0, blk);
    render(); selectBlock(blk.id);
  }
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
   Toolbar Handlers
------------------------- */
$('#btn-dup').onclick = ()=>{
  const sel=getSelected(); if(!sel) return;
  const i=state.blocks.findIndex(b=>b.id===sel.id);
  const nu = JSON.parse(JSON.stringify(sel));
  nu.id = uid();
  state.blocks.splice(i+1, 0, nu);
  render();
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
$('#btn-del').onclick = () => {
  if(!getSelected()) return;
  openModal('modal-delete-block');
};

$('#confirm-delete-block-do').onclick = () => {
  const sel = getSelected();
  if(sel) {
    state.blocks = state.blocks.filter(b=>b.id!==sel.id);
    state.selectedId=null; render();
  }
  closeModal('modal-delete-block');
};

/* -------------------------
   Style Inputs
------------------------- */
$('#st-margin').oninput = rebuildStyle;
$('#st-padding').oninput = rebuildStyle;
$('#st-bg').oninput = e => {
  if(e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) $('#st-bg-picker').value = e.target.value;
  rebuildStyle();
};
$('#st-bg-picker').oninput = e => {
  $('#st-bg').value = e.target.value;
  rebuildStyle();
};
$('#st-border').oninput = rebuildStyle;
$('#st-radius').oninput = rebuildStyle;
$('#st-color').oninput = e => {
  if(e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) $('#st-color-picker').value = e.target.value;
  rebuildStyle();
};
$('#st-color-picker').oninput = e => {
  $('#st-color').value = e.target.value;
  rebuildStyle();
};
$('#st-inline').oninput = rebuildStyle;

$('#blk-name').oninput = e=>{ 
  const sel=getSelected(); 
  if(sel){ 
    sel.name=e.target.value; 
    renderLayers(); 
  }
};
$('#blk-visible').onchange = e=>{
  const sel=getSelected(); if(sel){
    sel.hidden = e.target.value === 'hidden';
    render();
  }
};

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
  render();
}

/* -------------------------
   Top Bar Actions
------------------------- */
$('#btn-new').onclick = ()=>{ if(confirm('Start a new page?')){ loadDefault(); }};
$('#btn-save').onclick = ()=>{ openModal('modal-save'); $('#save-name').value = `Template ${new Date().toLocaleString()}`; };
$('#save-do').onclick = ()=>{
  const name=$('#save-name').value.trim(); if(!name) return;
  const list = JSON.parse(localStorage.getItem('sh_templates')||'[]');
  list.unshift({ name, data: JSON.stringify(state.blocks) });
  localStorage.setItem('sh_templates', JSON.stringify(list.slice(0,50)));
  closeModal('modal-save'); alert('Saved.');
};
$('#save-file-do').onclick = ()=>{
  const name=$('#save-name').value.trim() || 'template';
  downloadJSON(state.blocks, `superhive_layout_${name.toLowerCase().replace(/\s+/g, '_')}.json`);
  closeModal('modal-save');
};

$('#btn-clear').onclick = () => openModal('modal-confirm');
$('#confirm-clear-do').onclick = () => {
  state.blocks = [];
  state.selectedId = null;
  render();
  closeModal('modal-confirm');
};

$('#btn-load').onclick = ()=>{ openModal('modal-load'); buildLoadList(); };
$('#load-do').onclick = ()=>{
  const sel=$('#load-select').value; if(!sel) return;
  state.blocks = JSON.parse(sel); state.selectedId=null; render(); closeModal('modal-load');
};
$('#load-file-do').onclick = ()=>{
  uploadJSON(json => {
    if(!Array.isArray(json)) return alert('Invalid template file.');
    state.blocks = json; state.selectedId = null; render(); closeModal('modal-load');
  });
};

$('#btn-import').onclick = ()=> openModal('modal-import');
$('#import-do').onclick = ()=>{
  const val=$('#import-html').value;
  const safe = val.replace(/<script[\s\S]*?<\/script>/gi,'');
  state.blocks = [{ id:uid(), type:'raw', props: Blocks.raw.defaults() }];
  state.blocks[0].props.html = safe;
  render(); closeModal('modal-import');
};

$('#btn-export').onclick = ()=> exportHTML();
$('#btn-bg-variants').onclick = ()=> openBGVariants();
$('#btn-copy').onclick = ()=> copyExportHTML();
$('#btn-global-addons').onclick = ()=> openGlobalAddonsModal();

function buildLoadList(){
  const list = JSON.parse(localStorage.getItem('sh_templates')||'[]');
  const sel = $('#load-select'); sel.innerHTML='';
  list.forEach(t=>{
    const o=document.createElement('option'); o.textContent=t.name; o.value=t.data; sel.appendChild(o);
  });
}

/* -------------------------
   Export Logic
------------------------- */
function buildExportHTML(){
  const raw = state.blocks.map(b => Blocks[b.type].render(b.props, shHelpers)).join('\n');
  const container = document.createElement('div');
  container.innerHTML = raw;
  container.querySelectorAll('.block').forEach(bl => {
    const parent = bl.parentNode;
    while (bl.firstChild) parent.insertBefore(bl.firstChild, bl);
    parent.removeChild(bl);
  });
  
  // Basic inline style injection for core classes
  const classes = {
    '.sh-card': 'background:#ffffff; border:1px solid #e2e6f4; border-radius:16px; padding:16px;',
    '.sh-card-soft': 'background:#f6f7fb; border:1px solid #e2e6f4; border-radius:14px; padding:14px;',
    '.sh-hero': 'background:linear-gradient(135deg,#0f1220,#1b2451); color:#eaf0ff; border:1px solid rgba(255,255,255,.15); border-radius:16px; padding:28px 26px;',
    '.tag': 'display:inline-block; padding:4px 8px; border-radius:999px; background:#f6f7fb; border:1px solid #e2e6f4; color:#394067; font-size:11px;'
  };
  
  Object.entries(classes).forEach(([sel, css])=>{
    container.querySelectorAll(sel).forEach(el=>{
      const cur = el.getAttribute('style') || '';
      el.setAttribute('style', css + (css.endsWith(';')?'':';') + cur);
    });
  });

  const shell = document.createElement('div');
  shell.setAttribute('style', 'max-width:880px; margin:0 auto; font-family:sans-serif; color:#0f1220; line-height:1.55;');
  shell.innerHTML = container.innerHTML;
  return shell.outerHTML;
}

function exportHTML(){
  const htmlBlob = buildExportHTML();
  downloadJSON(htmlBlob, 'superhive_export.html', 'text/html');
}

async function copyExportHTML(){
  const h = buildExportHTML();
  try {
    await navigator.clipboard.writeText(h);
    alert('Copied to clipboard ✔');
  } catch(e) {
    prompt('Copy this:', h);
  }
}

/* -------------------------
   JSON Utils
------------------------- */
function downloadJSON(data, filename, type='application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function uploadJSON(callback) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { callback(JSON.parse(ev.target.result)); } 
      catch (err) { alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* -------------------------
   Global Addons Modal
------------------------- */
let tempGlobalAddons = [];
function openGlobalAddonsModal() {
  tempGlobalAddons = JSON.parse(JSON.stringify(window.globalAddonsRegistry || []));
  renderGlobalAddonsModalFields();
  openModal('modal-global-addons');
}

function renderGlobalAddonsModalFields() {
  const f = $('#global-addons-fields');
  if(!f) return;
  f.innerHTML = '';
  addCountControls(f, 'Addons', tempGlobalAddons.length, (n)=>{
    tempGlobalAddons = ensureLength(tempGlobalAddons, n, ()=>({ href:'#', img:'https://picsum.photos/800/450', title:'New', sub:'Desc', tags:[] }));
    renderGlobalAddonsModalFields();
  });
  tempGlobalAddons.forEach((c,i)=>{
    f.appendChild(field(`Item ${i+1} Title`,'text',c.title,(v)=>c.title=v));
    f.appendChild(field(`Item ${i+1} Link`,'text',c.href,(v)=>c.href=v));
    f.appendChild(field(`Item ${i+1} Img`,'text',c.img,(v)=>c.img=v));
    f.appendChild(textarea(`Item ${i+1} Tags`,(c.tags||[]).join(', '),(v)=>c.tags=v.split(',').map(s=>s.trim()).filter(Boolean)));
    const hr = document.createElement('hr'); hr.style.margin="12px 0"; f.appendChild(hr);
  });
}

$('#save-global-addons-do').onclick = ()=>{
  window.globalAddonsRegistry = tempGlobalAddons;
  localStorage.setItem('sh_global_addons', JSON.stringify(window.globalAddonsRegistry));
  render(); closeModal('modal-global-addons');
};
$('#export-global-addons-btn').onclick = ()=> downloadJSON(tempGlobalAddons, 'sh_global_addons.json');
$('#import-global-addons-btn').onclick = ()=> uploadJSON(j => { tempGlobalAddons=j; renderGlobalAddonsModalFields(); });

/* -------------------------
   Top Bar Actions
------------------------- */
$('#btn-new').onclick = () => openModal('modal-new-page');
$('#confirm-new-page-do').onclick = () => { loadDefault(); closeModal('modal-new-page'); };
$('#btn-save').onclick = () => { openModal('modal-save'); $('#save-name').value = `Template ${new Date().toLocaleString()}`; };
$('#btn-load').onclick = () => { openModal('modal-load'); buildLoadList(); };
$('#btn-clear').onclick = () => openModal('modal-confirm');
$('#confirm-clear-do').onclick = () => { state.blocks=[]; render(); closeModal('modal-confirm'); };
$('#btn-import').onclick = () => openModal('modal-import');
$('#btn-copy').onclick = copyExportHTML;
$('#btn-export').onclick = exportHTML;

/* -------------------------
   Background Variants
------------------------- */
$('#btn-bg-variants').onclick = () => openBGVariants();
$('#btn-global-addons').onclick = () => openModal('modal-global-addons');

const BG_VARIANTS = [
  { name: 'Pure White', css: '#ffffff' },
  { name: 'Eggshell', css: '#f8fafc' },
  { name: 'Pure Dark', css: '#0f1220' },
  { name: 'Dark Blue', css: 'linear-gradient(135deg, #0f1220 0%, #1e1b4b 100%)' },
  { name: 'Indigo Night', css: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
  { name: 'Deep Space', css: '#0b0e14' },
  { name: 'Midnight Storm', css: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { name: 'Aurora Borealis', css: 'radial-gradient(at 20% 20%, rgba(34, 197, 94, 0.1) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(59, 130, 246, 0.1) 0px, transparent 50%), linear-gradient(to bottom, #020617, #0f172a)' },
  { name: 'Dark Grid', css: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), #0f1220', style: 'background-size: 32px 32px, 32px 32px;' },
  { name: 'Blue Cyber Grid', css: 'linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px), #0f172a', style: 'background-size: 40px 40px, 40px 40px;' },
  { name: 'Mesh Gradient', css: 'radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.15) 0px, transparent 50%), #0f172a' },
  { name: 'Blueprint Grid', css: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px), #1e40af', style: 'background-size: 20px 20px, 20px 20px;' },
  { name: 'Dotted Paper', css: 'radial-gradient(#cbd5e1 1px, transparent 0), #f8fafc', style: 'background-size: 20px 20px;' },
  { name: 'Glass Frost', css: 'rgba(255,255,255,0.05)', style: 'backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1);' },
  { name: 'Sunset Glow', css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { name: 'Oceanic', css: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: 'Emerald', css: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { name: 'Grid Mesh', css: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px), radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.1) 0px, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', style: 'background-size: 24px 24px, 24px 24px, 100% 100%, 100% 100%;' },
  { name: 'Royal Gold', css: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', style: 'border-left: 4px solid #eab308;' }
];


function openBGVariants(){
  const grid = $('#bg-variants-grid');
  grid.innerHTML = '';
  BG_VARIANTS.forEach(v=>{
    const it = document.createElement('div');
    it.className = 'bg-item';
    it.innerHTML = `<div class="swatch" style="background:${v.css}; ${v.style||''}"></div><div class="meta"><div>${v.name}</div><code>${v.css}</code></div>`;
    
    const useBtn = document.createElement('button');
    useBtn.textContent = 'Use';
    useBtn.onclick = ()=>{ 
      $('#st-bg').value=v.css; 
      if(v.style) $('#st-inline').value = v.style + ' ' + $('#st-inline').value;
      rebuildStyle(); 
      closeModal('modal-bg'); 
    };
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = async ()=>{
      const fullCSS = `background: ${v.css}; ${v.style||''}`;
      try { await navigator.clipboard.writeText(fullCSS); alert('CSS Copied!'); }
      catch(e) { prompt('Copy this:', fullCSS); }
    };
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'bg-btns';
    btnContainer.style.marginTop = "8px";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "6px";
    
    btnContainer.appendChild(useBtn);
    btnContainer.appendChild(copyBtn);
    
    it.querySelector('.meta').appendChild(btnContainer);
    grid.appendChild(it);
  });
  openModal('modal-bg');
}


/* -------------------------
   Boot
------------------------- */
function loadDefault(){
  const preferred = ['hero','statTrio','overview','features6','media','youtube','updates','bullets','wow','imgRow3','ctaBanner','moreAddons'];
  const all = Object.keys(Blocks);
  const order = preferred.filter(p => all.includes(p));
  // Add any remaining blocks that are not in the preferred list
  all.forEach(k => { if(!order.includes(k)) order.push(k); });

  state.blocks = order.map(type => ({ id:uid(), type, props: Blocks[type].defaults() }));
  state.selectedId=null; render();
}

function autosave(){ localStorage.setItem('sh_autosave', JSON.stringify(state.blocks)); }
function tryRestore(){ 
  const a=localStorage.getItem('sh_autosave'); 
  if(a){ try { state.blocks = JSON.parse(a); render(); return true; } catch(e){} } 
  return false; 
}

function openModal(id){ $('#'+id).style.display='flex'; }
function closeModal(id){ $('#'+id).style.display='none'; }
window.openModal = openModal;
window.closeModal = closeModal;

// Shortcut listeners
window.addEventListener('keydown', (e)=>{
  if(e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA') return;
  if(e.key==='Delete') { $('#btn-del').click(); }
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='s') { e.preventDefault(); $('#btn-save').click(); }
  if(e.key.toLowerCase()==='l') { $('#btn-toggle-left').click(); }
  if(e.key.toLowerCase()==='r') { $('#btn-toggle-right').click(); }
});

$('#btn-toggle-left').onclick = () => {
  $('.app').classList.toggle('left-hidden');
  $('#btn-toggle-left').classList.toggle('active');
};
$('#btn-toggle-right').onclick = () => {
  $('.app').classList.toggle('right-hidden');
  $('#btn-toggle-right').classList.toggle('active');
};

// Tab switching
$('#tab-lib').onclick = () => {
  $('#tab-lib').classList.add('active'); $('#tab-layers').classList.remove('active');
  $('#panel-lib').classList.remove('hidden'); $('#panel-layers').classList.add('hidden');
};
$('#tab-layers').onclick = () => {
  $('#tab-layers').classList.add('active'); $('#tab-lib').classList.remove('active');
  $('#panel-layers').classList.remove('hidden'); $('#panel-lib').classList.add('hidden');
  renderLayers();
};

// Start
initBlocks();
