export default {
  label: '🧨 Special Sale',
  desc: 'Promotional banner with pricing and date range',
  defaults: () => ({
    title: 'SPRING FLASH SALE 🧨',
    subtitle: 'Upgrade your 3D workflow now',
    oldPrice: '$199',
    newPrice: '$99',
    dateRange: 'March 20 - March 30',
    bgColor1: '#ef4444',
    bgColor2: '#b91c1c',
    textColor: '#ffffff',
    buttonText: '',
    baseSurfaceStyle: 'margin:32px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    return `
    <div class="block" data-type="specialSale">
      <style>
        .sale-banner {
          background: linear-gradient(135deg, ${attr(p.bgColor1)}, ${attr(p.bgColor2)});
          color: ${attr(p.textColor)};
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        }
        .sale-banner::before {
          content: "";
          position: absolute;
          top: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }
        .sale-title {
          font-size: 42px;
          font-weight: 900;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -1px;
        }
        .sale-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 24px;
        }
        .pricing-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .old-price {
          font-size: 24px;
          text-decoration: line-through;
          opacity: 0.7;
        }
        .new-price {
          font-size: 48px;
          font-weight: 800;
        }
        .date-range {
          display: inline-block;
          background: rgba(0,0,0,0.2);
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 600;
          ${p.buttonText ? 'margin-bottom: 24px;' : 'margin-bottom: 0;'}
        }
        .sale-btn {
          display: inline-block;
          background: #fff;
          color: ${attr(p.bgColor1)};
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .sale-btn:hover {
          transform: scale(1.05);
        }
      </style>
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div class="sale-banner">
          <h2 class="sale-title">${html(p.title)}</h2>
          <p class="sale-subtitle">${html(p.subtitle)}</p>
          
          <div class="pricing-wrap">
            <span class="old-price">${html(p.oldPrice)}</span>
            <span class="new-price">${html(p.newPrice)}</span>
          </div>
          
          <div>
            <span class="date-range">Ends on ${html(p.dateRange)}</span>
          </div>
          
          ${p.buttonText ? `<a href="#" class="sale-btn">${html(p.buttonText)}</a>` : ''}
        </div>
      </div>
    </div>`;
  }
};
