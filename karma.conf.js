module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/**/*.js',
      'src/prefix.js',
      'src/point.js',
      'src/viewbox.js',
      'src/agile.js',
      // 'src/viewer.js',
      'spec/point_spec.js',
      'spec/viewbox_spec.js',
      'spec/agile_spec.js'
      // 'spec/viewer_spec.js'
    ],
    exclude: [
      // 'bower_components/jasmine-jquery.js',
      // 'bower_components/jasmine-fixture.min.js',
      // 'bower_components/jquery-2.1.0.min.js',
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