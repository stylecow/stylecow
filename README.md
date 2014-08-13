stylecow: modern CSS for all browser
====================================

Node library to fix your css code and make it compatible with all browsers.

Use npm to install. (-g is for install globally)

```
$ npm install stylecow -g
```

Usage:

```
$ stylecow convert input.css output.css
```

Available plugins:
------------------

### Support for CSS incoming features:

* [color](https://github.com/stylecow/stylecow-plugin-color)
* [matches](https://github.com/stylecow/stylecow-plugin-matches)
* [nested-rules](https://github.com/stylecow/stylecow-plugin-nested-rules)
* [variables](https://github.com/stylecow/stylecow-plugin-variables)

### Utilities:

* [import](https://github.com/stylecow/stylecow-plugin-import)
* [source-comment](https://github.com/stylecow/stylecow-plugin-source-comment)


### Apply vendor prefixes, fixes well know bugs:

* [animation](https://github.com/stylecow/stylecow-plugin-animation)
* [appearance](https://github.com/stylecow/stylecow-plugin-appearance)
* [background](https://github.com/stylecow/stylecow-plugin-background)
* [border](https://github.com/stylecow/stylecow-plugin-border)
* [box-shadow](https://github.com/stylecow/stylecow-plugin-box-shadow)
* [box-sizing](https://github.com/stylecow/stylecow-plugin-box-sizing)
* [calc](https://github.com/stylecow/stylecow-plugin-calc)
* [clip](https://github.com/stylecow/stylecow-plugin-clip)
* [column](https://github.com/stylecow/stylecow-plugin-column)
* [cursor](https://github.com/stylecow/stylecow-plugin-cursor)
* [document](https://github.com/stylecow/stylecow-plugin-document)
* [flex](https://github.com/stylecow/stylecow-plugin-flex)
* [float](https://github.com/stylecow/stylecow-plugin-float)
* [fullscreen](https://github.com/stylecow/stylecow-plugin-fullscreen)
* [grid](https://github.com/stylecow/stylecow-plugin-grid)
* [initial](https://github.com/stylecow/stylecow-plugin-initial)
* [inline-block](https://github.com/stylecow/stylecow-plugin-inline-block)
* [linear-gradient](https://github.com/stylecow/stylecow-plugin-linear-gradient)
* [mask](https://github.com/stylecow/stylecow-plugin-mask)
* [min-height](https://github.com/stylecow/stylecow-plugin-min-height)
* [object](https://github.com/stylecow/stylecow-plugin-object)
* [opacity](https://github.com/stylecow/stylecow-plugin-opacity)
* [pseudoelements](https://github.com/stylecow/stylecow-plugin-pseudoelements)
* [transform](https://github.com/stylecow/stylecow-plugin-transform)
* [transition](https://github.com/stylecow/stylecow-plugin-transition)
* [type](https://github.com/stylecow/stylecow-plugin-type)
* [region](https://github.com/stylecow/stylecow-plugin-region)
* [rem](https://github.com/stylecow/stylecow-plugin-rem)
* [sizing](https://github.com/stylecow/stylecow-plugin-sizing)
* [sticky](https://github.com/stylecow/stylecow-plugin-sticky)
* [user-select](https://github.com/stylecow/stylecow-plugin-user-select)
* [vmin](https://github.com/stylecow/stylecow-plugin-vmin)

### Emulate some features in old explorers using ms-filters:

* [msfilter-background-alpha](https://github.com/stylecow/stylecow-plugin-msfilter-background-alpha)
* [msfilter-linear-gradient](https://github.com/stylecow/stylecow-plugin-msfilter-linear-gradient)
* [msfilter-transform](https://github.com/stylecow/stylecow-plugin-msfilter-transform)

Created by Oscar Otero <http://oscarotero.com> / <oom@oscarotero.com>

License: MIT
