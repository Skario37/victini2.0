const Config = require("../config.json");


/*
PERMISSION LEVEL FUNCTION
*/
exports.getPerm = (message, user, settings) => {
  let permlvl = 0;
  const permOrder = permlevelSettings.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (currentLevel.check(message, user, settings)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
};

exports.getCommandPerm = (name) => {
  const perm = permlevelSettings.filter(p => p.name === name);
  return perm[0] ? perm[0].level : 10;
}

exports.getPermNameByLevel = (level) => {
  return permlevelSettings.find(p => p.level === level).name
}

const permlevelSettings = [
  // This is the lowest permisison level, this is for non-roled users.
  { level: 0,
    name: "User", 
    // Don't bother checking, just return true which allows them to execute any command their
    // level allows them to.
    check: () => true
  },

  // This is your permission level, the staff levels should always be above the rest of the roles.
  { level: 2,
    // This is the name of the role.
    name: "Moderator",
    // The following lines check the guild the message came from for the roles.
    // Then it checks if the member that authored the message has the role.
    // If they do return true, which will allow them to execute the command in question.
    // If they don't then return false, which will prevent them from executing the command.
    check: (message, settings) => {
      try {
        const modRole = message.guild.roles.cache.get(settings.modRoleId);
        if (modRole && message.member.roles.cache.get(modRole.id)) return true;
      } catch (e) {
        return false;
      }
    }
  },

  { level: 3,
    name: "Administrator", 
    check: (message, settings) => {
      try {
        const adminRole = message.guild.roles.cache.get(settings.adminRoleId);
        return (adminRole && message.member.roles.cache.get(adminRole.id));
      } catch (e) {
        return false;
      }
    }
  },
  // This is the server owner.
  { level: 4,
    name: "Server Owner", 
    // Simple check, if the guild owner id matches the message author's Id, then it will return true.
    // Otherwise it will return false.
    check: (message, user) => message.channel.type === "GUILD_TEXT" ? (message.guild.ownerId === user.id ? true : false) : false
  },

  // Bot Support is a special inbetween level that has the equivalent of server owner access
  // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
  { level: 8,
    name: "Bot Support",
    // The check is by reading if an ID is part of this array. Yes, this means you need to
    // change this and reboot the bot to add a support user. Make it better yourself!
    check: (message, user) => Config.SUPPORTS.some(support => support.id === user.id)
  },

  // Bot Admin has some limited access like rebooting the bot or reloading commands.
  { level: 9,
    name: "Bot Admin",
    check: (message, user) => Config.ADMINS.some(admin => admin.id === user.id)
  },

  // This is the bot owner, this should be the highest permission level available.
  // The reason this should be the highest level is because of dangerous commands such as eval
  // or exec (if the owner has that).
  { level: 10,
    name: "Bot Owner", 
    // Another simple check, compares the message author id to the one stored in the config file.
    check: (message, user) => Config.OWNER.id === user.id
  }
];