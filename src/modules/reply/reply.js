const replyConfig = require("./config.json");
const Config = require("../../config.json");
const isUpperCase = require("../../utils/Functions").isUpperCase;
const isFirstCapitalization = require("../../utils/Functions").isFirstCapitalization;
const capitalizeFirstLetter = require("../../utils/Functions").capitalizeFirstLetter;

let onMessage = null;

const reply = (client, message) => {
  if (this.conf.unsubscribed) return;
  if (message.author.bot) return;
  if (message.content === "") return;

  const settings = Config.DEFAULTSETTINGS;

  /**
   * Starting copy past from initial message event
   */
  // Good prefix good tricks
  let prefix = undefined;
  if (message.content.startsWith(settings.prefix)) prefix = settings.prefix;
  else if (message.content.startsWith(Config.DEFAULTSETTINGS.prefix)) prefix = Config.DEFAULTSETTINGS.prefix;
  if (prefix) return;

  // Separate args and command name
  const args = message.content.split(/ +/);

  /**
   * End copy past
   */
  let reply = undefined;

  const first = (args.length > 1 ? args.pop() : args.shift());

  const pokemonFromLanguage = replyConfig.POKEMON[settings.language].filter(pokemon => pokemon.startsWith(first.toLowerCase()));

  if (pokemonFromLanguage.length === 1) {
    reply = pokemonFromLanguage[0];
  } else if (pokemonFromLanguage.length > 1) {
    reply = pokemonFromLanguage[Math.floor(Math.random()*pokemonFromLanguage.length)];
  } else {
    const allPokemonObject = Object.fromEntries(Object.entries(replyConfig.POKEMON).filter(([k, v]) => k !== settings.language));
    let allPokemon = [];
    for (const key in allPokemonObject) {
      allPokemon.push(...allPokemonObject[key]);
    }
  
    allPokemon = allPokemon.filter(pokemon => pokemon.startsWith(first.toLowerCase()));

    if (allPokemon.length === 1) {
      reply = allPokemon[0];
    } else if (allPokemon.length > 1) {
      reply = allPokemon[Math.floor(Math.random()*allPokemon.length)];
    }
  }

  if (!reply) return;

  if (first.toLowerCase() !== reply) {
    reply = reply.replace(first.toLowerCase(), "");
  }

  // detect case
  if (isUpperCase(first)) reply = reply.toUpperCase();
  else if (isFirstCapitalization(first)) reply = capitalizeFirstLetter(reply);

  reply += "!";

  message.lineReplyNoMention(reply);
}

exports.init = (client) => {
  this.conf.unsubscribed = false;
  onMessage = reply.bind(null, client);
  client.on("message", onMessage);
}

exports.commands = []

exports.conf = {
  name: "reply",
  enabled: true,
  unsubscribed: false
}

exports.unsubscribe = (client) => {
  this.conf.unsubscribed = true;
  client.off("message", onMessage);
}