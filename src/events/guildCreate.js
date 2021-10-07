const { guildExists, insertGuild } = require("../utils/database/Guild");
const { insertLinkGuildUser } = require("../utils/database/Query");
const { insertUser } = require("../utils/database/User");

module.exports = async (client, guild) => {
  if (await guildExists(client, guild.id)) {
    // alter deleted then update linkguilduser
  } else {
    await insertGuild(client, guild);
    const members = guild.members.fetch().then(members => members).catch(e => undefined);
    if (members) {
      for (let member of members) {
        await insertUser(client, member.user);
        insertLinkGuildUser(client, guild.id, member.user.id);
      }
    }
  }
}