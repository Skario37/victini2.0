const { i18n } = require("../../utils/i18n");
const emojifyText = require("emojify-text");
const Emoji = require("../../pictogram/emoji.json");
const { getRandomInt } = require("../../utils/Math");

exports.run = async (client, message, args, settings) => {
  if (args.length === 0) {
    let text = i18n("ERROR_EMOJIFY_ARGUMENTS", settings.language);
    text += "\n";
    text += i18n("USAGE", settings.language)
      .replace("{{prefix}}", settings.prefix)
      .replace("{{usage}}", this.help(settings.language).usage);

    return message.reply({content: text, allowedMentions: { repliedUser: false}}).then(msg => {
      setTimeout(() => message.delete().catch(e => {}), 10000);
      setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  }

  let emojify = null;
  let background = undefined;
  let foreground = undefined;
  let row = false;
  let flag = false;
  let emojified = "";

  if (args.length > 1) {
    for (let i = args.length-1; i >= 0; i--) {
      if (args[i].startsWith("--background=")) {
        background = args.splice(i,1)[0].split("=")[1];
      } else if (args[i].startsWith("--bg=")) {
        background = args.splice(i,1)[0].split("=")[1];
      } else if (args[i].startsWith("--foreground=")) {
        foreground = args.splice(i,1)[0].split("=")[1];
      } else if (args[i].startsWith("--fg=")) {
        foreground = args.splice(i,1)[0].split("=")[1];
      } else if (args[i] === "--row") {
        args.splice(i,1)[0];
        row = true;
      } else if (args[i] === "--r") {
        args.splice(i,1)[0];
        row = true;
      } else if (args[i] === "--column") {
        args.splice(i,1)[0];
        row = false;
      } else if (args[i] === "--c") {
        args.splice(i,1)[0];
        row = false;
      } else if (args[i] === "--flag") {
        args.splice(i,1)[0];
        flag = true;
      } else if (args[i] === "--f") {
        args.splice(i,1)[0];
        flag = true;
      }
    }
  }

  if (flag) {
    args = args.join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "");
    
    if (!background) {
      background = Emoji.ALL[getRandomInt(0,Emoji.ALL.length)];
    }

    if (!foreground) {
      foreground = Emoji.ALL[getRandomInt(0,Emoji.ALL.length)];
      while(foreground === background) {
        foreground = Emoji.ALL[getRandomInt(0,Emoji.ALL.length)];
      }
    }

    emojify = emojifyText({
      "background": background + " ",
      "foreground": foreground + " ",
      "row": row
    });

    if (row) {
      emojified = emojify(args);
    } else {
      args = args.split(" ");
      for (let i = 0; i < args.length; i++) {
        emojified += emojify(args[i]);
        if (!row && i < args.length) emojified += "\n";
      }
    }
  } else {
    for (let i = 0; i < args.length; i++) {
      const word = args[i].normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
      for (let j = 0; j < word.length; j++) {
        const letter = word[j];
        emojified += Emoji[letter]?.name || " ";
        if (j < word.length - 1) emojified += " ";
      }
      if (i < args.length - 1) emojified += Emoji[" "]?.name || " ";
    }
  }

  message.reply({content: emojified, allowedMentions: { repliedUser: false}}).catch(e => {
    message.reply({
      content: i18n("ERROR_EMOJIFY_TOO_LONG", settings.language), allowedMentions: { repliedUser: false}})
      .then(msg => {
        setTimeout(() => message.delete().catch(e => {}), 10000);
        setTimeout(() => msg.delete().catch(e => {}), 10000);
    });
  });
};

exports.conf = {
  name: "emojify",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: false,
  aliases: []
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_EMOJIFY_NAME", language),
    category: i18n("HELP_EMOJIFY_CATEGORY", language),
    description: i18n("HELP_EMOJIFY_DESCRIPTION", language),
    usage: i18n("HELP_EMOJIFY_USAGE", language)
  }
}