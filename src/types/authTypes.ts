import { atom } from "jotai";

export type AdminAuth = {
	email: string;
	username: string;
	token: string;
};

export const authenticatedAtom = atom<AdminAuth | null>(null);
