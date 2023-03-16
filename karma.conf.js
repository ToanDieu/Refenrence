/* eslint import/no-extraneous-dependencies: off */
const puppeteer = require("puppeteer");
const webpackConfig = require("./webpack.config.js");

process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function karmaConfig(config) {
  config.set({
    basePath: "",
    browsers: ["ChromeHeadless"], // headless browser
    frameworks: ["mocha"], // javascript test framework
    files: ["tests/test_index.js"],
    preprocessors: {
      "tests/*.js": ["webpack"] // use webpack transpiler from react -> ES5 for test runner
    },
    webpack: webpackConfig,
    // webpackServer: {
    //   noInfo: true
    // },
    reporters: ["nyan"], // test reporter, test result -> friendly way to view
    nyanReporter: {
      // config reporter
      suppressErrorHighlighting: true
    },

    /* karma server config */
    port: 9898,
    colors: true,
    logLevel: config.LOG_INFO
    // autoWatch: true,
    // singleRun: false,
  });
};
