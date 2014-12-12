var stylecow = require(__dirname + '/../lib');

var code = stylecow.Reader.readFile('test.css');
var css = new stylecow.Root();

css.parse(code);

console.log(css.toString());