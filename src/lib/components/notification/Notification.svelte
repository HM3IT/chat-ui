<script lang="ts">
	import type { Notification } from '$lib/types/notification';
	import { formatDatetime } from '$lib/utils';
 
	import { createEventDispatcher } from 'svelte';

	export let notification: Notification;
	$: notiData = notification.sns_data;
	const dispatch = createEventDispatcher();

	function clickHandler() {
		dispatch('click');
	}
</script>

<button
	on:click={clickHandler}
	class="block border-t w-full text-left p-4 hover:bg-neutral-50 {notification.read_at
		? ''
		: 'border-l-4 border-l-red-700'}"
>
	<div class="flex items-center justify-between">
		<h3 class="font-medium">{notification.title}</h3>
		<div class="text-xs text-gray-700">{formatDatetime(notification.created_at)}</div>
	</div>
	<p class="text-sm text-neutral-700 my-1">{notification.description}</p>
	{#each [1, 2, 3, 4] as key}
		<p class="text-neutral-700 text-xs">
			 Noti
		</p>
	{/each}
</button>
