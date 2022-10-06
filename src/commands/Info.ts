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
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Client } from '../client/Client';
import { ICommand } from '../models/Command';
import { IConfiguration } from '../models/Configuration';

class InfoCommand implements ICommand {
  name = 'info';

  async execute(
    client: Client<IConfiguration, true>,
    ctx: CommandInteraction<'cached'>,
  ) {
    const embed = new EmbedBuilder()
      .setTitle('Iglesias Manager')
      .setDescription(
        'Iglesias Manager è il bot ufficiale del server discord di IglesiasCraft.',
      )
      .setThumbnail(client.user.displayAvatarURL())
      .addFields([
        { name: 'Versione', value: '1.0.0', inline: true },
        { name: 'Developer', value: 'zL1ghT_', inline: true },
      ])
      .setColor('#6cdae7');

    await ctx.reply({
      embeds: [embed],
      ephemeral: false,
    });
  }

  builder(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription('Invia informazioni sul bot.');
  }
}

export default InfoCommand;
