export default {
  label: '🎬 YouTube Embed',
  desc: 'Paste a YouTube embed URL',
  defaults: () => ({
    url:'https://www.youtube.com/embed/dQw4w9WgXcQ',
    baseSurfaceStyle:'margin:0 0 18px 0;',
    style:''
  }),
  render: (p, { mergeSurfaceStyle, attr }) => `
    <div class="block" data-type="youtube">
      <div data-surface="1" style="aspect-ratio:16/9;overflow:hidden;border-radius:16px;background:#000;${mergeSurfaceStyle(p)}">
        <iframe src="${attr(p.url)}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>
      </div>
    </div>`
};
