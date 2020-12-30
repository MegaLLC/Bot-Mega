require("dotenv").config();
import { CommandoClient, SQLiteProvider } from "discord.js-commando";
var { token } = require("../config.json");
import path from "path";

var client: CommandoClient = new CommandoClient({
  commandPrefix: "`",
  owner: "319254648722685952",
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  if (message.mentions.users.has(client.user.id)) {
    setTimeout(() => message.channel.send(`<@${message.author.id}> the hell you say to me?`), 400);
  }
});

client.registry
  .registerGroups([["bot", "Meta"]])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"))
  .registerTypesIn(path.join(__dirname, "types"));
client.login(process.env.TOKEN).catch(console.log);
