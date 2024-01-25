# hexo-filter-mourning

Grey your hexo site on the mourning day

哀悼日专用 Hexo 插件，开启后全站灰色

## Installation

```shell
$ npm i hexo-filter-mourning --save
```

## Config

In your site's `_config.yml`:

```yaml
mourning:
  # It's recommended to disable it when not in use
  enable: true
  # Specify the date(s) to be greyed out. You can set dates in the format yyyy-MM-dd or MM-dd
  day:
    - 04-04
    - 05-12
    - 09-18
```

## Screenshot

![Screenshot](https://github.com/fluid-dev/static/blob/master/hexo-theme-fluid/screenshots/memorial-day.png)
