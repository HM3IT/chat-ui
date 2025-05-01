import axios from 'axios';
import { env } from '$env/dynamic/public';
import type { Analyst, Requester, userRole } from '$lib/types/user';
import type { RequesterType } from '$lib/types/request';
import axiosInstance from './axiosInstance';

export const login = async (email: string, password: string, type: userRole) => {
	return axios.post<
		undefined,
		{
			data: {
				access_token: string;
				refresh_token: string;
				roles: userRole[];
				first_name: string;
				last_name: string;
				email: string;
				id: string;
				organization: string;
				phone_number: string;
				fax_number: string;
				street_address: string;
				street_address_2: string;
				state: string;
				zip_code: string;
				country: string;
				city: string;
				type: RequesterType;
			};
		}
	>(`${env.PUBLIC_API_URL}/v1/auth/tokens`, {
		email,
		password,
		type
	});
};

export const refreshToken = async (refreshToken: string, type: userRole) => {
	return await axios.post(`${env.PUBLIC_API_URL}/v1/auth/tokens/refresh`, {
		refresh_token: refreshToken,
		type: type
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requesterSignup = async (data: any) => {
	return (await axios.post(`${env.PUBLIC_API_URL}/v1/requesters/signup`, data)).data;
};

export const getUser = async () => {
	return await axiosInstance.get<Requester | Analyst>('/v1/users/me');
};
