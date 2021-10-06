/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/
const { getCommandPerm } = require("../../utils/PermLevel");
const { i18n } = require("../../utils/i18n");
const { MessageEmbed } = require("discord.js");
const { getEmbedColor, bookingMessage } = require("../../utils/Functions");
const Emoji = require("../../pictogram/emoji.json");

exports.run = (client, message, args, settings) => {
  // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
  const commands = message.guild 
    ? client.commands.filter(command => message.author.permLevel >= getCommandPerm(command.conf.permLevel)) 
    : client.commands.filter(command => message.author.permLevel >= getCommandPerm(command.conf.permLevel) && !command.conf.guildOnly)

  // Get all different categories to create "pages"
  const categories = [];
  commands.forEach(v => {
    const category = v.help(settings.language).category;
    if (!categories.includes(category)) categories.push(category);
  });

  // Set bounds to book
  const pageMin = categories.length ? 1 : 0;
  const pageMax = categories.length;
  let currentPage = pageMin;

  // Start creating book
  const book = [];
  const fieldLimit = 25; // limited to 25 fields
  for (const category of categories) {
    const pageCommands = [];
    commands.filter(command => command.help(settings.language).category === category).forEach(v => pageCommands.push(v));

    let page = 1;
    const pages = Math.ceil(pageCommands.length / fieldLimit);
    while (pageCommands.length) {
      book.push({
        "name": category,
        "commands": pageCommands.splice(0, fieldLimit), 
        page,
        pages,
      });
      page++;
    }
  }

  // Creating message
  const embed = new MessageEmbed();
  embed.setColor(getEmbedColor(settings));

  // No page so no command
  if (book.length === 0) {
    embed.setTitle(i18n("HELP_NO_TITLE", settings.language));
    embed.setDescription(i18n("HELP_NO_DESCRIPTION", settings.language));
    embed.setFooter(i18n("HELP_FOOTER", settings.language).replace("{{variable}}", currentPage));
    return message.channel.send({embeds:[embed]}).then(msg => setTimeout(() => msg.delete(), 10000).catch(e => {}));
  // Equals or more than one page; let's read!
  } else if (book.length >= 1) {
    const setBookPage = (embed, book, currentPage) => {
      embed.setTitle(
        i18n("HELP_TITLE", settings.language)
          .replace("{{variable}}", book[currentPage-1].name)
      );
      embed.setDescription(`${book[currentPage-1].name} ${book[currentPage-1].page}/${book[currentPage-1].pages}`);
      embed.fields = [];
      for (const command of book[currentPage-1].commands) {
        embed.addField(
          `${command.conf.name}\n${command.conf.aliases}`, 
          `${command.help(settings.language).description}\n\`${settings.prefix}${command.help(settings.language).usage}\``, 
          true
        );
      }
      embed.setFooter(i18n("HELP_FOOTER", settings.language).replace("{{variable}}", currentPage));
    }
    
    setBookPage(embed, book, currentPage);

    message.channel.send({embeds:[embed]}).then(msg => {
      const timeout = 5 * 60 * 1000;
      if (book.length === 1) return setTimeout(msg.delete().catch(e => {}), timeout);

      const reactArray = [];

      if (book.length >= 10)  {
        reactArray.push(Emoji.LAST_NEXT.name);
      }
      reactArray.push(Emoji.NEXT.name);
      switch (book.length) {
        default: if (book.length === 1) break;
        case 10: reactArray.push(Emoji.TEN.name);
        case 9: reactArray.push(Emoji.NINE.name);
        case 8: reactArray.push(Emoji.EIGHT.name);
        case 7: reactArray.push(Emoji.SEVEN.name);
        case 6: reactArray.push(Emoji.SIX.name);
        case 5: reactArray.push(Emoji.FIVE.name);
        case 4: reactArray.push(Emoji.FOUR.name);
        case 3: reactArray.push(Emoji.THREE.name);
        case 2: reactArray.push(Emoji.TWO.name);
          reactArray.push(Emoji.ONE.name);
      }
      reactArray.push(Emoji.PREVIOUS.name);
      if (book.length >= 10) {
        reactArray.push(Emoji.LAST_PREVIOUS.name);
      }
      reactArray.reverse();

      const events = {
        "collect": (reaction) => {            
          switch (reaction.emoji.name) {
            case Emoji.LAST_NEXT.name: currentPage = pageMax; break;
            case Emoji.NEXT.name: 
              currentPage = (currentPage === pageMax ? currentPage : currentPage + 1);
            break;
            case Emoji.TEN.name:   currentPage = 10; break;
            case Emoji.NINE.name:  currentPage = 9; break;
            case Emoji.EIGHT.name: currentPage = 8; break;
            case Emoji.SEVEN.name: currentPage = 7; break;
            case Emoji.SIX.name:   currentPage = 6; break;
            case Emoji.FIVE.name:  currentPage = 5; break;
            case Emoji.FOUR.name:  currentPage = 4; break;
            case Emoji.THREE.name: currentPage = 3; break;
            case Emoji.TWO.name:   currentPage = 2; break;
            case Emoji.ONE.name:   currentPage = 1; break;
            case Emoji.PREVIOUS.name: 
              currentPage = (currentPage === pageMin ? currentPage : currentPage - 1);
            break;
            case Emoji.LAST_PREVIOUS.name: currentPage = pageMin; break;
          }
          setBookPage(embed, book, currentPage);
          msg.edit(embed);
        },
        "end": () => msg.delete().catch(e => {})
      }
      bookingMessage(msg, message.author, timeout, reactArray, events)
    });
  } 
};

exports.conf = {
  name: "help",
  permLevel: "User",
  cooldown: 10,
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp", "aide"]
}

exports.help = (language) => { 
  return {
    name: i18n("HELP_HELP_NAME", language),
    category: i18n("HELP_HELP_CATEGORY", language),
    description: i18n("HELP_HELP_DESCRIPTION", language),
    usage: i18n("HELP_HELP_USAGE", language)
  }
}
