// module.exports = require("@inpyjamas/scripts/dist/config/husky");
// TODO: This is only here to avoid the default run with build because of a bug in nexus whil building
module.exports = {
  hooks: {
    "pre-commit": "npm -s run generate && npm -s run build && lint-staged",
  },
};
