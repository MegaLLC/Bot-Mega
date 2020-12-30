require("dotenv").config();
import { VoiceChannel } from "discord.js";
import { CommandoClient } from "discord.js-commando";
import path from "path";

var client: CommandoClient = new CommandoClient({
  commandPrefix: "`",
  owner: "319254648722685952",
});
client.setMaxListeners(9000);

client.on("ready", async () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  (<VoiceChannel>await client.channels.fetch("753297221486903316")).join();
});

client.on("message", async (message) => {
  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  if (message.mentions.users.has(client.user!.id)) {
    setTimeout(() => message.channel.send(`<@${message.author.id}> the hell you say to me?`), 400);
  }
});

client.registry
  .registerGroups([["bot", "Default"]])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"))
  .registerTypesIn(path.join(__dirname, "types"));
client.login(process.env.TOKEN).catch(console.log);
