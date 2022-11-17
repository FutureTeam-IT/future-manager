import { ActivityType, IntentsBitField } from 'discord.js';

import { Client } from './client/Client';

import { AnnounceCommand } from './commands/Announce';
import { InfoCommand } from './commands/Info';
import { ServerCommand } from './commands/Server';
import TellCommand from './commands/Tell';

import { GuildMemberAddEvent } from './events/GuildMemberAdd';
import { MessageCreateEvent } from './events/MessageCreate';
import { ReadyEvent } from './events/Ready';
import { VoiceStateUpdateEvent } from './events/VoiceStateUpdate';
import { TicketMenu } from './menus/Ticket';

const main = async () => {
  const intents = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ];

  const client = new Client({
    path: 'application.copy.conf',
    intents,
    presence: {
      status: 'dnd',
      activities: [{ name: 'mc.futurecraft.it', type: ActivityType.Playing }],
    },
  });

  const CommandManager = client.managers.command;
  CommandManager.add(new InfoCommand());
  CommandManager.add(new ServerCommand());
  CommandManager.add(new TellCommand());
  CommandManager.add(new AnnounceCommand());

  const ContextMenuManager = client.managers.contextMenu;
  ContextMenuManager.add(new TicketMenu());

  client.listen('ready', new ReadyEvent());
  client.listen('guildMemberAdd', new GuildMemberAddEvent());
  client.listen('messageCreate', new MessageCreateEvent());
  client.listen('voiceStateUpdate', new VoiceStateUpdateEvent());

  await client.start();
};

main();
