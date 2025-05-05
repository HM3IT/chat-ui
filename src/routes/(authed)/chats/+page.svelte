<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let newSessionId = '';

	const startNewChat = () => {
		goto('/research/' + newSessionId);
	};

	onMount(() => {
		if (crypto?.randomUUID) {
			newSessionId = crypto.randomUUID();
			console.log('generted new uuid ', newSessionId);
		}
	});
</script>

<div class="w-full h-full flex justify-center items-center bg-white">
	<button
		on:click={startNewChat}
		class="px-6 py-4 bg-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-none"
		>Start A New Chat</button
	>
</div>
