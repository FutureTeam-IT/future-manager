import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { Client } from '../client/Client';
import { IConfiguration } from '../models/Configuration';
import { IListener } from '../models/Listener';

class ReadyEvent implements IListener<'ready'> {
  once: boolean = true;

  async on(client: Client<IConfiguration, true>): Promise<void> {
    const guild = await client.guilds.fetch(client.config.guild.id);
    const channel = await guild.channels.fetch(client.config.ticket.channel);

    if (channel && channel.isTextBased()) {
      const messages = await channel.messages.fetch({
        cache: true,
        limit: 1,
      });

      if (messages.size === 0) {
        const embed = new EmbedBuilder()
          .setTitle('Richiesta Supporto')
          .setDescription(
            'Hai bisogno di assistenza?\nDevi fare qualche segnalazione?\nApri un ticket per parlare con lo staff.',
          )
          .setColor(0xda70d6)
          .setThumbnail(client.user.defaultAvatarURL);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket:open')
            .setLabel('Apri Ticket')
            .setStyle(ButtonStyle.Primary),
        );

        await channel.send({
          embeds: [embed],
          components: [row],
        });
      }
    }
  }
}

export { ReadyEvent }
