const { insertUser } = require("./Query");
const Config = require("./../../config.json");


exports.insertUser = async (client, user, conf) => {
  if (conf) user.conf = conf;
  else if (!user.conf) {
    user.conf = Config.USERDEFAULTSETTINGS;
  }
  return insertUser(client, user);
}

exports.userExists = async (client, userId) => {
  if (await getUserId(client, userId)?.row.length > 0) return true;
  else return false;
}