module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      files: [
        { pattern: 'src/test.ts', watched: false }
      ],
      preprocessors: {
        'src/test.ts': ['@angular-devkit/build-angular']
      },
      browsers: ['ChromeHeadless'],
      mime: {
        'text/javascript': ['js', 'mjs']
      },
      singleRun: false,
      restartOnFileChange: true
    });
  };
  