<script lang="ts">
	import Icon from '@iconify/svelte';

	export let variant: 'primary' | 'neutral' | 'bare' | 'secondary' | 'border' | 'bare-primary' =
		'primary';
	export let icon: string | null = null;
	export let iconPosition: 'start' | 'end' = 'start';
	export let loading = false;
	export let disabled = false;
	export let href: string | null = null;
	export let style = '';
	export let type: 'button' | 'submit' = 'button';

	let btnStyle = '';
	switch (variant) {
		case 'primary':
			btnStyle = 'bg-primary-700 hover:bg-primary-800 text-white';
			break;
		case 'neutral':
			btnStyle = 'bg-neutral-200 hover:bg-neutral-300';
			break;
		case 'bare':
			btnStyle = 'text-black hover:bg-neutral-100';
			break;
		case 'bare-primary':
			btnStyle = 'text-primary-700 hover:bg-neutral-100';
			break;
		case 'secondary':
			btnStyle = 'bg-neutral-500 hover:bg-neutral-600 text-white';
			break;
		case 'border':
			btnStyle = 'text-primary-700 border border-primary-700 hover:bg-neutral-100';
			break;
	}
</script>

{#if href !== null}
	<a
		{href}
		class="transition-colors font-semibold {btnStyle} py-3 px-4 rounded-xl flex items-center space-x-2 disabled:bg-neutral-200 disabled:border-neutral-200 disabled:text-white {style} justify-center"
	>
		{#if iconPosition === 'start' && icon !== null}
			<Icon {icon} width="20" height="20" />
		{/if}
		<span><slot /></span>
		{#if iconPosition === 'end' && icon !== null}
			<Icon {icon} width="20" height="20" />
		{/if}
	</a>
{:else}
	<button
		{type}
		class="transition-colors font-semibold {btnStyle} py-3 px-4 rounded-xl flex items-center space-x-2 disabled:bg-neutral-300 disabled:border-neutral-200 disabled:text-white {style} justify-center"
		disabled={loading || disabled}
		on:click
	>
		{#if iconPosition === 'start' && (icon !== null || loading)}
			<Icon icon={loading ? 'line-md:loading-loop' : icon || ''} width="20" height="20" />
		{/if}
		<span><slot /></span>
		{#if iconPosition === 'end' && (icon !== null || loading)}
			<Icon icon={loading ? 'line-md:loading-loop' : icon || ''} width="20" height="20" />
		{/if}
	</button>
{/if}
