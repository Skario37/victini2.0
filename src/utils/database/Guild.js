const { getGuildsIds, getUsersIds, insertGuild, insertLinkGuildUser, getGuildId, getUsersIdsInLinkGuild } = require("./Query");
const { insertUser } = require("./User");
const Config = require("./../../config.json");
const { getGuildById, getUserById } = require("../Guild");

exports.checkGuilds = async (client) => {
  const idsRows = (await getGuildsIds(client))?.rows;
  if (!idsRows) return;
  const ids = idsRows.map(({id}) => id);
  await client.shard.fetchClientValues('guilds.cache')
    .then(async (guilds) => {
      for (let guild of guilds[0]) {
        if (!ids.includes(guild.id)) {
          await this.insertGuild(client, guild);
        }
        const users = await this.checkGuildMembers(client, guild);
        await this.insertLinkGuildUsers(client, guild, users)
      }
    });
}

exports.checkGuildMembers = async (client, g) => {
  const idsRows = (await getUsersIds(client))?.rows;
  if (!idsRows) return;
  const ids = idsRows.map(({id}) => id);
  const guild = await getGuildById(client, g.id);
  if (!guild) return;

  for (let memberId of guild.members) {
    if (!ids.includes(memberId)) {
      const user = await getUserById(client, memberId);
      if (user) await insertUser(client, user);
    }
  }
  return guild.members;
}

exports.insertGuild = async (client, guild, conf) => {
  if (conf) guild.conf = conf;
  else if (!guild.conf) guild.conf = Config.DEFAULTSETTINGS;
  return insertGuild(client, guild);
}

exports.insertLinkGuildUsers = async (client, guild, users) => {
  const idsRows = (await getUsersIdsInLinkGuild(client, guild.id))?.rows;
  if (!idsRows) return;
  const ids = idsRows.map(({user_id}) => user_id);
  
  for (let userId of users) {
    if (!ids.includes(userId)) {
      await insertLinkGuildUser(client, guild.id, userId);
    }
  }
}

exports.insertLinkGuildUser = (client, guild, user) => {
  insertLinkGuildUser(client, guild.id, user);
}

exports.guildExists = async (client, guildId) => {
  if (await getGuildId(client, guildId)?.row.length > 0) return true;
  else return false;
} 