import { escapeMarkdown, Message } from 'discord.js';
import { Client } from '../client/Client';
import { IConfiguration } from '../models/Configuration';
import { IListener } from '../models/Listener';

class MessageCreateEvent implements IListener<'messageCreate'> {
  once: boolean = false;

  static escapeFormat(message: string): string {
    return escapeMarkdown(message).replaceAll(/\\./g, '');
  }

  async on(
    client: Client<IConfiguration, true>,
    message: Message<boolean>,
  ): Promise<void> {
    if (message.channelId !== client.config.guild.channels.couting_game) {
      return;
    }

    const messages = await message.channel.messages.fetch({
      limit: 1,
      before: message.id,
    });

    const previous = messages.at(0);
    if (previous === undefined) {
      return;
    }

    const flatContent = MessageCreateEvent.escapeFormat(message.content);
    const flatPreviousContent = MessageCreateEvent.escapeFormat(
      previous.content,
    );

    if (
      // Number.isNaN(Number.parseInt(flatContent)) ||
      Number.parseInt(flatContent) !==
      Number.parseInt(flatPreviousContent) + 1
    ) {
      await message.delete();
    }
  }
}

export { MessageCreateEvent };
