const { log, warn } = require("./../Logger");
const { i18n } = require("./../i18n");
const Config = require("./../../config.json");

exports.getGuildId = (client, guildId) => {
  return client.pool.query(`SELECT id FROM db_guild WHERE id = ${guildId}`)
  .then(res => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildId"));
    return res;
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildId " + err));
    return err;
  });
}

exports.getGuildsIds = (client) => {
  return client.pool.query("SELECT id FROM db_guild")
    .then(res => {
      log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildsIds"));
      return res;
    })
    .catch(err => {
      warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildsIds " + err));
      return err;
    });
}

exports.getGuildId = (client, userId) => {
  return client.pool.query(`SELECT id FROM db_user WHERE id = ${userId}`)
  .then(res => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildId"));
    return res;
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getGuildId " + err));
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
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getUsersIds " + err));
    return err;
  })
}

exports.getLinksGuildUserIds = (client, guildId, userId) => {
  return client.pool.query(`SELECT guild_id, user_id FROM db_link_guild_user WHERE guild_id = ${guildId} AND user_id = ${userId}`)
  .then(res => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getLinksGuildUserIds"));
    return res;
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getLinksGuildUserIds " + err));
    return err;
  })
}

exports.getUsersIdsInLinkGuild = (client, guildId) => {
  return client.pool.query(`SELECT user_id FROM db_link_guild_user WHERE guild_id = '${guildId}'`)
  .then(res => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getUsersIdsInLinkGuild"));
    return res;
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getUsersIdsInLinkGuild " + err));
    return err;
  })
}

exports.insertGuild = (client, guild) => {
  return client.pool.query(`INSERT INTO db_guild("id", "name", "conf") VALUES('${guild.id}', '${guild.name}', '${JSON.stringify(guild.conf)}')`)
  .then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", `insertGuild(${guild.id}, ${guild.name}, ${guild.conf})`));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "insertGuild " + err));
    return err;
  });
}

exports.insertUser = (client, user) => {
  return client.pool.query(`INSERT INTO db_user("id", "name", "conf") VALUES('${user.id}', '${user.username}', '${JSON.stringify(user.conf)}')`)
  .then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", `insertUser(${user.id}, ${user.username}, ${user.conf})`));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "insertUser " + err));
    return err;
  })
}

exports.insertLinkGuildUser = (client, guildId, userId) => {
  return client.pool.query(`INSERT INTO db_link_guild_user("guild_id", "user_id") VALUES('${guildId}', '${userId}')`)
  .then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", `insertLinkGuildUser(${guildId}, ${userId})`));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "insertLinkGuildUser " + err));
    return err;
  })
}

exports.getWhosThatForm = (client) => {
  return client.pool.query(`
    SELECT D.has_gender_difference, D.name_fr AS species_fr, D.name_en AS species_en, A.name_fr AS form_fr, A.name_en AS form_en, C.*, E.hex AS color
    FROM db_static_form AS A
    INNER JOIN db_static_pokemon AS B ON A.pokemon = B.id
    INNER JOIN db_static_sprite_pokemon AS C ON B.sprite = C.id
    INNER JOIN db_static_pokemon_species AS D ON B.species = D.id
    INNER JOIN db_static_color AS E ON D.color = E.id
  `).then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getWhosThatForm"));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getWhosThatForm " + err));
    return err;
  })
}

exports.getWhosThatPokemon = (client) => {
  return client.pool.query(`
    SELECT A.has_gender_difference, A.name_fr AS species_fr, A.name_en AS species_en, B.*, C.hex AS color
    FROM db_static_pokemon_species AS A
    INNER JOIN db_static_sprite_pokemon AS B ON A.sprite = B.id
    INNER JOIN db_static_color AS C ON A.color = C.id
  `).then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getWhosThatPokemon"));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getWhosThatPokemon " + err));
    return err;
  })
}

exports.getFileSprite = (client, id) => {
  return client.pool.query(`
    SELECT file
    FROM db_static_sprite
    WHERE id = '${id}'
  `).then(() => {
    log(i18n("DB_SUCCESS", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getFileSprite"));
  })
  .catch(err => {
    warn(i18n("DB_ERROR", Config.DEFAULTSETTINGS.language).replace("{{variable}}", "getFileSprite " + err));
    return err;
  })
}