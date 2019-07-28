// Karma configuration
// Generated on Wed Jan 02 2019 11:25:26 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'lib/dojo.js',
      'lib/jquery-1.10.2.js',      
      'bootstrap-tests.js',
      { pattern: 'shared/components/**/.*js', watched: true },
      { pattern: 'shared/specs/**/.*js', watched: true },
      { pattern: 'examples/graphics/app/**/.*js', watched: true },
      { pattern: 'examples/graphics/specs/**/.*js', watched: true },
      { pattern: 'examples/layers/app/**/.*js', watched: true },
      { pattern: 'examples/layers/specs/**/.*js', watched: true },
      { pattern: 'examples/popups/app/**/.*js', watched: true },
      { pattern: 'examples/popups/specs/**/.*js', watched: true },
      { pattern: 'examples/queries/app/**/.*js', watched: true },
      { pattern: 'examples/queries/specs/**/.*js', watched: true }
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    exclude: [
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher'
    ]
  })
}
