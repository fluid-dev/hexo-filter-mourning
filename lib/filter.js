module.exports = function (html, data) {
  const config = this.config;

  if (!config.memorial_day || !config.memorial_day.enable || html.search('<html') === -1 || html.search('grayscale(100%)') > -1) {
    return html;
  }

  let days = config.memorial_day.day;

  if (!days || !Array.isArray(days) || days.length === 0) {
    this.log.error(`hexo-memorial-day: The day value is empty or not an array`);
    return html;
  }

  const css = 'html { \
    -webkit-filter: grayscale(100%); /* webkit */ \
    -moz-filter: grayscale(100%); /* firefox */ \
    -ms-filter: grayscale(100%); /* ie9 */ \
    -o-filter: grayscale(100%); /* opera */ \
    filter: grayscale(100%); \
    filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1); filter:gray; /* ie9- */ \
  }';

  const js = `
  <script type="text/javascript">
    (function () {
      var now = new Date();

      ${days.map((day, index) => `
      var day${index} = '${day.replace(/-/g, '/') }';
      if (/^\\d{1,2}\\/\\d{1,2}$/.test(day${index})) {
        day${index} = new Date().getFullYear() + '/' + day${index};
      }
      if (!/^\\d{4}\\/\\d{1,2}\\/\\d{1,2}$/.test(day${index})) {
        return ;
      }
      var memorialDay${index} = new Date(day${index});
      var isMemorialDay${index} = now.getFullYear() === memorialDay${index}.getFullYear() && now.getMonth() === memorialDay${index}.getMonth() && now.getDate() === memorialDay${index}.getDate();
      `).join('\n')}

      var isMemorialDay = ${days.map((_, index) => `isMemorialDay${index}`).join(' || ')};
      if (isMemorialDay) {
        if (document.all) {
          window.style = '${ css }';
          document.createStyleSheet('javascript:style');
        } else {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '${ css }';
          document.getElementsByTagName('HEAD').item(0).appendChild(style);
        }
      }
    })();
  </script>
  `;

  return js + html;
};