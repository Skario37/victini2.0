const { i18n } = require("../../utils/i18n");

exports.run = (client, message, args, settings) => {
  if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
    return message.reply({content: i18n("NEED_MANAGE_NICKNAMES_PERMISSION", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
  } else if (!message.guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {
    return message.reply({content: i18n("NEED_CHANGE_NICKNAME_PERMISSION", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
  }

  let member = message.guild.member.cache.get(message.mentions.members.first());

  if (member) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
      return message.reply({content: i18n("YOU_NEED_MANAGE_NICKNAMES_PERMISSION", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
    } else if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) { // author compare to mention, if author < mention
      return message.reply({content: i18n("NICKNAME_ROLE_LOWER", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
    }

    args.shift();

  } else if (!message.member.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {
    return message.reply({content: i18n("YOU_NEED_CHANGE_NICKNAME_PERMISSION", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
  } else {
    member = message.member;
  }
  

  member.setNickname(args.join(" "))
  .then(() => {
    message.reply({content: i18n("NICKNAME_SUCCESS", settings.language)
        .replace("{{variable}}", member.user.username), allowedMentions: { repliedUser: false}
      }).then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
  }).catch((e) => {
    if (e.code === 50013) { // MISSING_PERMISSIONS
      message.reply({content: i18n("NICKNAME_MISSING_PERMISSIONS", settings.language)
        .replace("{{variable}}", member.user.username), allowedMentions: { repliedUser: false}
      }).then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
    } else if (e.code === 50035) { // INVALID_FORM_BODY
      message.reply({content: i18n("NICKNAME_INVALID", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
      });
    }
  });
}

exports.conf = {
  name: "nickname",
  permLevel: "User",
  cooldown: 30,
  enabled: true,
  guildOnly: true,
  aliases: ["nick", "pseudo"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_NICK_NAME", language),
    category: i18n("HELP_NICK_CATEGORY", language),
    description: i18n("HELP_NICK_DESCRIPTION", language),
    usage: i18n("HELP_NICK_USAGE", language)
  }
}