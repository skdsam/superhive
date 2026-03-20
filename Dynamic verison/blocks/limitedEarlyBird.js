export default {
  label: '🦜 Limited Early Bird',
  desc: 'Show a limited offer for the first X purchases',
  defaults: () => ({
    title: 'EARLY BIRD SPECIAL 🦜',
    subtitle: 'High quality add-ons at a fraction of the cost',
    price: '$49',
    limitCount: 50,
    accentColor: '#3b82f6',
    bgColor: '#ffffff',
    textColor: '#1f2937',
    baseSurfaceStyle: 'margin:32px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    return `
    <div class="block" data-type="limitedEarlyBird">
      <style>
        .eb-card {
          background: ${attr(p.bgColor)};
          color: ${attr(p.textColor)};
          padding: 40px;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          text-align: center;
        }
        .eb-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: ${attr(p.accentColor)};
        }
        .eb-subtitle {
          font-size: 16px;
          opacity: 0.7;
          margin-bottom: 32px;
        }
        .eb-price-tag {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 24px;
          display: block;
        }
        .eb-limit-badge {
          display: inline-block;
          background: ${attr(p.accentColor)};
          color: white;
          padding: 8px 24px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 16px;
          text-transform: uppercase;
        }
      </style>
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div class="eb-card">
          <h2 class="eb-title">${html(p.title)}</h2>
          <p class="eb-subtitle">${html(p.subtitle)}</p>
          
          <span class="eb-price-tag">${html(p.price)}</span>
          
          <div class="eb-limit-badge">
            First ${html(p.limitCount)} customers only
          </div>
        </div>
      </div>
    </div>`;
  }
};
