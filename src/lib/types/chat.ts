export interface Chunk {
	type: MessageType;
	role: string;
	message: string;
}

export interface ChatMessage {
	role: string;
	messages: Chunk[];
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
export type RenderBlock = ToolBlockData | TextData;

export interface RenderGroup {
	role: string;
	blocks: RenderBlock[];
}

export type MessageType = 'text' | 'tool_result' | 'tool_call';
