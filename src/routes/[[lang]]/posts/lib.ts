export type Metadata = {
	title: string;
	description: string;
	date: Date;
	image: string;
	imageAlt: string;
	published: boolean;
};

export type MdPost = Metadata & {
	slug: string;
};
