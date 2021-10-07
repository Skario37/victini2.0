const i18n = require("../utils/i18n").i18n;
const getPerm = require("../utils/PermLevel").getPerm;
const getCommandPerm = require("../utils/PermLevel").getCommandPerm;
const getPermNameByLevel = require("../utils/PermLevel").getPermNameByLevel;
const cmd = require("../utils/Logger").cmd;
const Config = require("../config.json");
const Collection = require("discord.js").Collection;

//const { mergeSettings } = require('../utils/functions')

module.exports = async (client, message) => {
  // No bot please
  if (message.author.bot) return

  // Get guild settings and|or [merge] with user settings
  // const settings = mergeSettings(
  //   await client.database.getGuildConf(message.guild),
  //   await client.database.getUserConf(message.author),
  // )
  const settings = Config.DEFAULTSETTINGS;

  // Good prefix good tricks
  let prefix;
  if (message.content.startsWith(settings.prefix)) prefix = settings.prefix;
  else if (message.content.startsWith(Config.DEFAULTSETTINGS.prefix)) prefix = Config.DEFAULTSETTINGS.prefix;
  else return; 

  // Separate args and command name
  const args = message.content.slice(prefix.length).split(/ +/);
  message.commandName = args.shift().toLowerCase();

  // Check wheter the command, or alias, exist in the collections
  const command = client.commands.get(message.commandName) || client.commands.get(client.aliases.get(message.commandName))
  if (!command) {
    return message.reply({content: i18n("UNKNOWN_COMMAND", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
  }

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (!message.guild && command.help.guildOnly) {
    return message.reply({content:i18n("UNAVAILABLE_COMMAND", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
  }

  // Author's level is now put on level (not member so it is supported in DMs)
  message.author.permLevel = getPerm(message, message.author, settings);
  // Check for authorized command
  if (message.author.permLevel < getCommandPerm(command.conf.permLevel)) {
    if (settings.systemNotice === "true") {
      return message.reply({
        content: i18n("PERM_NOTICE", settings.language)
          .replace("{{permName}}", getPermNameByLevel(message.author.permLevel))
          .replace("{{commandPermName}}", command.conf.permLevel), allowedMentions: { repliedUser: false}
      }).then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
    } else {
      return message.reply({content: i18n("UNAUTHORIZED_COMMAND", settings.language), allowedMentions: { repliedUser: false}})
        .then(msg => {
          setTimeout(() => message.delete().catch(e => {}), 10000);
          setTimeout(() => msg.delete().catch(e => {}), 10000);
        });
    }
  }

  // Command cooldowns
  if (command.conf.cooldown > 0) {
    if (!client.cooldowns.has(command.conf.name)) {
      client.cooldowns.set(command.conf.name, new Collection());
    }
  
    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.conf.name);
    const cdAmount = command.conf.cooldown * 1000;
    
    if (tStamps.has(message.author.id)) {
      const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

      if (timeNow < cdExpirationTime) {
        timeLeft = cdExpirationTime - timeNow;
        return message.reply({
          content: i18n("COOLDOWN_COMMAND", settings.language)
            .replace("{{variable}}", Math.floor(timeLeft / 1000)), allowedMentions: { repliedUser: false}
        }).then(msg => {
          setTimeout(() => {
            message.delete().catch(e => {})
            msg.delete().catch(e => {});
          }, timeLeft);
        });
      }
    }

    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);
  }

  // Finallyyy
  cmd(`[CMD] ${message.author.permLevel} ${message.author.username} (${message.author.id}) ran command ${command.conf.name}`);
  command.run(client, message, args, settings);
}