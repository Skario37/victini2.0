const { log, warn } = require("./../Logger");
const { i18n } = require("./../i18n");
const Config = require("./../../config.json");

exports.getGuildsIds = (client) => {
  return client.pool.query("SELECT id FROM db_guild")
    .then(res => {
      log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildsIds"));
      return res;
    })
    .catch(err => {
      warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", err));
      return err;
    });
}

exports.getUsersIds = (client) => {
  return client.pool.query("SELECT id FROM db_user")
  .then(res => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getUsersIds"));
    return res;
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", err));
    return err;
  })
}

exports.getLinksGuildUserIds = (client, guildId, userId) => {
  return client.pool.query(`SELECT user_id FROM db_user WHERE guild_id = ${guildId} AND user_id = ${userId}`)
  .then(res => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getLinksGuildUserIds"));
    return res;
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", err));
    return err;
  })
}

exports.insertGuild = (client, guild) => {
  return client.pool.query(`INSERT INTO db_guild(id, name, conf) VALUES(${guild.id}, ${guild.name}, ${guild.conf})`)
  .then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", `insertGuild(${guild.id}, ${guild.name}, ${guild.conf})`));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", err));
    return err;
  });
}

exports.insertUser = (client, user) => {
  return client.pool.query(`INSERT INTO db_user(id, name, conf) VALUES(${user.id}, ${user.username}, ${user.conf})`)
  .then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", `insertUser(${guild.id}, ${guild.name}, ${guild.conf})`));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", err));
    return err;
  })
}

exports.insertLinkGuildUser = (client, guildId, userId) => {
  return client.pool.query(`INSERT INTO db_user(guild_id, user_id) VALUES(${guildId}, ${userId})`)
  .then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", `insertLinkGuildUser(${guildId}, ${userId})`));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", err));
    return err;
  })
}