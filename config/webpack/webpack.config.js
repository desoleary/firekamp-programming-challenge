// See the shakacode/shakapacker README and docs directory for advice on customizing your webpackConfig.

const { webpackConfig, merge } = require("shakapacker");
const ForkTSCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = merge(webpackConfig, {
    plugins: [new ForkTSCheckerWebpackPlugin()],
});
