const { getGuildsIds, getUsersIds, insertGuild, insertLinkGuildUser } = require("./Query");
const { insertUser } = require("./User");
const Config = require("./../../config.json");

exports.checkGuilds = async (client) => {
  const ids = await getGuildsIds(client).rows;

  client.guilds.fetch()
    .then((guilds) => {
      for (let guild of guilds) {
        if (!ids.includes(guild.id)) {
          await this.insertGuild(client, guild);
        }
        const users = await this.checkGuildMembers(client, guild);
        this.insertLinkGuildUsers(client, guild, users)
      }
    });
}

exports.checkGuildMembers = async (client, guild) => {
  const ids = await getUsersIds(client).rows;
  return guild.members.fetch()
    .then((members) => {
      for (let member of members) {
        if (!ids.includes(member.id)) {
          await insertUser(client, member);
        }
      }
      return members;
    });
}

exports.insertGuild = async (client, guild, conf) => {
  if (conf) guild.conf = conf;
  else if (!guild.conf) guild.conf = Config.DEFAULTSETTINGS;
  return insertGuild(client, guild);
}

exports.insertLinkGuildUsers = async (client, guild, users) => {
  for (let user of users) {
    insertLinkGuildUser(client, guild.id, user.id);
  }
}