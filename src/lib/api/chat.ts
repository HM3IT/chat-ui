import type { Chunk } from '$lib/types/chat.ts';
import { PUBLIC_CHAT_API_URL } from '$env/static/public';
 

export const getChats = async (sessionId: string): Promise<Chunk[]> => {
	let response = await fetch(`${PUBLIC_CHAT_API_URL}/api/chats/${sessionId}`);
	const data = await response.json();
	return data as Chunk[];
};

export const queryChat = async (sessionId: string, query: string): Promise<Response> => {
	return await fetch(`${PUBLIC_CHAT_API_URL}/api/chats/${sessionId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ message: query })
	});
};

export const authenticate = async (
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
