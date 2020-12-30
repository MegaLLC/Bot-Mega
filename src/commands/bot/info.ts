import { GuildMember } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

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
        {
          key: "victim",
          prompt: "Who would you like to shake",
          type: "member",
        },
      ],
    });
  }

  async run(msg: CommandMessage, args) {
    const victim = <GuildMember>args.victim;
    const last = victim.voiceChannelID;
    await victim.setVoiceChannel("727974476016517150");
    await victim.setVoiceChannel("753297221486903316");
    await victim.setVoiceChannel("587775609086804039");
    await victim.setVoiceChannel("731274423080058942");
    await victim.setVoiceChannel("731274483842809924");
    await victim.setVoiceChannel("587777702438895637");
    await victim.setVoiceChannel("587777765202329610");
    await victim.setVoiceChannel("587778273644249109");
    await victim.setVoiceChannel("710373921668595752");
    await victim.setVoiceChannel(last);
    return msg.channel.send("Okay");
  }
};
