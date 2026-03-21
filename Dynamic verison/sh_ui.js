/* =========================
   SuperHive UI Toolkit
   ========================= */

const html = s => {
  if (s == null) return '';
  const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
  return String(s).replace(/[&<>"']/g, m => map[m]);
};

const attr = s => html(s).replace(/"/g, '&quot;');

export function field(label, type, value, on) {
  const d = document.createElement('div'); d.className='field';
  const isColor = label.toLowerCase().match(/(color|bg|background|tint|accent)/i);
  
  if (isColor) {
    const hex = (value && typeof value === 'string' && value.match(/^#[0-9A-Fa-f]{6}$/)) ? value : '#000000';
    d.innerHTML = `<label>${label}</label><input type="color" value="${hex}" style="width:100%; height:28px; padding:0; border:none; border-radius:4px; background:none; cursor:pointer;" />`;
    
    const colInp = d.querySelector('input[type="color"]');
    colInp.addEventListener('input', e=> {
      on(e.target.value);
    });
  } else {
    d.innerHTML = `<label>${label}</label><input type="${type}" value="${attr(value)}"/>`;
    d.querySelector('input').addEventListener('input', e=> on(e.target.value));
  }
  return d;
}

export function textarea(label, value, on) {
  const d = document.createElement('div'); d.className='field';
  d.innerHTML = `<label>${label}</label><textarea>${html(value)}</textarea>`;
  d.querySelector('textarea').addEventListener('input', e=> on(e.target.value));
  return d;
}

export function select(label, value, options, on) {
  const d = document.createElement('div'); d.className='field';
  const opts = options.map(o => `<option value="${attr(o.value)}" ${o.value === value ? 'selected' : ''}>${html(o.label)}</option>`).join('');
  d.innerHTML = `<label>${label}</label><select>${opts}</select>`;
  d.querySelector('select').addEventListener('change', e => on(e.target.value));
  return d;
}

export function addCountControls(container, label, count, onChange, updateInspectorCb) {
  const wrap = document.createElement('div'); wrap.className='field';
  wrap.innerHTML = `<label>${label} (count)</label><input type="number" min="0" value="${count}">`;
  wrap.querySelector('input').addEventListener('input', e=>{
    const n = Math.max(0, parseInt(e.target.value||'0',10));
    onChange(n);
    if(updateInspectorCb) updateInspectorCb();
  });
  container.appendChild(wrap);
}

export function ensureLength(arr, n, makeItem) {
  const a = (arr || []).slice(0, n);
  while(a.length < n) a.push(makeItem());
  return a;
}

export function arrayEditor(label, keys, arr, onChange, updateInspector) {
  const el = document.createElement('div'); el.className='field';
  const l = document.createElement('label'); l.innerText = label; el.appendChild(l);
  
  const list = document.createElement('div'); list.style.marginTop='8px';
  (arr||[]).forEach((item, idx) => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--panel2); border:1px solid var(--border); padding:8px; border-radius:6px; margin-bottom:8px; position:relative;';
    
    const btnDel = document.createElement('button');
    btnDel.innerText = 'Delete';
    btnDel.className = 'tool danger';
    btnDel.style.cssText = 'font-size:10px; padding:2px 6px; cursor:pointer; float:right; margin-bottom:4px;';
    btnDel.onclick = () => { 
      arr.splice(idx, 1); 
      onChange(arr); 
      if(updateInspector) updateInspector(); 
    };
    card.appendChild(btnDel);

    keys.forEach(k => {
      const row = document.createElement('div'); row.style.marginBottom='6px'; row.style.clear='both';
      const klabel = document.createElement('div'); klabel.innerText=k; klabel.style.cssText='font-size:10px; color:var(--muted); text-transform:uppercase; margin-bottom:2px;';
      const isLarge = k==='desc' || k==='text' || k==='code' || k==='a' || k==='details' || k==='notes';
      const isColor = k.toLowerCase().match(/(color|bg|background|tint|accent)/i);
      
      const inpWrap = document.createElement('div');
      inpWrap.style.display = 'flex';
      inpWrap.style.gap = '6px';
      
      const inp = document.createElement(isLarge ? 'textarea' : 'input');
      inp.value = Array.isArray(item[k]) ? item[k].join(isLarge ? '\n' : ', ') : (item[k] || '');
      inp.style.cssText = `flex:1; box-sizing:border-box; padding:6px; font-size:12px; border:1px solid var(--border); border-radius:4px; background:var(--panel); color:var(--text); font-family:${k.includes('code')?'monospace':'inherit'};`;
      if(isLarge) inp.style.height = '60px';
      
      inp.oninput = (e) => { 
        if(Array.isArray(item[k])) item[k] = e.target.value.split(isLarge ? /\n+/ : ',').map(s=>s.trim()).filter(Boolean);
        else item[k] = e.target.value; 
        onChange(arr); 
      };

      if (isColor && !isLarge) {
        inp.type = 'color';
        inp.value = (item[k] && typeof item[k] === 'string' && item[k].match(/^#[0-9A-Fa-f]{6}$/)) ? item[k] : '#000000';
        inp.style.cssText = 'width:100%; height:28px; padding:0; border:none; border-radius:4px; background:none; cursor:pointer;';
      }
      
      inpWrap.appendChild(inp);
      
      row.appendChild(klabel); row.appendChild(inpWrap);
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
      if(k==='stars') nu[k]=5; 
      else if(k==='highlight') nu[k]='false'; 
      else if(k==='feats') nu[k]=['Feature']; 
      else if(k==='bgColor') nu[k]='#2a3566';
      else if(k==='textColor') nu[k]='#eaf0ff';
      else if(k==='notes') nu[k]=['Note']; 
      else nu[k]='';
    }); 
    arr.push(nu); 
    onChange(arr); 
    if(updateInspector) updateInspector();
  };
  el.appendChild(btnAdd);
  
  return el;
}

export const shUI = {
  html, attr, field, textarea, select, addCountControls, ensureLength, arrayEditor
};
