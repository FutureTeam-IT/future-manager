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
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Client } from '../client/Client';
import { ICommand } from '../models/Command';
import { IConfiguration } from '../models/Configuration';

class AnnounceCommand implements ICommand {
  name = 'annuncio';

  async execute(
    client: Client<IConfiguration, true>,
    ctx: ChatInputCommandInteraction<'cached'>,
  ): Promise<void> {
    const title = ctx.options.getString('titolo', true);
    const description = ctx.options.getString('testo', true);
    const image = ctx.options.getAttachment('immagine');
    const color = ctx.options.getString('colore');

    if (color && !this.isColor(color)) {
      await ctx.reply({
        ephemeral: true,
        content:
          'Il colore inserito non è valido. Usa un colore in formato esadecimale.',
      });

      return;
    }

    if (image && !image.contentType?.startsWith('image/')) {
      await ctx.reply({
        ephemeral: true,
        content: 'Puoi allegare solamente immagini.',
      });

      return;
    }

    const announcement = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description.replaceAll("\\n", "\n"))
      .setAuthor({
        name: ctx.user.username,
        iconURL: ctx.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor(color && this.isColor(color) ? color : '#fff');

    if (image) {
      announcement.setImage(image.url);
    }

    const confirm = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('announce-send')
      .setEmoji('✔️')
      .setLabel('Invia');

    const cancel = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId('announce-cancel')
      .setEmoji('❌')
      .setLabel('Annulla');

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirm,
      cancel,
    );

    const message = await ctx.reply({
      ephemeral: true,
      content: 'Vuoi inviare il seguente annuncio?',
      embeds: [announcement],
      components: [row],
    });

    message
      .awaitMessageComponent({
        filter: (i) => i.user.id === ctx.user.id,
        componentType: ComponentType.Button,
        time: 30_000,
      })
      .then(async (action) => {
        if (action.customId === 'announce-send') {
          const channel = (await action.guild.channels.fetch(
            client.config.guild.channels.announcements,
          )) as TextChannel;

          if (!channel) {
            await ctx.editReply({
              content:
                'Impossibile trovare il canale degli annunci! Controlla le impostazioni.',
              embeds: [],
              components: [],
            });

            return;
          }

          await channel.send({ embeds: [announcement] });
          await ctx.editReply({
            content: 'Annuncio inviato.',
            embeds: [],
            components: [],
          });

          return;
        }

        if (action.customId === 'announce-cancel') {
          await ctx.editReply({
            content: 'Annuncio anullato.',
            embeds: [],
            components: [],
          });
        }
      })
      .catch(async (_) => {
        await ctx.editReply({
          content: 'Annuncio anullato.',
          embeds: [],
          components: [],
        });
      });
  }

  isColor(color: string): color is `#${string}` {
    return /^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/g.test(color);
  }

  builder(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription('Invia un messaggio nel canale degli annuncio.')
      .setDefaultMemberPermissions('0')
      .addStringOption((opt) =>
        opt
          .setName('titolo')
          .setDescription("Il titolo dell'annuncio.")
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt
          .setName('testo')
          .setDescription("Il testo dell'annuncio.")
          .setRequired(true),
      )
      .addAttachmentOption((opt) =>
        opt
          .setName('immagine')
          .setDescription("Link per l'immagine dell'annuncio."),
      )
      .addStringOption((opt) =>
        opt.setName('colore').setDescription("Il colore dell'annuncio."),
      ) as SlashCommandBuilder;
  }
}

export { AnnounceCommand };
