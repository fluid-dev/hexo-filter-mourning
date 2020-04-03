'use strict';

hexo.extend.filter.register('after_render:html', function (html) {
  const config = hexo.config;
  if (!config.memorial_day.enable) {
    return;
  }

  if (html.search('<html') === -1 || html.search('grayscale(100%)') > -1) {
    return;
  }

  const js = `
  <script type="text/javascript">
    var now = new Date();
    var dayStr = '${ config.memorial_day.day }';
    var day = dayStr ? new Date(dayStr) : new Date();
    var isMemorialDay = now.getFullYear() === day.getFullYear() && now.getMonth() === day.getMonth() && now.getDay()  === day.getDay();
    if (isMemorialDay) {
      var html = document.getElementsByTagName('html')[0];
      html.style.setProperty('-webkit-filter', 'grayscale(100%)');
      html.style.setProperty('filter', 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)')
    }
  </script>
  `;

  return js + html;
});
