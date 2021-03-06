/* eslint-disable @typescript-eslint/no-var-requires */
const config = require("@inpyjamas/scripts/dist/config/jest/typescript");
const { merge } = require("@inpyjamas/scripts/dist/utlities/merge");
module.exports = merge(config, {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: { warnOnly: true },
    },
  },
  setupFilesAfterEnv: ["./jest.setup.js"],

  testEnvironment: "./api/tests/nexus-test-environment.js",
  collectCoverageFrom: ["src/**/*.{ts}", "!src/test/**/*"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
});
