<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { authenticate } from '$lib/api/chat';
	import Spinner from '$lib/components/icons/Spinner.svelte';
	export let authUrl: string;

	const dispatch = createEventDispatcher();

	let email = '';
	let password = '';

	let status: 'idle' | 'success' | 'error' | 'loading' = 'idle';
	let message = '';

	async function submit() {
		status = 'idle';
		message = '';
		try {
			status = 'loading';
			const response = await authenticate(authUrl, email, password);
			if (response.status === 201) {
				status = 'success';
				message = 'Authentication successful!';
				setTimeout(() => {
					dispatch('success', { status: 200 });
				}, 1000);
			} else {
				status = 'error';
				message = 'Authentication failed. Please check your credentials.';
				dispatch('failure', { status: response.status });
			}
		} catch (err) {
			status = 'error';
			message = 'Network error. Please try again.';
			dispatch('failure', { error: err });
		}
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<div class="fixed inset-0 flex items-center justify-center z-50">
	<div class="fixed inset-0 bg-black bg-opacity-50"></div>

	<div class="bg-white rounded-2xl shadow-lg p-6 z-10 w-full max-w-md">
		<h2 class="text-xl font-semibold mb-4">Authenticate</h2>

		<label class="block mb-4">
			<span class="text-gray-700">Email</span>
			<input
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary/50 focus:border-primary"
			/>
		</label>

		<label class="block mb-4">
			<span class="text-gray-700">Password</span>
			<input
				type="password"
				bind:value={password}
				placeholder="Your password"
				class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-primary/50 focus:border-primary"
			/>
		</label>

		{#if status === 'success'}
			<div class="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">{message}</div>
		{:else if status === 'error'}
			<div class="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">{message}</div>
		{/if}

		<div class="flex justify-end space-x-2">
			<button
				on:click={cancel}
				class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
			>
				Cancel
			</button>
			<button
				on:click={submit}
				class="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-700 text-white flex items-center gap-2"
			>
				{#if status === 'loading'}
					<Spinner size="w-4 h-4" minHeight="" />
				{/if}
				Authenticate
			</button>
		</div>
	</div>
</div>
