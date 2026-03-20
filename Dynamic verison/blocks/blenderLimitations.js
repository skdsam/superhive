export default {
  label: '⚠️ Blender Limitations',
  desc: 'Document known issues and hardware requirements',
  defaults: () => ({
    title: 'IMPORTANT LIMITATIONS ⚠️',
    subtitle: 'Please review these known issues before purchase',
    items: [
      { 
        icon: '💻', 
        title: 'Hardware Requirements', 
        desc: 'Recommended 32GB RAM for large scene handling.' 
      },
      { 
        icon: '🍎', 
        title: 'Apple Silicon', 
        desc: 'GPU acceleration requires Metal-enabled Blender 3.1+.' 
      },
      { 
        icon: '🧊', 
        title: 'Cycles Only', 
        desc: 'Some modifiers are not currently supported in Eevee.' 
      }
    ],
    accentColor: '#f59e0b',
    bgColor: '#fffcf5',
    textColor: '#92400e',
    baseSurfaceStyle: 'margin:40px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => `
    <div class="block" data-type="blenderLimitations">
      <style>
        .lim-container {
          background: ${attr(p.bgColor)};
          color: ${attr(p.textColor)};
          padding: 60px 40px;
          border-radius: 24px;
          border: 1px solid rgba(245, 158, 11, 0.2);
          text-align: center;
        }
        .lim-header h2 {
          margin: 0;
          font-size: 32px;
          font-weight: 900;
          color: ${attr(p.accentColor)};
        }
        .lim-header p {
          margin: 8px 0 40px 0;
          opacity: 0.8;
          font-size: 16px;
        }
        .lim-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          text-align: left;
        }
        .lim-item {
          background: rgba(255, 255, 255, 0.6);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(245, 158, 11, 0.1);
          backdrop-filter: blur(4px);
          transition: transform 0.2s;
        }
        .lim-item:hover {
          transform: translateY(-4px);
        }
        .lim-icon {
          font-size: 32px;
          margin-bottom: 16px;
          display: block;
        }
        .lim-item-title {
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 8px;
          color: ${attr(p.accentColor)};
        }
        .lim-item-desc {
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.9;
        }
      </style>
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div class="lim-container">
          <div class="lim-header">
            <h2>${html(p.title)}</h2>
            <p>${html(p.subtitle)}</p>
          </div>
          <div class="lim-grid">
            ${p.items.map(item => `
              <div class="lim-item">
                <span class="lim-icon">${html(item.icon)}</span>
                <div class="lim-item-title">${html(item.title)}</div>
                <div class="lim-item-desc">${html(item.desc)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>`
};
