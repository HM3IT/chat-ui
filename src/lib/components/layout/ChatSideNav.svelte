<script lang="ts">
	import type { Chat } from '$lib/types/chat';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Logo from '../icons/Logo.svelte';
 
	import { userStore } from '$lib/store/userStore';
	import { listChats, deleteChat } from '$lib/api/chat';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import PlusCircleIcon from '$lib/components/icons/PlusCircleIcon.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import DeleteIcon from '$lib/components/icons/DeleteIcon.svelte';
	import Modal from '../modal/Modal.svelte';
	import { onMount } from 'svelte';
 
	let expand = true;
	let filter: string = '';
	let chats: Chat[] = [];
	let showDelete: boolean = false;
	let deletingChatId: string | null = null;
	let newSessionId = '';

	const client = useQueryClient();
	const userId = $userStore.id;

	const listChatsQuery = createQuery({
		queryFn: () => listChats(userId),
		queryKey: ['chats'],
		refetchOnWindowFocus: false,
		refetchOnMount: true
	});

	const startNewChat = () => {
		goto('/research/' + newSessionId);
	};

	const deleteChatMutation = createMutation({
		mutationFn: (delteChatId: string) => deleteChat(userId, delteChatId),
		onSuccess: ({ chat_id }) => {
			showDelete = false;
			deletingChatId = null;
			client.invalidateQueries({
				queryKey: ['chats']
			});
		
		 
			if (chat_id === $page.params.id) {
				goto('/research');
			}
		},
		onError: () => {
			showDelete = false;
			deletingChatId = null;
		}
	});

	onMount(() => {
		if (crypto?.randomUUID) {
			newSessionId = crypto.randomUUID();
			console.log('generted new uuid ', newSessionId);
		}
	});

	$: if ($listChatsQuery.data) {
		chats = $listChatsQuery.data.filter((c) =>
			c.title.toLowerCase().includes(filter.toLowerCase())
		);
	}
</script>

<Modal bind:show={showDelete}>
	<div class="bg-white p-6 rounded-lg w-[24rem]">
		<h2 class="text-lg font-semibold">Are you sure you want to delete this chat?</h2>
		<div class="flex justify-end mt-4 space-x-4 text-sm">
			<button
				on:click={() => (showDelete = false)}
				class="font-semibold disabled:opacity-50"
				disabled={$deleteChatMutation.isPending}
			>
				Cancel
			</button>
			<button
				on:click={() => {
					if (deletingChatId) {
						$deleteChatMutation.mutate(deletingChatId);
					}
				}}
				class="px-4 py-2 bg-red-500 hover:bg-red-800 text-white font-semibold rounded-lg disabled:opacity-50"
				disabled={$deleteChatMutation.isPending}
			>
				Delete
			</button>
		</div>
	</div>
</Modal>

<nav class="bg-primary-700 text-white min-h-screen border-r border-neutral-200 max-w-fit">
	<a href="/" class="px-8 py-7 border-b border-neutral-200 inline-block w-full">
		<Logo />
	</a>
	<div
		class="flex flex-col space-y-4 py-6 px-4 overflow-hidden {expand
			? 'w-72'
			: 'w-24'} transition-all duration-300"
	>
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<button class="p-4 hover:bg-primary-500 rounded-lg" on:click={() => (expand = !expand)}>
					<Icon
						icon="lucide:arrow-right-from-line"
						width="24"
						height="24"
						class="transition-transform duration-300 {expand ? 'rotate-180' : ''}"
					/>
				</button>
				<button on:click={startNewChat} class={expand ? 'block' : 'hidden'}>
					<PlusCircleIcon fillColor="white" />
				</button>
			</div>
		</div>

		<div class="py-4 relative {expand ? 'block' : 'hidden'}">
			<input
				bind:value={filter}
				type="text"
				placeholder="Search chat history"
				class="bg-primary-900 pl-3 pr-8 py-2 rounded-lg text-sm w-full focus:outline-none text-white"
			/>
			<div class="absolute right-2 top-1/2 -translate-y-1/2">
				<SearchIcon />
			</div>
		</div>

		<div class="flex-1 overflow-y-auto">
			<div class="space-y-1">
				{#if chats}
					{#each chats as chat}
						{@const active = $page.params.id === chat.chat_id}
						<div
							class:bg-primary-800={active}
							class="relative group flex items-center hover:bg-primary-800 pl-3 pr-8 rounded-lg"
						>
							<button
								class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 invisible group-hover:visible"
								on:click={() => {
									showDelete = true;
									deletingChatId = chat.chat_id;
								}}
							>
								<DeleteIcon />
							</button>
							<a
								href="/research/{chat.chat_id}"
								class="block w-full text-left text-sm truncate py-2"
							>
								{chat.title}
							</a>
						</div>
					{/each}
				{:else}
					<div
						class="text-sm text-center grid place-items-center h-full text-slate-400 text-nowrap"
					>
						No chat found
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>
