import { VoiceState, Awaitable, ChannelType } from 'discord.js';
import { Client } from '../client/Client';
import { IConfiguration } from '../models/Configuration';
import { IListener } from '../models/Listener';

class VoiceStateUpdateEvent implements IListener<'voiceStateUpdate'> {
  once: boolean = false;

  async on(
    client: Client<IConfiguration, true>,
    oldState: VoiceState,
    newState: VoiceState,
  ): Promise<void> {
    if (newState.channelId === client.config.guild.channels.voice.channel) {
      this.createNewChannel(client, newState);
      return;
    }

    if (
      oldState.channel &&
      oldState.channel.parentId === client.config.guild.channels.voice.category
    ) {
      this.removeChannel(client, oldState);
      return;
    }
  }

  async removeChannel(
    client: Client<IConfiguration, true>,
    { channel }: VoiceState,
  ) {
    if (!channel) return;

    if (channel.members.size === 0) {
      setTimeout(async () => {
        if (channel.members.size === 0) {
          await channel.delete();
        }
      }, 2 * 60e3);
    }
  }

  async createNewChannel(
    client: Client<IConfiguration, true>,
    { member, guild }: VoiceState,
  ) {
    const category = await guild.channels.fetch(
      client.config.guild.channels.voice.category,
    );

    if (!member) return;

    const newChannel = await guild.channels.create({
      name: member.displayName,
      parent: category?.id,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        { id: member.id, allow: ['Connect', 'ManageRoles'] },
      ],
    });

    await member.voice.setChannel(newChannel);
  }
}

export { VoiceStateUpdateEvent }
