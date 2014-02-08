var path = require('path');
var fs = require('fs');
var rmrf = require('rmrf');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var express = require('express');
var Moonboots = require('moonboots');
var config = require('getconfig');
var templatizer = require('templatizer');
var less = require('less');
var async = require('async');
var app = express();

// a little helper for fixing paths for various enviroments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

// -----------------
// Configure express
// -----------------
app.use(express.compress());
app.use(express.static(fixPath('public')));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.set('view engine', 'jade');


// ---------------------------------------------------
// Configure Moonboots to serve our client application
// ---------------------------------------------------
var clientApp = new Moonboots({
    jsFileName: 'tweet-your-bracket',
    cssFileName: 'tweet-your-bracket',
    main: fixPath('clientapp/app.js'),
    developmentMode: config.isDev,
    libraries: [
        fixPath('node_modules/jquery/dist/jquery.js'),
        // Bootstrap modules
        fixPath('clientapp/libraries/bootstrap/transition.js'),
        fixPath('clientapp/libraries/bootstrap/alert.js'),
        fixPath('clientapp/libraries/bootstrap/button.js'),
        fixPath('clientapp/libraries/bootstrap/collapse.js'),
        fixPath('clientapp/libraries/bootstrap/dropdown.js'),
        fixPath('clientapp/libraries/bootstrap/modal.js'),
        fixPath('clientapp/libraries/bootstrap/tooltip.js')
    ],
    stylesheets: [
        fixPath('styles/app.css')
    ],
    browserify: {
        debug: false
    },
    server: app,
    beforeBuildJS: function () {
        templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'));
    },
    beforeBuildCSS: function (cb) {
        var lessDir = path.resolve(__dirname, 'styles'),
            cssOutputDir = lessDir,
            lessFiles = ['app'];

        async.each(lessFiles, function (filename, _cb) {
            var lessPath = path.resolve(lessDir, filename + '.less');
            var cssPath = path.resolve(cssOutputDir, filename + '.css');
            var lessString = fs.readFileSync(lessPath, 'utf8');

            var parser = new less.Parser({
                relativeUrls: true,
                paths: [lessDir],
                outputDir: cssOutputDir,
                optimization: 1,
                filename: filename + '.less'
            });

            parser.parse(lessString, function (err, cssTree) {
                if (err) return _cb(less.formatError(err));
                fs.writeFileSync(cssPath, cssTree.toCSS(), 'utf8');
                _cb();
            });
        }, cb);
    }
});


// Build to deploy dir
if (process.argv.join(' ').indexOf(' --build') > -1) {
    var deployDir = fixPath('_deploy');
    rmrf(deployDir);
    mkdirp(deployDir);
    
    clientApp.config.developmentMode = false;
    clientApp.build(deployDir, function () {
        exec('cp -r public/* ' + deployDir);
        process.exit(0);
    });
}

// use a cookie to send config items to client
var clientSettingsMiddleware = function (req, res, next) {
    res.cookie('config', JSON.stringify(config.client));
    next();
};

// configure our main route that will serve our moonboots app
app.get('*', clientSettingsMiddleware, clientApp.html());

// listen for incoming http requests on the port as specified in our config
app.listen(config.http.port);
console.log("Tweet Your Bracket is running at: http://localhost:" + config.http.port + " Yep. That\'s pretty awesome.");
