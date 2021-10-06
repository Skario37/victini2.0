const { insertUser } = require("./Query");
const Config = require("./../../config.json");


exports.insertUser = async (client, user, conf) => {
  if (conf) user.conf = conf;
  else if (!guild.conf) user.conf = Config.USERDEFAULTSETTINGS;

  return insertUser(client, user);
}