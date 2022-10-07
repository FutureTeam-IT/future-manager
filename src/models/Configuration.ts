interface IApplication {
  id: string;
  token: string;
}

interface IGuild {
  id: string;
  channels: {
    announcements: string;
    couting_game: string;
    voice: {
      channel: string;
      category: string;
    }
  };
}

interface ITicket {
  channel: string;
  category: string;
}

interface IServer {
  ip: string;
  port: number;
}

interface IConfiguration {
  application: IApplication;
  guild: IGuild;
  ticket: ITicket;
  server: {
    java: IServer;
    bedrock: IServer;
  };
}

export { IConfiguration };
