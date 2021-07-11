const error = require("../utils/Logger").error;

module.exports = (client, err) => {
  error(`Unhandled rejection: ${err}`);
};
