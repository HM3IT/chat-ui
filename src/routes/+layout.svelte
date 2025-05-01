<script lang="ts">
	import '../app.css';
	import CustomToast from '$lib/components/notification/CustomToast.svelte';
	import Notifications from 'svelte-notifications';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	 

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: 0,
				// enabled: !!$userStore.token
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<Notifications item={CustomToast} zIndex={5000}>
		<slot />
	</Notifications>
</QueryClientProvider>
