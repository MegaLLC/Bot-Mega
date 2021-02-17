import { ChannelResolvable, GuildMember, VoiceChannel, VoiceConnection } from "discord.js";
import { CommandoClient } from "discord.js-commando";

export function findBegChannel(victim: GuildMember): string {
  const vcMap = (x) => x.id;

  // find suitable channel
  const vcVoiceFilter = (channel) => channel.type === "voice";
  const voiceChannels = victim.guild.channels.cache.filter(vcVoiceFilter);

  // filter for beg channel
  const vcNameFilter = (channel) => channel.name.includes("beg");
  const begChannels = voiceChannels.filter(vcNameFilter).map(vcMap);

  // sort for channel with least people
  const vcConnectedSort = (a, b) => b.members.size - a.members.size;
  const emptyChannels = voiceChannels.sort(vcConnectedSort).map(vcMap);

  return begChannels.length == 0 ? emptyChannels.pop() : begChannels.pop();
}

export function performBeg(client: CommandoClient, channel: string): Promise<void> {
  return client.channels
    .fetch(channel)
    .then((channel: VoiceChannel) => {
      return channel.join();
    })
    .then((connection: VoiceConnection) => {
      return new Promise((resolve, _) => {
        connection.play("beg.mp3").on("finish", () => resolve(connection));
      });
    })
    .then((connection: VoiceConnection) => {
      connection.disconnect();
    });
}
