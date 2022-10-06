interface IApplication {
	id: string;
	token: string;
}

interface IGuild {
	id: string;
	welcome: string
}

interface IConfiguration {
	application: IApplication;
	guild: IGuild;
}

export { IConfiguration };
