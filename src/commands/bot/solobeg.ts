import { GuildMember, VoiceChannel } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import * as _ from "lodash";
import { findBegChannel, performBeg } from "../../helpers";

export default class InfoCommand extends Command {
  begging = false;

  constructor(bot: CommandoClient) {
    super(bot, {
      name: "beg",
      group: "bot",
      memberName: "beg",
      description: "Give someone a quick beg",
      args: [
        { key: "victim", prompt: "Who would you like to beg?", type: "member" },
        { key: "turbo", prompt: "Enable turbo mode?", type: "boolean", default: false },
      ],
    });
  }

  async run(msg: CommandoMessage, args) {
    const victim = <GuildMember>args.victim;
    const currentChannel = victim.voice.channelID;

    if (!currentChannel) {
      return await msg.channel.send("User is not in voice channel");
    }

    if (this.begging) {
      return await msg.channel.send("A beg is already in progress");
    }

    this.begging = true;

    const status = await msg.channel.send("Begging... ");
    const begChannel = findBegChannel(victim);
    try {
      await victim.voice.setChannel(begChannel);
      await performBeg(this.client, begChannel);
      await victim.voice.setChannel(currentChannel).catch();
    } catch {}

    this.begging = false;
    return status.edit(status.content + " done");
  }
}
