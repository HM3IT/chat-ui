export interface Message {
	type: MessageType;
	role: string;
	message: string;
}

export interface ToolBlockData {
	type: 'tool_block';
	toolName: string;
	result: string;
}
export interface TextData {
	type: 'text';
	content: string;
}
export type MessageBlock = ToolBlockData | TextData;

export interface ChatGroup {
	role: string;
	blocks: MessageBlock[];
}

export type MessageType = 'text' | 'tool_result' | 'tool_call';

export type Chat = {
	chat_id: string;
	title: string;
	messages: Message[];
};
