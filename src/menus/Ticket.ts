import { UserContextMenuCommandInteraction, Awaitable } from 'discord.js';
import { Client } from '../client/Client';
import { IConfiguration } from '../models/Configuration';
import { UserContextMenu } from '../models/ContextMenu';

class TicketMenu extends UserContextMenu {
  constructor() {
    super('Lista Ticket Utente', false);
  }

  async execute(
    client: Client<IConfiguration, true>,
    ctx: UserContextMenuCommandInteraction<'cached'>,
  ): Promise<void> {
    const author_id = ctx.targetId;
    const tickets = await client.database.ticket.findMany({
      where: { author_id },
    });

    if (tickets.length === 0) {
      await ctx.reply({
        ephemeral: true,
        content: "Quest'utente non ha mai aperto un ticket!",
      });
      return;
    }

    const content = `L'utente ha aperto in tutto ${tickets.length} ticket!
${tickets
  .map(
    (ticket) =>
      `→ **Ticket** #${ticket.id} - Aperto il ${this.formatDate(
        ticket.created_at,
      )} - Stato ${ticket.closed_at !== null ? '**CHIUSO**' : '**APERTO**'}`,
  )
  .join('\n')}
`;

    await ctx.reply({
      content,
      ephemeral: true,
    });
  }

  private formatDate(date: Date): string {
    return `**${date.getDay()}/${date.getMonth()}/${date.getFullYear()}** alle **${date.getHours()}:${date.getMinutes()}**`;
  }
}

export { TicketMenu };
