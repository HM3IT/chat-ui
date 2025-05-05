<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	export let icon: string;
	export let active: boolean;
	export let href: string;
	export let text: string = '';
	export let showText = true;
</script>

<a
	{href}
	class=" p-4 rounded-lg itransition-all duration-300 flex {showText
		? 'justify-start'
		: 'justify-center'} items-center shrink-0 {active
		? 'bg-white text-primary-700'
		: 'hover:bg-primary-500'}"
	aria-label={text}
>
	<Icon {icon} width="24" height="24" class="shrink-0" />
	<span
		class="shrink whitespace-nowrap {active
			? 'font-semibold'
			: ''} overflow-hidden transition-[width] duration-300 {!showText
			? 'w-0 pl-0'
			: 'w-full pl-4'}"
		transition:fade={{ duration: 300 }}>{text}</span
	>
</a>
