import type { Message, MessageBlock, ChatGroup } from '$lib/types/chat.ts';

import { invalidate } from '$app/navigation'; 

function getUTCDate(date: string) {
	const localDate = new Date(date);
	const utcDate = Date.UTC(
		localDate.getFullYear(),
		localDate.getMonth(),
		localDate.getDate(),
		localDate.getHours(),
		localDate.getMinutes(),
		localDate.getSeconds()
	);
	return new Date(utcDate);
}


export function formatDatetime(date: string) {
	return getUTCDate(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}
export function formatDate(date: string) {
	return getUTCDate(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}


export const formatMesgBlock = async (chunks: Message[]): Promise<ChatGroup[]> => {
	const groups: { role: string; messages: Message[] }[] = []; 
	for (const chunk of chunks) {
		const last = groups[groups.length - 1];
		if (last && last.role === chunk.role) {
			last.messages.push(chunk);
		} else {
			groups.push({ role: chunk.role, messages: [chunk] });
		}
	}

	return Promise.all(
		groups.map(async (g) => ({
			role: g.role,
			blocks: await buildRenderBlocks(g.messages)
		}))
	);
};

const buildRenderBlocks = (chunks: Message[]): Promise<MessageBlock[]> => {
	const blocks: MessageBlock[] = [];
	 
	for (let i = 0; i < chunks.length; i++) {
		const c = chunks[i];
		if (c.type === 'tool_call') {
			const toolName = c.message.trim().replace(/^Calling tool:\s*/, '');
			let result = '';

			if (i + 1 < chunks.length && chunks[i + 1].type === 'tool_result') {
				result = chunks[i + 1].message;
				i++;
			}
			blocks.push({ type: 'tool_block', toolName, result });
		} else {
			blocks.push({ type: 'text', content: c.message });
		}
	}
	return Promise.resolve(blocks);
};

export function formatRoleName(role: string, exceptions: string | string[] = ["hm3"]): string {
	const exceptList = Array.isArray(exceptions) ? exceptions : exceptions.split(/[\s,]+/);
	const exceptionSet = new Set(exceptList.map((w) => w.toLowerCase()));

	return role
		.split(/[_\s]+/)
		.map((word) => {
			if (exceptionSet.has(word.toLowerCase())) {
				return word.toUpperCase();
			}

			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join(' ');
}



export function logout() {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	invalidate('app:auth').then(() => {
		location.reload();
	});
}
