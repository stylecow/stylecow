stylecow: modern CSS for all browser
====================================

Node library to fix your css code and make it compatible with all browsers.

Visit http://stylecow.github.io/ for documentation

Created by Oscar Otero <http://oscarotero.com> / <oom@oscarotero.com>

License: MIT

## Changelog

v.3.1

* Implemented the source maps
* Changed the way the code is generated. Now there is the `stylecow.Code` class to configure how the code is created, the source map, etc. For example:

```js
var stylecow = require('stylecow');

//Get some code
var css = stylecow.createFromFile('my-styles.css');

//Save the code
var code = new stylecow.Code(css, {
	output: 'styles.min.css', //output filename
    style: 'minify', //minify the code
    sourceMap: 'styles.min.map',  //The source map file
    previousSourceMap: 'styles.map' //Set this value if there is the file has a source map created by other preprocessor, such less/sass and it's not defined in the code.
});
```
* New `stylecow.merge()` function to merge two files:
```js
var main_css = stylecow.createFromFile('styles1.css');
var other_css = stylecow.createFromFile('styles2.css');

//Merges "other_css" into "main_css"
stylecow.merge(main_css, other_css);
```
* Improved error handling. Now on error, a `stylecow.Error()` class is throwed

v.3.0

* The parser has been completely rewriten.
* Performance improved x2
* Support for any type of at-rule
* Better API
* The plugin "linear-gradient" was merged with "prefixes"
