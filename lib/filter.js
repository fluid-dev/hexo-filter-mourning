module.exports = function (html, data) {
  const config = this.config;

  if (!config.memorial_day || !config.memorial_day.enable || html.search('<html') === -1 || html.search('grayscale(100%)') > -1) {
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

  let dayStr = (config.memorial_day.day || '').toString();
  dayStr = dayStr.replace(/-/g, '/');
  const day = dayStr ? new Date(dayStr) : new Date();
  if (isNaN(day.getTime()) || day.getTime() <= 0) {
    this.log.error(`hexo-memorial-day: The day \`${ dayStr }\` is in wrong format`);
    return;
  }

  const js = `
  <script type="text/javascript">
    (function () {
      var day = new Date('${ day.toDateString() }');
      var now = new Date();
      var isMemorialDay = now.getFullYear() === day.getFullYear() && now.getMonth() === day.getMonth() && now.getDate() === day.getDate();
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
