var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'server',
    paths: {
    }
});

requirejs('main');
