import "reflect-metadata";
import { ActivityType, IntentsBitField } from "discord.js";

import { Client } from "./client/Client";

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

  await client.start();
};

// main();
