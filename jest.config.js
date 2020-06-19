/* eslint-disable @typescript-eslint/no-var-requires */
const config = require("@inpyjamas/scripts/dist/config/jest/typescript");
const { merge } = require("@inpyjamas/scripts/dist/utlities/merge");
module.exports = merge(config, {
  collectCoverageFrom: ["src/**/*.{ts}", "!src/test/**/*"],
});
