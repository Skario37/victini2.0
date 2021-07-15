exports.getMember = async (message, args) => {
  let member = undefined;
  if (message.channel.type !== "dm") {
    if (args.length) {
      member = message.guild.member(message.mentions.users.first()) // By mention
      
      if (!member) {
        const argId = args[0];
        member = await message.guild.members.fetch(argId).catch(e => undefined) // By ID
      }
      
      if (!member) {
        const arg = args.join(" ");
        const lastIndex = arg.lastIndexOf("#");
        const last = (lastIndex !== -1 ? arg.substr(lastIndex, arg.length) : "");
        const discriminator = last.substring(1);
        const username = arg.replace(last,"");
        let members = await message.guild.members.fetch({"query": username, "limit": 100}); // By username
        if (members.size > 0) {
          if (isNaN(discriminator)) {
            member = members.find(m => m.user.discriminator === discriminator && m.user.username === username);
          } else {
            member = members.find(m => m.user.username === username) || members.values().next().value;
          }
        } else {
          members = await message.guild.members.fetch({"query": arg, "limit": 100}); // By username
          if (members.size > 0) member = members.find(m => m.user.username === username) || members.values().next().value;
        }
      }
    }
  } 
  return member;
}