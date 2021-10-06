const Client = require("discord.js").Client;
require('discord-reply');
const Collection = require("discord.js").Collection;
const Loader = require("./utils/Loader");
const { Pool } = require('pg')

/**
 * Main function
 */
(() => {
  // Configure VICTINI as the whole application
  const client = new Client({
    partials: ["USER", "MESSAGE", /*"CHANNEL",*/ "REACTION"],
    ws: { 
      intents: [
        "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", 
        "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", 
        "DIRECT_MESSAGE_TYPING"
      ]
    }
  });
  client.env = process.env.NODE_ENV;

  // Create Discord collections
  client.commands = new Collection();
  client.aliases = new Collection();
  client.cooldowns = new Collection();
  client.modules = new Collection();

  // Load Commands and Events files
  Loader.loadCommands(client);
  Loader.loadEvents(client);

  client.pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  // Log bot into Discord
  client.login(process.env.TOKEN);
})();