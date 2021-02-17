import { GuildMember } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import * as _ from "lodash";

const API_MAX = 10;
const DELAY = 80;

export default class InfoCommand extends Command {
  // manually keep track of api limit
  apiLimit = API_MAX;

  constructor(bot: CommandoClient) {
    super(bot, {
      name: "shake",
      group: "bot",
      memberName: "info",
      description: "Shake a user between channels",
      args: [
        { key: "victim", prompt: "Who would you like to shake?", type: "member" },
        {
          key: "type",
          prompt: "What type of shaking? (linear, random, binary)",
          type: "string",
          default: "linear",
        },
      ],
    });

    // manually keep track of api limit
    setInterval(() => {
      if (this.apiLimit < API_MAX) this.apiLimit += 1;
    }, 1000);
  }

  async run(msg: CommandoMessage, args) {
    const victim = <GuildMember>args.victim;
    const waitTime = API_MAX - this.apiLimit;

    if (!victim.voice.channelID) {
      return await msg.channel.send("User is not in voice channel");
    }

    if (waitTime) {
      const p1 = "I am too tired to shake right now.";
      const p2 = `I will be ready in ${waitTime} second${waitTime == 1 ? "" : "s"}.`;
      return await msg.channel.send(p1 + "\n" + p2);
    }

    if (args.type != "binary" && args.type != "linear" && args.type != "random") {
      return await msg.channel.send("Invalid type of shaking, it must be `binary`, `linear` or `random`");
    }

    const status = await msg.channel.send("Shaking... ");
    this.apiLimit -= 10;

    const vcFilter = (channel) => channel.type === "voice";
    const vcSort = (a, b) => a.rawPosition - b.rawPosition;
    const vcMap = (a) => a.id;
    const channels = victim.guild.channels.cache.filter(vcFilter).sort(vcSort).map(vcMap);
    const CIDLen = channels.length;
    const currentIDIdx = channels.indexOf(victim.voice.channelID);

    // random shake (move to random channel)
    if (args.type === "random") {
      let current = currentIDIdx;
      for (let i = 0; i < API_MAX - 1; i++) {
        // move user forward some distance at least 1
        current += _.random(1, CIDLen - 1);
        current %= CIDLen;
        await victim.voice.setChannel(channels[current]);
        await new Promise((r) => setTimeout(r, DELAY));
      }

      // linear shake (go through channels in order)
    } else if (args.type === "linear") {
      let distance = 0;
      for (let i = (currentIDIdx + 1) % CIDLen; i != currentIDIdx; i = (i + 1) % CIDLen) {
        await victim.voice.setChannel(channels[i]);
        await new Promise((r) => setTimeout(r, DELAY));
        distance++;
        if (distance >= API_MAX - 1) break;
      }
      // binary shake (between 2 channels)
    } else if (args.type === "binary") {
      await victim.voice.setChannel(channels[(currentIDIdx + 1) % CIDLen]);
      for (let i = 0; i < (API_MAX - 2) / 2; i++) {
        await victim.voice.setChannel(channels[currentIDIdx]);
        await new Promise((r) => setTimeout(r, DELAY));
        await victim.voice.setChannel(channels[(currentIDIdx + 1) % CIDLen]);
        await new Promise((r) => setTimeout(r, DELAY));
      }
    }

    // restore user to original channel
    await victim.voice.setChannel(channels[currentIDIdx]);
    return status.edit(status.content + " done");
  }
}
