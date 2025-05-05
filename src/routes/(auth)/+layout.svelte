<script>
	import Logo from '$lib/components/icons/Logo.svelte';
</script>

<div class="min-h-screen flex flex-col">
	<slot />
	<footer class="bg-neutral-100 py-6 px-12 flex items-center justify-between">
		<Logo />
		<div class="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, sit!</div>
	</footer>
</div>
