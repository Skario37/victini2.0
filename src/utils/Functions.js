const Config = require("../config.json");

// Merge guild settings and user settings
exports.mergeSettings = (guildSettings, userSettings) => {
  let finalSettings = guildSettings;
  
  // if (userSettings.prefix !== "default") finalSettings.userPrefix = userSettings.prefix;
  // finalSettings.userEmbedColor = userSettings.embedColor
  // if (guildSettings.languageForced != "true" && userSettings.language != "default") finalSettings.language = userSettings.language
  
  return finalSettings;
}

//Get the color of embed checking parameters
exports.getEmbedColor = (settings) => settings.embedColorEnabled ? settings.embedColor : Config.DEFAULTSETTINGS.embedColor;

// Prompt a message
exports.promptMessage = async (message, author, time, reactArray) => {
  for (const reaction of reactArray) await message.react(reaction);

  const filter = (reaction, user) => reactArray.includes(reaction.emoji.name) && user.id === author.id;

  message
    .awaitReactions({filter, max: 1, time: time})
    .then(collected => collected.first() && collected.first().emoji.name);
}

exports.bookingMessage = async (message, author, time, reactArray, events) => {
  for (const reaction of reactArray) await message.react(reaction);

  const authorFilter = (reaction, user) => reactArray.includes(reaction.emoji.name) && user.id === author.id;
  const authorCollector = message.createReactionCollector(authorFilter, {time});

  const intrudersFilter = (reaction) => !reactArray.includes(reaction.emoji.name);
  const intrudersCollector = message.createReactionCollector(intrudersFilter, {time});
  intrudersCollector.on("collect", (reaction) => reaction.remove());
  
  const removedFilter = (reaction) => reactArray.includes(reaction.emoji.name);
  const removedCollector = message.createReactionCollector(removedFilter, {time, "dispose": true});
  removedCollector.on("remove", (reaction) => message.react(reaction.emoji.name));

  for (const event in events) {
    authorCollector.on(event, events[event]);
  }
}

/**
 * Timer function
 * @param {*} ms 
 * @returns Promise
 */
exports.timer = ms => new Promise(res => setTimeout(res, ms));

exports.isUpperCase = (str) => str === str.toUpperCase();
exports.isLowerCase = (str) => str === str.toLowerCase();
exports.isFirstCapitalization  = (str) => str[0] === str[0].toUpperCase();
exports.isLastCapitalization = (str) => str[str.length-1] === str[str.length-1].toUpperCase();
exports.capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);