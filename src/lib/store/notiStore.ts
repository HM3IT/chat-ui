import type { addNotification } from 'svelte-notifications';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set } = writable<addNotification | null>(null);

	return {
		subscribe,
		setNoti: (noti: addNotification) => {
			set(noti);
		}
	};
}

export const noti = createStore();
