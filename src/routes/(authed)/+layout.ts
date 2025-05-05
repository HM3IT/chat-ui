import { browser } from '$app/environment';
import { userStore } from '$lib/store/userStore';
import { type User, userRole } from '$lib/types/user';
import { redirect, type Load } from '@sveltejs/kit';
import { getUser } from '$lib/api/auth';

export const load: Load = async ({ depends }) => {
	depends('app:auth');
	if (browser) {
		const token = localStorage.getItem('accessToken');
		// const role = localStorage.getItem('role');
		let response;
		let user: User;
        console.log("TOken ", token)
		if (!token) {
			throw redirect(300, '/signin');
		}

		try {
			response = await getUser();
			const { id, username, email, role } = response.data as User;
			if (role) {
				localStorage.setItem(
					'user',
					JSON.stringify({
						id,
						username,
						email,
						role,
						token
					})
				);
			} else {
				localStorage.setItem(
					'user',
					JSON.stringify({
						id,
						username,
						email,
						token,
						role: userRole.STANDARD_USER
					})
				);
			}
		} catch (err) {
			console.log(err);
		}

		const userData = localStorage.getItem('user');
		if (userData) {
			try {
				user = JSON.parse(userData);
				userStore.updateInfo(user);
			} catch (err) {
				console.log(err);
			}
		}
	}
};
