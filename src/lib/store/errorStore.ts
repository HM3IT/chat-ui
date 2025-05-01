import { writable } from 'svelte/store';

function createStore() {
	const { set, subscribe } = writable(false);

	return {
		subscribe,
		showError: () => set(true),
		hideError: () => set(false)
	};
}

export const errorStore = createStore();
