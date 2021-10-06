const { insertLinkGuildUser } = require("../utils/database/guild");
const { userExists, insertUser } = require("../utils/database/User")

module.exports = async (client, member) => {
  if (await userExists(client, member.user.id)?.row.length > 0) {
    // Alter if deleted
  } else {
    await insertUser(client, member.user);
  }
  insertLinkGuildUser(client, member.guild, member.user);
}