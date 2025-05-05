import type { User } from '$lib/types/user';
import { writable, get } from 'svelte/store';

function createStore() {
	const { set, subscribe } = writable<User>({
		username: '',
		email: '',
		role: null,
		token: '',
		id: '',
	});

	return {
		subscribe,
		updateInfo: (info: User) => set(info),
		updateToken: (token: string) => set({ ...get(userStore), token })
	};
}

export const userStore = createStore();
