module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          esmodules: true
        },
        modules: false,
        useBuiltIns: "usage",
        corejs: 2
      }
    ],
    "@babel/react",
    "@babel/typescript"
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }], // loose enable for decorators legacy
    "@babel/proposal-object-rest-spread",
    "react-hot-loader/babel",
    [
      "import",
      {
        libraryName: "lodash",
        libraryDirectory: "",
        camel2DashComponentName: false
      }
    ]
  ],
  env: {
    development: {
      presets: [
        [
          "@emotion/babel-preset-css-prop",
          {
            autoLabel: true,
            labelFormat: "[local]"
          }
        ]
      ]
    },
    production: {
      presets: [
        [
          "@emotion/babel-preset-css-prop",
          {
            autoLabel: true,
            labelFormat: "[local]"
          }
        ]
      ]
    },
    test: {
      plugins: [
        [
          require.resolve("babel-plugin-module-resolver"),
          {
            root: ["./src/"],
            alias: {
              "@": "./src"
            }
          }
        ],
        "@babel/plugin-transform-modules-commonjs",
        "dynamic-import-node"
      ]
    }
  }
};
