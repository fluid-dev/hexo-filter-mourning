module.exports = function (html, data) {
  const config = this.config;

  if (!config.mourning || !config.mourning.enable || html.search('<html') === -1 || html.search('grayscale(100%)') > -1) {
    return html;
  }

  let { day: days } = config.mourning;
  if (days.length === 0) {
    this.log.error('hexo-filter-mourning: The day value is empty or not an array');
    return html;
  }
  if (!Array.isArray(days)) {
    days = [days];
  }
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day instanceof Date) {
      // yyyy-MM-dd format is converted to Date type by Hexo
      if (isNaN(day.getTime()) || day.getTime() <= 0) {
        this.log.error(`hexo-filter-mourning: The day ${day} is invalid`);
        return;
      }
      days[i] = dateToString(day);
    } else if (typeof day === 'string') {
      if (!/^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(day) && !/^\d{1,2}[/-]\d{1,2}$/.test(day)) {
        this.log.error(`hexo-filter-mourning: The day ${day} is invalid`);
        return;
      }
    } else {
      this.log.error(`hexo-filter-mourning: The day ${day} is invalid`);
      return;
    }
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
        const now = new Date();
        const days = ${JSON.stringify(days)};

        days.forEach(day => {
          let dayStr = day.replace(/-/g, '/');
          if (!/^\\d{4}\\/\\d{1,2}\\/\\d{1,2}$/.test(dayStr)) {
            dayStr = \`\${now.getFullYear()}/\${dayStr}\`;
          }
          const isMourningDay = now.toDateString() === new Date(dayStr).toDateString();

          if (isMourningDay) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = \`${css}\`;
            document.head.appendChild(style);
          }
        });
      })();
    </script>
  `;

  return js + html;
};

function dateToString(date) {
  let d = new Date(date),
    month = (d.getMonth() + 1).toString(),
    day = d.getDate().toString(),
    year = d.getFullYear().toString();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}
