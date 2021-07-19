const { i18n } = require("../../utils/i18n");

exports.run = (client, message, args, settings) => {
  if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) {
    return message.lineReplyNoMention(i18n("NEED_MANAGE_NICKNAMES_PERMISSION", settings.language))
      .then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
  } else if (!message.guild.me.hasPermission("CHANGE_NICKNAME")) {
    return message.lineReplyNoMention(i18n("NEED_CHANGE_NICKNAME_PERMISSION", settings.language))
      .then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
  }

  let member = message.guild.member(message.mentions.members.first());

  if (member) {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
      return message.lineReplyNoMention(i18n("YOU_NEED_MANAGE_NICKNAMES_PERMISSION", settings.language))
      .then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
    } else if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) { // author compare to mention, if author < mention
      return message.lineReplyNoMention(i18n("NICKNAME_ROLE_LOWER", settings.language))
      .then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
    }

    args.shift();

  } else if (!message.member.hasPermission("CHANGE_NICKNAME")) {
    return message.lineReplyNoMention(i18n("YOU_NEED_CHANGE_NICKNAME_PERMISSION", settings.language))
      .then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
  } else {
    member = message.member;
  }
  

  member.setNickname(args.join(" "))
  .then(() => {
    message.lineReplyNoMention(i18n("NICKNAME_SUCCESS", settings.language)
        .replace("{{variable}}", member.user.username)
      ).then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
  }).catch((e) => {
    if (e.code === 50013) { // MISSING_PERMISSIONS
      message.lineReplyNoMention(i18n("NICKNAME_MISSING_PERMISSIONS", settings.language)
        .replace("{{variable}}", member.user.username)
      ).then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
      });
    } else if (e.code === 50035) { // INVALID_FORM_BODY
      message.lineReplyNoMention(i18n("NICKNAME_INVALID", settings.language))
      .then(msg => {
        message.delete({"timeout": 10000}).catch(e => {});
        msg.delete({"timeout": 10000}).catch(e => {});
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