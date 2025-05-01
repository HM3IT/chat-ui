import { env } from '$env/dynamic/public';
import axios from 'axios';
import { refreshToken } from './auth';
import { userRole } from '$lib/types/user';
import { logout } from '$lib/utils';
import { userStore } from '$lib/store/userStore';

const axiosInstance = axios.create({
	baseURL: env.PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		Accept: 'application/json'
	}
});

const authService = {
	refreshToken: async () => {
		try {
			const token = localStorage.getItem('refreshToken');
			let requesterType = localStorage.getItem('role');
			if (!token || !requesterType) return false;
			requesterType =
				requesterType === userRole.DIRECTOR || requesterType === userRole.ADMIN
					? userRole.ANALYST
					: requesterType;
			const response = await refreshToken(token, requesterType as userRole);
			const { access_token } = response.data;

			localStorage.setItem('accessToken', access_token);
			userStore.updateToken(access_token);

			return true;
		} catch (error) {
			return false;
		}
	}
};

// request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// TODO
		if (error.response === undefined) {
			originalRequest._retry = true;
			const isRefreshSuccessful = await authService.refreshToken();
			if (isRefreshSuccessful) {
				originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
				return axios(originalRequest);
			} else {
				logout();
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
