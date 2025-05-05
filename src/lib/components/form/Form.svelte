<script lang="ts">
	import type { Validator, InputFieldType } from '$lib/types/form';
	import Input from './Input.svelte';

	export let fields: InputFieldType[];
	export let innerClass: string = '';
	export let wrapperClass: string = '';
</script>

<form on:submit class={wrapperClass}>
	<div class={innerClass}>
		{#each fields as { value, validators, type, label, required }}
			<Input bind:value {validators} {type} {label} {required} />
		{/each}
	</div>
	<slot />
</form>
