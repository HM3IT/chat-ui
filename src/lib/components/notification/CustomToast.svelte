<script lang="ts">
	import type { NotificationPayload } from '$lib/types/notification';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let notification: {
		type: string;
		text: string;
		description: string | undefined;
		actionName: string;
		action: (payload: NotificationPayload) => void;
		payload: NotificationPayload;
	};
	export let onRemove: () => void;
	export let withoutStyles: boolean;
 
	let timer: number;

 
	onMount(() => {
		timer = setTimeout(() => {
			onRemove();
		}, 10000);

		return () => {
			clearTimeout(timer);
		};
	});
</script>

<div
	transition:fade
	class={withoutStyles
		? ''
		: 'mt-4 min-w-[24rem] rounded-md border border-neutral-200 bg-white px-4 py-2 shadow-lg' +
			(notification.type === 'notification' ? ' border-l-4 border-l-red-500' : '')}
>
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-2">
			{#if notification.type === 'error'}
				<Icon icon="mdi:alert-circle" class="text-red-500" />
			{:else if notification.type === 'warning'}
				<Icon icon="mdi:alert-circle" class="text-yellow-500" />
			{:else if notification.type === 'info' || notification.type === 'notification'}
				<Icon icon="lucide:info" class="text-blue-500" />
			{:else if notification.type === 'success'}
				<Icon icon="mdi:check-circle" class="text-green-500" />
			{/if}
			<p class="font-semibold text-neutral-700">{notification.text}</p>
		</div>
		<button on:click={onRemove} class="text-neutral-500">
			<Icon icon="mdi:close-thick" />
		</button>
	</div>
	{#if notification.description}
		<p class="mt-2 text-neutral-700">{notification.description}</p>
	{/if}
	{#if notification.actionName}
		<button
			class="mt-2 rounded-md border px-2 py-1 text-sm text-neutral-700"
		>
			{notification.actionName}
		</button>
	{/if}
</div>
