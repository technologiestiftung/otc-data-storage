// module.exports = require("@inpyjamas/scripts/dist/config/husky");
module.exports = {
  hooks: {
    "pre-commit": "lint-staged",
  },
};
