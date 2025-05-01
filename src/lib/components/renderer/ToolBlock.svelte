<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import Spinner from "$lib/components/icons/Spinner.svelte"

	export let toolName: string;
	export let result: string = '';

	let expanded = false;
	$: loading = !result;
</script>

<div class="flex flex-col my-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
	<div class="flex items-center space-x-2 text-gray-800 justify-between">
		<div>
			<span class="font-semibold">
				{#if loading}
					🔧 Calling tool:
				{:else}
					Tool Completed:
				{/if}
			</span>
			<span class="font-mono">{toolName}</span>
		</div>
		<div>
			{#if loading}
				<Spinner size="w-4 h-4" minHeight="" />
			{:else}
				<button on:click={() => (expanded = !expanded)} class="p-2" aria-label="Toggle">
					<div
						class="transform transition-transform duration-200 ease-in-out"
						class:rotate-90={expanded}
					>
						<Icon icon="mdi:chevron-right" width="24" height="24" />
					</div>
				</button>
			{/if}
		</div>
	</div>

	{#if expanded}
		<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }} class="mt-2 overflow-auto">
			<pre
				class=" bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-sm">{result.trim()}</pre>
		</div>
	{/if}
</div>
