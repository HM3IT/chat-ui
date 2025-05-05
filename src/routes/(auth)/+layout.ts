import { browser } from '$app/environment';
import { redirect, type Load } from '@sveltejs/kit';

export const load: Load = ({ depends }) => {
	depends('app:auth');
	if (browser) {
		const token = localStorage.getItem('accessToken');
		if (token) {
			throw redirect(300, '/signin');
		}
	}
};
