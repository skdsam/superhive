export default (f, p, render, { field, textarea }) => {
    f.appendChild(field('Node Title','text',p.nodeTitle,(v)=>{ p.nodeTitle=v; render(); }));
    f.appendChild(field('Node Header Color','text',p.nodeColor,(v)=>{ p.nodeColor=v; render(); }));
    f.appendChild(textarea('Inputs (comma separated)',p.inputs.join(', '),(v)=>{ p.inputs=v.split(',').map(s=>s.trim()); render(); }));
    f.appendChild(textarea('Outputs (comma separated)',p.outputs.join(', '),(v)=>{ p.outputs=v.split(',').map(s=>s.trim()); render(); }));
  };
