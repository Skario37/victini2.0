const dotenv = require("dotenv");
dotenv.config();
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/bot.js', { "token": process.env.TOKEN });

manager.on('shardCreate', shard => {});
manager.spawn();