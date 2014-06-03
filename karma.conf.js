module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/zepto/zepto.js',
      'bower_components/hammerjs/hammer.js',
      'bower_components/cumin/dist/cumin.js',
      'bower_components/belfry/dist/belfry.js',
      'bower_components/SoVeryGroovy/dist/SoVeryGroovy.js',
      'src/prefix.js',
      'src/viewbox.js',
      'src/agile.js',
      'src/overflow.js',
      'src/touch.js',
      'src/positionhandler.js',
      'src/mousewheel.js',
      'src/init.js',
      'spec/prefix_spec.js',
      'spec/viewbox_spec.js',
      'spec/agile_spec.js',
      'spec/overflow_spec.js',
      'spec/touch_spec.js',
      'spec/positionhandler_spec.js',
      'spec/mousewheel_spec.js',
      'spec/init_spec.js',
    ],
    exclude: [
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