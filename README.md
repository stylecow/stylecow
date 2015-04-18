stylecow: modern CSS for all browser
====================================

Node library to fix your css code and make it compatible with all browsers.

Visit http://stylecow.github.io/ for documentation

Created by Oscar Otero <http://oscarotero.com> / <oom@oscarotero.com>

License: MIT

## Changelog

v.6.0

* New version of stylecow-parser (2.0) with a lot of fixes and speed improvements

v.5.0

* Added support for convert various files. From now, the stylecow.json structure has the following format:

```json
{
	"files": [
		{
			"input": "styles.css",
			"output": "styles.min.css",
			"map": "styles.min.map",
		},{
			"input": "styles2.css",
			"output": "styles2.min.css",
			"map": "styles2.min.map",
		}
	],

	// here the rest of configuration
}
```
* Removed `--input`, `--output`, `--code` and `--map` configuration
* Simplified api. The command `stylecow execute` is now simply `stylecow`
* On create new configuration file with `stylecow init`, all plugins are checked by default

v.4.2

* Included the command line interface (and deprecate stylecow-cli package)
* Separate the parser in an external package: [stylecow-parser](https://github.com/stylecow/stylecow-parser)

v.4.1
* The plugin "initial" is deprecated. Now it's included in "fixes"

v.4.0

* Rewritten the parser to be more consitent
* Changed some API methods to create and traverse through the elements
* The standard plugins are included as dependencies, so they are installed with stylecow

v.3.1

* Implemented source maps
* Changed the way the code is generated. Now there is the `stylecow.Code` class. For example:

```js
var stylecow = require('stylecow');

//Get some code
var css = stylecow.createFromFile('my-styles.css');

//Configure the code
var code = new stylecow.Code(css, {
	output: 'styles.min.css', //output filename
    style: 'minify', //minify the code
    sourceMap: 'styles.min.map',  //The source map file
    previousSourceMap: 'styles.map' //Set this value if there is the file has a source map created by other preprocessor, such less/sass and it's not defined in the code.
});

//Save the output css file and source map
code.save();

//Get the code as string:
console.log(code.code);

//Get the source map
console.log(code.map)
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
