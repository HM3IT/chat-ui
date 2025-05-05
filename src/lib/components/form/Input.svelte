<script lang="ts">
	import { errorStore } from '$lib/store/errorStore';
	import type { InputEventType, Validator } from '$lib/types/form';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	export let label = '';
	export let value: string | number | null;
	export let required = false;
	export let type: 'text' | 'number' | 'date' | 'password' = 'text';
	export let validators: Validator[] = [];
	export let placeholder = '';
	export let style = '';
	export let disabled = false;
	export let textArea = false;
	export let prefix = '';
	export let prefixClass = '';
	export let showNA = false;
	export let showLess = false;

	let dirty = false;

	$: errors = validators
		.map((v) => {
			value = value || '';
			if (v.length === 2) return v(value.toString());
			else {
				return v(value.toString());
			}
		})
		.filter((v) => v !== null);
	$: isError = errors.length && (dirty || $errorStore);

	$: {
		if (showNA && value === '') {
			value = null;
		}
	}

	let showValue = false;

	$: inputId = label.toLowerCase().replaceAll(' ', '-');

	function inputHandler(e: InputEventType) {
		if (!e.target) return;
		const v = (e.target as HTMLInputElement).value;
		if (type === 'number') {
			value = parseFloat(v);
			if (isNaN(value)) {
				value = v;
			}
		} else {
			value = v;
		}
	}
</script>

<div>
	{#if label}
		<div class="flex items-center space-x-2 mb-1 text-sm">
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
			<label class="text-neutral-500 inline-block" for={inputId}>{label}</label>
			<slot />
		</div>
	{/if}
	{#if textArea}
		<textarea
			{disabled}
			bind:value
			rows="5"
			class="w-full py-1.5 border {style} {!isError
				? 'border-neutral-400'
				: 'border-red-500'} py-1 px-2 rounded-md"
			on:blur={() => (dirty = true)}
			id={inputId}
		/>
	{:else if type === 'date'}
		<input
			type="date"
			id={inputId}
			{disabled}
			on:input={inputHandler}
			on:blur={() => (dirty = true)}
			{value}
			class="w-full py-1.5 border {style} {!isError
				? 'border-neutral-400'
				: 'border-red-500'} py-1 px-2 rounded-md"
		/>
	{:else}
		<div class="flex">
			{#if prefix}
				{#if prefixClass}
					<div class={prefixClass}>{prefix}</div>
				{:else}
					<div class="border border-neutral-400 bg-white rounded-md p-2 mr-2">{prefix}</div>
				{/if}
			{/if}
			<input
				type={type === 'password' ? (!showValue ? 'password' : 'text') : type}
				id={inputId}
				{disabled}
				on:input={inputHandler}
				on:blur={() => (dirty = true)}
				{value}
				{placeholder}
				class="w-full py-1.5 border {style} {!isError
					? 'border-neutral-400'
					: 'border-red-500'} py-1 px-2 rounded-md"
			/>
			{#if type === 'password'}
				<button
					class="bg-white p-2 border border-neutral-400 rounded-md ml-2"
					on:click={() => (showValue = !showValue)}
					type="button"
				>
					{#if !showValue}
						<Icon icon="mdi:eye-outline" />
					{:else}
						<Icon icon="mdi:eye-off-outline" />
					{/if}
				</button>
			{/if}
		</div>
	{/if}
	{#if showNA && value === null}
		<span class="text-xs block text-primary-600"> Will be reported as N/A </span>
	{:else if showLess && value == 0}
		<span class="text-xs block text-primary-600"> Will be reported as &lt;1 </span>
	{/if}
	{#if isError}
		<span transition:slide|local={{ duration: 100 }} class="text-red-500 text-xs block"
			>{errors.join(', ')}</span
		>
	{/if}
</div>
