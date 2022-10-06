import { Interaction, CacheType, ButtonInteraction } from 'discord.js';
import { IConfiguration } from '../models/Configuration';
import { Listener } from '../models/Listener';
import { Client } from './Client';

class TickerManager implements Listener<'interactionCreate'> {
  readonly once: boolean = false;

  constructor(private readonly client: Client<IConfiguration, true>) {}

  inTicketChannel(interaction: ButtonInteraction<'cached'>) {
    return (
      interaction.channel &&
      (interaction.channelId === this.client.config.ticket.channel ||
        interaction.channel.name.match(/^ticket-[0-9]+$/))
    );
  }

  isOpenRequest(interaction: ButtonInteraction<'cached'>) {
    return interaction.customId === 'ticket:open';
  }

  async on(_, interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isButton() || !interaction.inCachedGuild()) {
      return;
    }

    if (!this.inTicketChannel(interaction)) {
      return;
    }

    if (this.isOpenRequest(interaction)) {
      return this.open(interaction);
    }
  }

  async open(interaction: ButtonInteraction<'cached'>) {
    const { user, guild } = interaction;

    const channel = await guild.channels.create({
      name: `ticket-${1}`,
      parent: this.client.config.ticket.category,
      permissionOverwrites: [{ id: user.id, allow: ['ViewChannel'] }],
    });
  }
}

export { TickerManager };
