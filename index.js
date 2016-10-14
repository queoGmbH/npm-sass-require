"use strict";

var path = require('path')
var fs = require('fs')
var resolve = require('resolve-pkg')

module.exports = function(url, prev, cb) {
    if( !fs.existsSync(prev) ) {
        cb({file:url});
        return;
    }

    var resolver = function(url, basePath, cb) {
        var parts = url.split('/');
        var res = resolve(parts.shift(), {cwd: basePath})
        if(res === null) {
            throw new Error("module not found")
        }
        res += path.sep + parts.join(path.sep)
        cb({file: res})
    }
    var currentDir = path.dirname(prev);

    if( url.indexOf('node_modules') >= 0 ) {
        url = '~/'+url.substr(url.indexOf('node_modules')+('node_modules/'.length))
    }
    if( url.indexOf('~/') == 0 ) {
        return resolver(url.substr(2), currentDir, cb)
    }
    cb({file:url});
}
