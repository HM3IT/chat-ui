import { writable } from 'svelte/store';

export const authFormStateStore = writable<null | {
	url: string;
    show: boolean;
}>(null);
