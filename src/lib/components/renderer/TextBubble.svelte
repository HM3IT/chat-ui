<script lang="ts">
	import { onMount, tick } from 'svelte';
	import MDLinkRenderer from '$lib/components/renderer/MDLinkRenderer.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	export let fullText: string;
	export let delay: number = 10;

	let displayText = '';

	onMount(async () => {
		displayText = '';
		for (const ch of fullText) {
			displayText += ch;
			await tick();
			await new Promise((r) => setTimeout(r, delay));
		}
	});
</script>

<SvelteMarkdown
	source={displayText}
	renderers={{
		link: MDLinkRenderer
	}}
/>
