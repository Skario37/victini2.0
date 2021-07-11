const error = require("../utils/Logger").error;

module.exports = (client, err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
};