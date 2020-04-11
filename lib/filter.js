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

  const js = `
  <script type="text/javascript">
    (function() {
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
