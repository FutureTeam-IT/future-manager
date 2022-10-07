import {
  GuildMember,
  Awaitable,
  bold,
  channelMention,
  userMention,
  inlineCode,
  TextChannel,
} from 'discord.js';
import { Client } from '../client/Client';
import { IConfiguration } from '../models/Configuration';
import { IListener } from '../models/Listener';

class GuildMemberAddEvent implements IListener<'guildMemberAdd'> {
  once: boolean = false;
  async on(
    client: Client<IConfiguration, true>,
    member: GuildMember,
  ): Promise<void> {
    const channel = member.guild.systemChannel;
    if (!channel) return;

    await channel.send(`
**●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●**
   Benvenuto ${bold(userMention(member.id))} in ${bold('FutureCraft')}!
   Assicurati di leggere le regole in ${channelMention(
     member.guild.rulesChannelId ?? '',
   )} 
   Per qualsiasi notizia circa il network le trovi in ${channelMention(
     client.config.guild.channels.announcements,
   )}
   Se hai bisogno di assistenza apri un ticket in ${channelMention(
     client.config.ticket.channel,
   )}
   Utilizza il comando ${inlineCode('/server')} per avere informazioni sul server.
**●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●**
		`);
  }
}

export { GuildMemberAddEvent }
