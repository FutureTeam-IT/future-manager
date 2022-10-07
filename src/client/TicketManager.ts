import {
  Interaction,
  CacheType,
  ButtonInteraction,
  User,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ChannelType,
} from 'discord.js';
import { IConfiguration } from '../models/Configuration';
import { IListener } from '../models/Listener';
import { Client } from './Client';

class TicketManager implements IListener<'interactionCreate'> {
  static readonly NEW_TICKET_EMBED = new EmbedBuilder()
    .setTitle('Ticket Aperto')
    .setDescription(
      'In questo canale potrai ricevere supporto dallo staff.\nUna volta terminato il supporto, premi il pulsante per chiudere il ticket.',
    )
    .setColor(0xda70d6);

  static readonly CONFIRM_CLOSE_EMBED = new EmbedBuilder()
    .setTitle('Sei sicuro?')
    .setDescription(
      "Sei sicuro di voler chiudere il ticket?\nQuest'azione non è reversibile.",
    )
    .setColor(0xda70d6);

  static readonly CLOSE_BUTTON =
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket:close')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🔐')
        .setLabel('Chiudi'),
    );

  static readonly CONFIRM_BUTTONS =
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket:confirm')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✔️')
        .setLabel('Conferma'),
      new ButtonBuilder()
        .setCustomId('ticket:cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
        .setLabel('Annulla'),
    );

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

  async hasOpenTicket(user: User) {
    return (
      (await this.client.database.ticket.count({
        where: {
          author_id: user.id,
          AND: { closed_at: null },
        },
      })) !== 0
    );
  }

  async open(interaction: ButtonInteraction<'cached'>) {
    const { user, guild } = interaction;

    if (await this.hasOpenTicket(user)) {
      await interaction.reply({
        ephemeral: true,
        content: 'Hai già un ticket aperto!',
      });
      return;
    }

    const ticket = await this.client.database.ticket.create({
      data: { author_id: user.id },
    });

    const channel = await guild.channels.create({
      name: `ticket-${ticket.id}`,
      parent: this.client.config.ticket.category,
      permissionOverwrites: [{ id: user.id, allow: ['ViewChannel'] }],
      type: ChannelType.GuildText,
    });

    const messages = channel.createMessageCollector({
      filter: (m) => !m.author.bot,
    });

    messages.on('collect', (message) => {
      this.client.database.ticketMessage.create({
        data: {
          author_id: message.author.id,
          text: message.content,
          ticket_id: ticket.id,
        },
      });
    });

    const message = await channel.send({
      embeds: [TicketManager.NEW_TICKET_EMBED],
      components: [TicketManager.CLOSE_BUTTON],
    });

    const closeRequests = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => i.customId === 'ticket:close',
    });

    closeRequests.on('collect', async (btn) => {
      const confirm = await btn.reply({
        ephemeral: true,
        embeds: [TicketManager.CONFIRM_CLOSE_EMBED],
        components: [TicketManager.CONFIRM_BUTTONS],
      });

      try {
        const reply = await confirm.awaitMessageComponent({
          componentType: ComponentType.Button,
          time: 60e3,
        });

        if (reply.customId === 'ticket:confirm') {
          await this.client.database.ticket.update({
            data: { closed_at: new Date() },
            where: { id: parseInt(channel.name.substring(0, 7)) },
          });

          await channel.delete();
          return;
        }
        await btn.deleteReply();
      } catch {
        await btn.deleteReply();
      }
    });
  }
}

export { TicketManager as TickerManager };
