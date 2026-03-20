export default (f, p, render, { field, openGlobalAddonsModal }) => {
    f.appendChild(field('Intro Title','text',p.introTitle,(v)=>{ p.introTitle=v; render(); }));
    f.appendChild(field('Intro Sub','text',p.introSub,(v)=>{ p.introSub=v; render(); }));
    
    const notice = document.createElement('div');
    notice.className = 'field';
    notice.innerHTML = `<label>Global Config</label><button class="tool" style="width:100%; border-color:var(--accent); color:var(--accent);">Edit Global Add-ons Template</button>`;
    notice.querySelector('button').onclick = () => openGlobalAddonsModal();
    f.appendChild(notice);
  };
