# Changelog

## 3.0.0

* The parser has been completely rewriten.
* Performance improved x2
* Support for any type of at-rule
* Better API
* The plugin "linear-gradient" was merged with "prefixes"

### 3.1.0

* Implemented source maps
* Improved error handling. Now on error, a `stylecow.Error()` class is throwed
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

## 4.0.0

* Rewritten the parser to be more consitent
* Changed some API methods to create and traverse through the elements
* The standard plugins are included as dependencies, so they are installed with stylecow

### 4.1.0
* The plugin "initial" is deprecated. Now it's included in "fixes"

### 4.2.0

* Included the command line interface (and deprecate stylecow-cli package)
* Separate the parser in an external package: [stylecow-parser](https://github.com/stylecow/stylecow-parser)

## 5.0.0

* Removed `--input`, `--output`, `--code` and `--map` configuration
* Simplified api. The command `stylecow execute` is now simply `stylecow`
* On create new configuration file with `stylecow init`, all plugins are selected by default
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
	]
}
```

## 6.0.0

* New version of stylecow-parser (2.0) with a lot of fixes and speed improvements

### 6.1.0

* New plugin "custom-media"

### 6.2.0

* New plugin "custom-selector"

### 6.3.0

* Added an update notifier

### 6.4.0

* New plugin "calc"

### 6.5.0

* New plugin "extend"
* Performance improved

### 6.6.0

* Catch and display the errors in the console and browser (on live-reload)
* Implemented [browserslist](https://github.com/ai/browserslist) to define the browser support using its API

### 6.6.1

* Updated to stylecow-parser 2.6.x
* Improved performance on execute plugins

### 6.7.0

* stylecow-parser dependency was renamed to stylecow-core. All related task functions was moved to the core, so this package contains only the command line interface and the core and plugins as dependencies.
* Removed utils for plugins to make them more independent.
* Improved performance on execute plugins
* Improved error message when no config file has found.