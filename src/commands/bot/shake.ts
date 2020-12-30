import { GuildMember, VoiceChannel } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import * as _ from "lodash";

module.exports = class InfoCommand extends (
  Command
) {
  constructor(bot: CommandoClient) {
    super(bot, {
      name: "shake",
      group: "bot",
      memberName: "info",
      description: "Give a yute a shakedown",
      args: [
        { key: "victim", prompt: "Who would you like to shake?", type: "member" },
        {
          key: "type",
          prompt: "What type of shaking? (random, linear, binary)",
          type: "string",
          default: "randomtype",
        },
      ],
    });
  }

  async run(msg: CommandoMessage, args) {
    const victim = <GuildMember>args.victim;
    const type = <string>args.type;
    const amount = <number>args.amount;
    const last = victim.voice.channelID;

    // if (amount > 20) {
    //   return await msg.channel.send("That's too much shaking :grimacing:");
    // }

    // if (type == "random") {
    //   let done = false;
    //   setTimeout(() => (done = true), amount * 1000);

    //   let voiceChannelIDs: string[] = [];
    //   this.client.guilds.get("587775608659116053")?.channels.forEach((c) => {
    //     if (c.type == "voice") {
    //       voiceChannelIDs.push(c.id);
    //     }
    //   });

    //   while (!done) {
    //     await new Promise((r) => setTimeout(r, 500));
    //     await victim.setVoiceChannel(_.sample(voiceChannelIDs)!);
    //   }
    // }
    await victim.voice.setChannel("727974476016517150");
    await victim.voice.setChannel("753297221486903316");
    await victim.voice.setChannel("587775609086804039");
    await victim.voice.setChannel("731274423080058942");
    await victim.voice.setChannel("731274483842809924");
    await victim.voice.setChannel("587777702438895637");
    await victim.voice.setChannel("587777765202329610");
    await victim.voice.setChannel("587778273644249109");
    await victim.voice.setChannel("710373921668595752");
    await victim.voice.setChannel(last);
    return msg.channel.send("Okay");
  }
};
