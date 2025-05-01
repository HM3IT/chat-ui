<script lang="ts">
	import type { Chunk, RenderGroup } from '$lib/types/chat.ts';

	import { onMount } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { queryChat, getChats } from '$lib/api/chat';
	import { formatRoleName, formatMesgBlock } from '$lib/utils';
	import { authFormStateStore } from '$lib/store/authFormStateStore';

	import SvelteMarkdown from 'svelte-markdown';
	import MDLinkRenderer from '$lib/components/renderer/MDLinkRenderer.svelte';
	import ToolBlock from '$lib/components/renderer/ToolBlock.svelte';
	import TextBubble from '$lib/components/renderer/TextBubble.svelte';
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import ThreeDots from '$lib/components/icons/ThreeDots.svelte';
	import Icon from '@iconify/svelte';

	let chatContainer: HTMLDivElement;
	let inputBox: HTMLTextAreaElement;
	let userInputText = '';
	let sessionId = '';
	let isThinking = false;
	let isLoading = true;
	let chunks: Chunk[] = [];
	let renderedGroups: RenderGroup[] = [];
	$: chunks = [];

	$: chatsQuery = createQuery({
		queryKey: ['chats-detail', sessionId],
		queryFn: () => getChats(sessionId),
		enabled: sessionId !== '',
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchInterval: 0
	});

	async function updateRenderedGroups() {
		renderedGroups = await formatMesgBlock(chunks);
	}
	$: if ($chatsQuery.isSuccess && $chatsQuery.data) {
		chunks = $chatsQuery.data;
		updateRenderedGroups();
	}

	async function send(text: string | null = null) {
		if (text === null) {
			text = userInputText.trim();
		}

		if (!text) return;
		chunks = [...chunks, { role: 'user', type: 'text', message: text }];
		isLoading = false;
		await updateRenderedGroups();

		userInputText = '';
		scrollToBottom();
		isThinking = true;

		const stream = await queryChat(sessionId, text);
		const reader = stream.body!.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const parts = buffer.split('\n');
			buffer = parts.pop()!;

			for (const part of parts) {
				if (!part.trim()) continue;
				const chunk = JSON.parse(part) as Chunk;
				chunks = [...chunks, chunk];
				await updateRenderedGroups();
			}
			scrollToBottom();
		}
		isThinking = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey && !isThinking) {
			e.preventDefault();
			send();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain');
		if (!text) return;
		const start = inputBox.selectionStart ?? 0;
		const end = inputBox.selectionEnd ?? 0;
		userInputText = userInputText.slice(0, start) + text + userInputText.slice(end);
		const newPos = start + text.length;
		inputBox.selectionStart = inputBox.selectionEnd = newPos;
	}

	function scrollToBottom() {
		requestAnimationFrame(() => {
			if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
		});
	}

	onMount(async () => {
		if (crypto?.randomUUID) {
			if (sessionId === '') {
				sessionId = crypto.randomUUID();
			}
			console.log('generted new uuid ', sessionId);
		}
		scrollToBottom();
	});
</script>

<div
	bind:this={chatContainer}
	class="flex flex-col w-full h-[90vh] overflow-y-auto pt-10 space-y-8 bg-white"
>
	{#each renderedGroups as group, gi}
		<article class="w-full flex justify-center">
			<div
				class="w-[768px] flex flex-col"
				class:items-end={group.role === 'user'}
				class:items-start={group.role !== 'user'}
			>
				<div class="flex items-center space-x-2 mb-1">
					{#if group.role !== 'user'}
						<div
							class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white uppercase text-sm font-bold"
						>
							{group.role.charAt(0)}
						</div>
						<span class="font-semibold">{formatRoleName(group.role)}</span>
					{:else}
						<span class="font-semibold">{formatRoleName(group.role)}</span>
						<div
							class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white uppercase text-sm font-bold"
						>
							{group.role.charAt(0)}
						</div>
					{/if}
				</div>

				<div
					class="{group.role !== 'user'
						? 'w-4/5'
						: ''} flex flex-col p-4 rounded-lg break-words text-justify [&_a]:underline"
					class:bg-blue-50={group.role !== 'user'}
					class:bg-gray-100={group.role === 'user'}
				>
					{#each group.blocks as block}
						{#if block.type === 'tool_block'}
							<ToolBlock toolName={block.toolName} result={block.result} />
						{:else if !isLoading && gi === renderedGroups.length - 1 && group.role !== 'user'}
							<TextBubble fullText={block.content} />
						{:else}
							<SvelteMarkdown
								source={block.content}
								renderers={{
									link: MDLinkRenderer
								}}
							/>
						{/if}
					{/each}
				</div>
			</div>
		</article>
	{:else}
		<div class="grid place-items-center h-full text-gray-600">
			let's start chatting with the HM3 Agent
		</div>
	{/each}

	{#if isThinking}
		<article class="w-full flex justify-center">
			<div class="w-[768px] flex flex-col">
				<ThreeDots placement={'left'} speed={2} size="w-8 h-8" />
			</div>
		</article>
	{/if}
</div>
{#if $authFormStateStore && $authFormStateStore.show && !isThinking}
	<AuthForm
		on:success={() => {
			$authFormStateStore = { url: '', show: false };
			send("I've authenticated.");
		}}
		on:cancel={() => ($authFormStateStore = { url: '', show: false })}
		on:failure={() => ($authFormStateStore = { url: '', show: false })}
		authUrl={$authFormStateStore.url}
	/>
{/if}
<form on:submit|preventDefault={() => send()} class="sticky bottom-0 w-full bg-white p-4">
	<div
		class="mx-auto border border-gray-100 flex items-center gap-2 max-w-4xl px-6 py-2 rounded-2xl shadow"
	>
		<button type="button" class="p-2 text-gray-500 hover:bg-gray-200 rounded-md">
			<Icon icon="akar-icons:plus" width="24" height="24" />
		</button>
		<textarea
			bind:this={inputBox}
			bind:value={userInputText}
			on:keydown={handleKeydown}
			on:paste={handlePaste}
			style="resize: none;"
			data-placeholder="Type your message..."
			class="flex-1 p-2 focus:outline-none placeholder-gray-400
         		min-h-[48px] max-h-40 overflow-y-auto"
		></textarea>

		<button
			type="submit"
			disabled={isThinking}
			class="p-2 {isThinking ? 'text-gray-500' : 'text-blue-600  hover:bg-blue-100'}  rounded-md"
		>
			<Icon icon="carbon:send" width="24" height="24" />
		</button>
	</div>
</form>
