// Copyright (C) 2022 Guglietti Daniele
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
  SlashCommandBuilder,
} from 'discord.js';
import { Client } from '../client/Client';
import { ICommand } from '../models/Command';
import { IConfiguration } from '../models/Configuration';

class TellCommand implements ICommand {
  name = 'tell';
  async execute(
    client: Client<IConfiguration, true>,
    ctx: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    const message = ctx.options.getString('messaggio', true);
    const channel = ctx.options.getChannel('canale') as GuildTextBasedChannel;

    await (channel ? channel.send(message) : ctx.channel?.send(message));
    await ctx.reply({
      ephemeral: true,
      content: 'Il messaggion è stato inviato con successo.',
    });
  }

  builder(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription('Invia un messaggio testuale tramite il bot.')
      .setDefaultMemberPermissions('0')
      .addStringOption((opt) =>
        opt
          .setName('messaggio')
          .setDescription('Il messaggio da inviare.')
          .setRequired(true),
      )
      .addChannelOption((opt) =>
        opt
          .setName('canale')
          .setDescription('Il canale in cui inviare il messaggio.')
          .addChannelTypes(ChannelType.GuildText),
      ) as SlashCommandBuilder;
  }
}

export default TellCommand;
