export default {
  label: '🖼️ Responsive Image Row',
  desc: 'Fluid grid of images with configurable columns',
  defaults: () => ({
    itemsPerRow: 3,
    gap: 12,
    aspectRatio: '16/9',
    imgs: [
      'https://assets.superhivemarket.com/cache/5f525fcc03dd92e5709598c769bd480d.jpg',
      'https://assets.superhivemarket.com/cache/d49a5fb485d53d2f3605b9c3c1665e04.jpg',
      'https://assets.superhivemarket.com/cache/0cd9ee6fc0d0d7194b2f202c5ac8b86b.JPG'
    ],
    baseSurfaceStyle: 'margin:0 0 18px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, attr }) => {
    const cols = p.itemsPerRow || 3;
    const gap = p.gap !== undefined ? p.gap : 12;
    const ratio = p.aspectRatio || '16/9';
    
    // Using grid with explicit columns to respect itemsPerRow, 
    // while ensuring they are fluid via 1fr.
    const gridStyle = `
      display: grid; 
      grid-template-columns: repeat(${cols}, 1fr); 
      gap: ${gap}px;
    `;

    return `
    <div class="block" data-type="imgRow3">
      <div data-surface="1" style="${gridStyle} ${mergeSurfaceStyle(p)}">
        ${p.imgs.map(src => `
          <div style="width:100%; aspect-ratio: ${ratio}; overflow:hidden; border-radius:12px;">
            <img src="${attr(src)}" style="width:100%; height:100%; object-fit:cover; display:block;">
          </div>
        `).join('')}
      </div>
    </div>`;
  }
};
