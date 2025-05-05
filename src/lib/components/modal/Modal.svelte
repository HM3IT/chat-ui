<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let show: boolean;
	export let style = '';

	const dispatch = createEventDispatcher();

	$: {
		if (show) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
			dispatch('close');
		}
	}
</script>

{#if show}
	<div
		class="grid place-items-center min-h-screen fixed inset-0 z-20 p-4 px-8"
		transition:fade|local={{ duration: 100 }}
	>
		<div
			class="absolute inset-0 bg-black bg-opacity-50 cursor-default"
			on:click={() => {
				show = false;
			}}
			on:keydown={() => {}}
			role="button"
			tabindex="0"
		/>
		<div class="z-30 {style}">
			<slot />
		</div>
	</div>
{/if}
