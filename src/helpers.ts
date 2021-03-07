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

export async function performBeg(client: CommandoClient, channel: string, turbo = false): Promise<void> {
  const vc = <VoiceChannel>await client.channels.fetch(channel);
  const connection = await vc.join();
  await connection.setSpeaking("SPEAKING");
  if (turbo) {
    await turboBeg(client, connection);
  }
  await new Promise((resolve, _) => {
    connection.play("beg.mp3").on("finish", () => resolve(connection));
  });
  connection.disconnect();
}

async function turboBeg(client: CommandoClient, connection: VoiceConnection): Promise<void> {
  for (let i = 0; i < 5; i++) {
    const p = connection.play("beg.mp3");
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        p.destroy();
        resolve();
      }, 1000);
    });
  }
}
