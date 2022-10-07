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

import axios from 'axios';
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Client } from '../client/Client';
import { ICommand } from '../models/Command';
import { IConfiguration } from '../models/Configuration';

interface PingResponse {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
}

class ServerCommand implements ICommand {
  name = 'server';

  async execute(
    client: Client<IConfiguration, true>,
    ctx: CommandInteraction<'cached'>,
  ) {
    const { data } = await axios.get<PingResponse>(
      `https://eu.mc-api.net/v3/server/ping/${client.config.server.java.ip}`,
    );

    const embed = new EmbedBuilder()
      .setTitle('FutureCraft | Server')
      .setDescription('Qui trovi le informazioni generali sul server.')
      .setThumbnail(client.user.defaultAvatarURL)
      .setColor("#6cdae7")
      .addFields(
        { name: 'Piattaforma', value: 'Java', inline: true },
        {
          name: 'IP',
          value: client.config.server.java.ip,
          inline: true,
        },
        {
          name: 'Porta',
          value: `${client.config.server.java.port}`,
          inline: true,
        },
      )
      .addFields(
        { name: 'Piattaforma', value: 'Bedrock', inline: true },
        {
          name: 'IP',
          value: client.config.server.bedrock.ip,
          inline: true,
        },
        {
          name: 'Porta',
          value: `${client.config.server.bedrock.port}`,
          inline: true,
        },
      )
      .addFields({
        name: 'Stato',
        value: data.online ? 'Online' : 'Offline',
        inline: true,
      })
      .addFields({
        name: 'Giocatori Online',
        value: `${data.players.online}/${data.players.max}`,
        inline: true,
      });

    await ctx.reply({
      embeds: [embed],
    });
  }

  builder(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription('Invia informazioni sul server Minecraft.');
  }
}

export { ServerCommand };
