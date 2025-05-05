export enum userRole {
	STANDARD_USER = 'STANDARD_USER',
	PRO_USER = 'PRO_USER',
	PREMIUM_USER = 'PREMIUM_USER',
	ADMIN = 'ADMIN'
}



export type User = {
	id: string;
	username: string;
	email: string;
	role: userRole | null;
	token: string;
};

