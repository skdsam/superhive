export default {
  label: '🎟️ Promo Banner',
  desc: 'Show a discount banner with a copyable promo code and validity dates',
  defaults: () => ({
    title: 'CLAIM YOUR DISCOUNT! 🎟️',
    promoCode: 'SUPER50',
    discountLabel: '$50 OFF YOUR ENTIRE ORDER',
    validity: 'Valid from Oct 1st until Oct 15th',
    accentColor: '#10b981',
    bgColor: '#f0fdf4',
    textColor: '#064e3b',
    baseSurfaceStyle: 'margin:32px 0;',
    style: ''
  }),
  render: (p, { mergeSurfaceStyle, html, attr }) => {
    return `
    <div class="block" data-type="promoBanner">
      <style>
        .promo-card {
          background: ${attr(p.bgColor)};
          color: ${attr(p.textColor)};
          padding: 32px;
          border-radius: 20px;
          border: 2px dashed ${attr(p.accentColor)};
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }
        .promo-card::before, .promo-card::after {
          content: "";
          position: absolute;
          width: 40px;
          height: 40px;
          background: white; /* Cut-out effect */
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
        .promo-card::before { left: -25px; }
        .promo-card::after { right: -25px; }

        .promo-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1px;
          opacity: 0.9;
        }
        .promo-discount {
          font-size: 32px;
          font-weight: 900;
          line-height: 1.2;
        }
        .promo-code-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.7);
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .promo-code {
          font-family: monospace;
          font-size: 28px;
          font-weight: 900;
          color: ${attr(p.accentColor)};
          letter-spacing: 2px;
        }
        .promo-validity {
          font-size: 14px;
          opacity: 0.7;
          font-weight: 600;
        }
      </style>
      <div data-surface="1" style="${mergeSurfaceStyle(p)}">
        <div class="promo-card">
          <div class="promo-title">${html(p.title)}</div>
          <div class="promo-discount">${html(p.discountLabel)}</div>
          
          <div class="promo-code-wrap">
            <span class="promo-code">${html(p.promoCode)}</span>
          </div>
          
          <div class="promo-validity">${html(p.validity)}</div>
        </div>
      </div>
    </div>`;
  }
};
