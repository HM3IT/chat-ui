<script lang="ts">
	import Icon from '@iconify/svelte';
	import Logo from '../icons/Logo.svelte';
	import NavButton from './NavButton.svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
 
	$: path = $page.url.pathname;
	let expand = false;

	const navs = [
		{
			icon: 'radix-icons:dashboard',
			href: '/',
			tooltip: 'Dashboard'
		},
		{
			icon: 'iconamoon:edit-light',
			href: '/requests',
			tooltip: 'Requests'
		},
		{
			icon: 'iconoir:bell-notification',
			href: '/notifications',
			tooltip: 'Notifications'
		},
		{
			icon: 'solar:chat-round-unread-linear',
			href: '/messages',
			tooltip: 'Messages'
		},
		{
			icon: 'nimbus:stats',
			href: '/annual-reports',
			tooltip: 'Reports'
		},
		{
			icon: 'ph:archive',
			href: '/archives',
			tooltip: 'Archives'
		},
		{
			icon: 'ri:chat-ai-line',
			href: '/research',
			tooltip: 'Research'
		}
	];
</script>

<nav class="bg-primary-700 text-white min-h-screen border-r border-neutral-200 max-w-fit">
	<div class="sticky top-0 z-10">
		<a href="/" class="px-8 py-7 border-b border-neutral-200 inline-block w-full">
			<Logo />
		</a>
		<div
			class="flex flex-col space-y-4 py-6 px-4 overflow-hidden {expand
				? 'w-72'
				: 'w-24'} transition-all duration-300"
		>
			<button class="p-4 hover:bg-primary-500 rounded-lg" on:click={() => (expand = !expand)}>
				<Icon
					icon="lucide:arrow-right-from-line"
					width="24"
					height="24"
					class="transition-transform duration-300 {expand ? 'rotate-180' : ''}"
				/>
			</button>
			{#each navs as item}
				{#if item.tooltip === 'Notifications'}
					<a
						href={item.href}
						class="p-4 rounded-lg transition-all duration-300 flex items-center {expand
							? 'justify-start'
							: 'justify-center'} shrink-0 {path === item.href
							? 'bg-white text-primary-700 font-semibold'
							: 'hover:bg-primary-500'}"
					>
						<span class="relative block">
							<Icon icon="octicon:bell-24" width="24" height="24" class="shrink-0" />
						</span>
						<span
							class="shrink whitespace-nowrap overflow-hidden transition-[width] duration-300 {expand
								? 'pl-4 w-full'
								: 'pl-0 w-0'}"
							transition:fade={{ duration: 300 }}>{item.tooltip}</span
						>
					</a>
				{:else}
					<NavButton
						href={item.href}
						active={item.href === '/'
							? path === '/'
							: path.split('/').includes(item.href.split('/').reverse()[0])}
						icon={item.icon}
						text={item.tooltip}
						bind:showText={expand}
					/>
				{/if}
			{/each}
		</div>
	</div>
</nav>
