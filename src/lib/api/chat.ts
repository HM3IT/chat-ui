import type { Message, Chat } from '$lib/types/chat.ts';
import { PUBLIC_CHAT_API_URL } from '$env/static/public';

import axiosInstance from './axiosInstance';

export const getChatMessages = async (usersId: string, sessionId: string): Promise<Message[]> => {
	return (await axiosInstance.get<Message[]>(`/api/chats/${usersId}/channels/${sessionId}/list`))
		.data as Message[];
};

export const getChatDetail = async (usersId: string, sessionId: string): Promise<Chat> => {
	return (await axiosInstance.get<Chat>(`/api/chats/${usersId}/channels/${sessionId}`))
		.data as Chat;
};

export const listChats = async (userId: string) => {
	return (await axiosInstance.get(`/api/chats/${userId}`)).data as Chat[];
};

export const deleteChat = async (userId: string, chatId: string) => {
	return (
		await axiosInstance.post<{ chat_id: string }>(`/api/chats/${userId}/channels/${chatId}/delete`)
	).data;
};

export const authenticateChat = async (
	authUrl: string,
	email: string,
	password: string
): Promise<Response> => {
	return await fetch(authUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: email, password })
	});
};

export const streamChat = async (
	userId: string,
	sessionId: string,
	query: string
): Promise<Response> => {
	return await fetch(`${PUBLIC_CHAT_API_URL}/api/chats/channels/${sessionId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ message: query, user_id: userId })
	});
};

export const generateChatTitle = async (sessionId: string, userId: string) => {
	return (await axiosInstance.get(`/api/chats/${userId}/channels/title/${sessionId}`)).data;
};
