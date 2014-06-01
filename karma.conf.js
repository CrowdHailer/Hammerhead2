module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/hammerjs/hammer.js',
      'bower_components/cumin/dist/cumin.js',
      'bower_components/SoVeryGroovy/dist/SoVeryGroovy.js',
      'src/prefix.js',
      'src/viewbox.js',
      'src/agile.js',
      'src/controller.js',
      'spec/viewbox_spec.js',
      // 'spec/agile_spec.js',
      // 'spec/tower_spec.js',
      // 'spec/controller_spec.js'
    ],
    exclude: [
      'bower_components/hammer.fakemultitouch.js',
      'bower_components/hammer.showtouches.js'
    ],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: true
  });
};