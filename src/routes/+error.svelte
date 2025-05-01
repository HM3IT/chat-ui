<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="grid place-items-center min-h-screen">
	<div class="text-center space-y-4">
		<h1 class="font-semibold text-2xl">{$page?.status} | {$page?.error?.message}</h1>
	</div>
</div>
