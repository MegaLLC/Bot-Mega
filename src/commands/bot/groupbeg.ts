import { GuildChannel, GuildMember, VoiceChannel } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import * as _ from "lodash";
import { findBegChannel, performBeg } from "../../helpers";

export default class InfoCommand extends Command {
  begging = false;

  constructor(bot: CommandoClient) {
    super(bot, {
      name: "groupbeg",
      group: "bot",
      memberName: "groupbeg",
      description: "Make everyone perform a quick beg",
    });
  }

  async run(msg: CommandoMessage) {
    let beggers = new Map<GuildMember, GuildChannel>();

    msg.guild.channels.cache.forEach((channel) => {
      if (channel.type == "voice") {
        channel.members.forEach((member) => {
          beggers.set(member, channel);
        });
      }
    });

    if (beggers!.size == 0) {
      return await msg.channel.send("No users in voice channels");
    }

    if (this.begging) {
      return await msg.channel.send("A group beg is already in progress");
    }

    const begChannel = findBegChannel(beggers.keys().next().value);

    this.begging = true;
    const status = await msg.channel.send("Group begging... ");

    // move to begging channel
    for (const member of beggers.keys()) {
      await member.voice.setChannel(begChannel).catch();
    }

    await performBeg(this.client, begChannel);

    // move back
    for (const pair of beggers.entries()) {
      await pair[0].voice.setChannel(pair[1]).catch();
    }

    this.begging = false;
    return status.edit(status.content + " done");
  }
}
