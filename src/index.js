const Client = require("discord.js").Client;
const Collection = require("discord.js").Collection;
const dotenv = require("dotenv");
const Loader = require("./utils/Loader");
dotenv.config();

/**
 * Main function
 */
(() => {
  // Configure VICTINI as the whole application
  const client = new Client();
  client.env = process.env.NODE_ENV;

  // Create Discord collections
  client.commands = new Collection();
  client.aliases = new Collection();
  client.cooldowns = new Collection();
  client.modules = new Collection();

  // Load Commands and Events files
  Loader.loadCommands(client);
  Loader.loadEvents(client);
  Loader.loadModules(client);

  // Log bot into Discord
  client.login(process.env.TOKEN);
})();