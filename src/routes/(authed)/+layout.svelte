<script lang="ts">
	import SideNav from '$lib/components/layout/SideNav.svelte';
	import ChatSideNav from '$lib/components/layout/ChatSideNav.svelte';

	import { page } from '$app/stores';

	const researchRouteRegex = /^\/research(\/|$)/;
</script>

<div class="bg-neutral-200 min-w-full flex">
	{#if researchRouteRegex.test($page.url.pathname)}
		<ChatSideNav />
	{:else}
		<SideNav />
	{/if}
</div>
