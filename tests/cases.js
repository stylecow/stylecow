var assert   = require('assert'),
    stylecow = require('stylecow-core'),
    plugins  = require('stylecow-plugins'),
    test     = new stylecow.Test(__dirname + '/cases'),
    tasks    = (new stylecow.Tasks())
                    .use(plugins())
                    .minSupport({
                        "explorer": 0,
                        "firefox": 0,
                        "chrome": 0,
                        "safari": 0,
                        "opera": 0,
                        "android": 0,
                        "ios": 0
                    });

test.run(function (test) {
    tasks.run(test.css);

    describe('cases/' + test.name, function() {
        it('should match output.css', function() {
            //test.writeString()
            test.assertString();
        });

        it('should match ast.json', function() {
            //test.writeAst()
            test.assertAst();
        });
    });
});
