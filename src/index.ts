import { ActivityType, IntentsBitField } from "discord.js";

import { Client } from "./client/Client";
import InfoCommand from "./commands/Info";
import ServerCommand from "./commands/Server";

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

  await client.start();
};

main();
