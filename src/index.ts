import { ActivityType, IntentsBitField } from "discord.js";

import { Client } from "./client/Client";
import InfoCommand from "./commands/Info";
import ServerCommand from "./commands/Server";
import { GuildMemberAddEvent } from "./events/GuildMemberAdd";
import { MessageCreateEvent } from "./events/MessageCreate";
import { ReadyEvent } from "./events/Ready";

const main = async () => {
  const intents = [IntentsBitField.Flags.Guilds];

  const client = new Client({
    path: "application.conf",
    intents,
    presence: {
      status: "dnd",
      activities: [{ name: "mc.futurecraft.it", type: ActivityType.Playing }],
    },
  });

  client.managers.command.add(new InfoCommand());
  client.managers.command.add(new ServerCommand());

  client.listen('ready', new ReadyEvent());
  client.listen('ready', new GuildMemberAddEvent());
  client.listen('ready', new MessageCreateEvent());

  await client.start();
};

main();
