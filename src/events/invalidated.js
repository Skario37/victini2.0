const error = require("../utils/Logger").error;
module.exports = () => {
  error("/!\\Client invalidated/!\\");
  process.exit(1);
}