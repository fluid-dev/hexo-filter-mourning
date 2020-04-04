'use strict';

hexo.extend.filter.register('after_render:html', function (html) {
  const config = hexo.config;
  if (!config.memorial_day.enable) {
    return;
  }

  if (html.search('<html') === -1 || html.search('grayscale(100%)') > -1) {
    return;
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
      var dayStr = '${ config.memorial_day.day }';
      var day = dayStr ? new Date(dayStr) : new Date();
      var isMemorialDay = now.getFullYear() === day.getFullYear() && now.getMonth() === day.getMonth() && now.getDay()  === day.getDay();
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
});
