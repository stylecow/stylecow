# Changelog

### 7.2.0

* Improved error reporting on watch
* Updated stylecow-core to 2.3.x
* Updated other dependencies

### 7.1.0

* Updated stylecow-core to 2.2.x
* Added glob support. For example:

  ```json
  {
    "files": [{
      "input": "styles/*.css",
      "output": "dist/[name].min.css"
    }]
  }
  ```

  The available replacement cards are `[name]`, `[dir]`, `[ext]` and `[base]`, and the values returned are the same than [path.parse()](https://nodejs.org/api/path.html#path_path_parse_pathstring).
* The `map` config value is global instead specific for each file. For example:
  Before:

  ```json
  {
    "files": [
      {
        "input": "styles/style.css",
        "output": "dist/style.min.css",
        "map": "dist/style.min.map"
      }
    ]
  }

  ```

  Now:

  ```json
  {
    "files": [
      {
        "input": "styles/style.css",
        "output": "dist/style.min.css"
      }
    ],
    "map": "file"
  }
  ```

  The available options are `file` (to generate a file with .map extension), `embed`, `none` and `auto` (by default). The map value for each file was keept for backward compatibility.

### 7.0.0

* Removed support for node 0.x and iojs. This library is for node >= 4.0
* Updated stylecow-core to 2.0.1 (from 1.1.1)
* Updated all plugins to new major version
* Improved cli with colors and other ux changes
* New commands `stylecow run` to execute stylecow in a node module instead a config json file. The module must have the following scheme:

  ```js
  module.exports = function (stylecow) {
    //here your code
  }
  ```

### 6.10.0

* Updated dependencies
* Added support for Microsoft Edge
* Some UX improvements

### 6.9.0

* Added the option `config-json` to provide the configuration directly in the cli, instead a json file. For example:

  ```
  stylecow --config-json '{"files":[{"input":"styles.css","output":"styles.min.css","map":false}],"support":{"explorer":10,"firefox":30,"chrome":35,"safari":6,"opera":22,"android":4,"ios":6},"plugins":["color","custom-media","custom-selector","extend","fixes","flex","import","matches","nested-rules","prefixes","rem","variables"],"code":"normal"}'
  ```

### 6.8.0

* Updated plugin "prefixes" to version 5.0, that use caniuse database
* New plugin "webkit-gradient" to do not mix old webkit syntax fallback with vendor prefixes on standard syntax (done by "prefixes")
* Updated plugin "flex" to version 5.0, that removes the vendor prefixes to standard syntax (this is done by "prefixes")
* Updated stylecow-core dependency, that fixes some issues on task execution

### 6.7.0

* stylecow-parser dependency was renamed to stylecow-core. All related task functions was moved to the core, so this package contains only the command line interface and the core and plugins as dependencies.
* Removed utils for plugins to make them more independent.
* Improved performance on execute plugins
* Improved error message when no config file has found.

### 6.6.1

* Updated to stylecow-parser 2.6.x
* Improved performance on execute plugins

### 6.6.0

* Catch and display the errors in the console and browser (on live-reload)
* Implemented [browserslist](https://github.com/ai/browserslist) to define the browser support using its API

### 6.5.0

* New plugin "extend"
* Performance improved

### 6.4.0

* New plugin "calc"

### 6.3.0

* Added an update notifier

### 6.2.0

* New plugin "custom-selector"

### 6.1.0

* New plugin "custom-media"

### 6.0.0

* New version of stylecow-parser (2.0) with a lot of fixes and speed improvements

### 5.0.0

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

### 4.2.0

* Included the command line interface (and deprecate stylecow-cli package)
* Separate the parser in an external package: [stylecow-parser](https://github.com/stylecow/stylecow-parser)

### 4.1.0
* The plugin "initial" is deprecated. Now it's included in "fixes"

### 4.0.0

* Rewritten the parser to be more consitent
* Changed some API methods to create and traverse through the elements
* The standard plugins are included as dependencies, so they are installed with stylecow

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

### 3.0.0

* The parser has been completely rewriten.
* Performance improved x2
* Support for any type of at-rule
* Better API
* The plugin "linear-gradient" was merged with "prefixes"
