module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/cumin.min.js',
      'dist/math.min.js',
      'dist/compositions.min.js',
      'spec/setup.js',
      'spec/cumin_spec.js',
      'spec/object_spec.js',
      'spec/function_spec.js',
      'spec/utilities_spec.js',
      'spec/math_spec.js',
      'spec/compositions_spec.js'
    ],
    exclude: [
    ],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: true
  });
};