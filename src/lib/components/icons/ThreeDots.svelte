<script lang="ts">
	export let nostyle = false;
	export let size = 'w-12 h-12';
	export let placement = 'center';
	export let speed = 1;
</script>

<div class={nostyle ? '' : 'min-h-[12rem] grid place-items-' + placement}>
	<svg
		aria-hidden="true"
		class={size + ' text-primary-200 fill-primary-600'}
		viewBox="0 0 120 30"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="15" cy="15" r="10" opacity="0.3">
			<animate
				attributeName="opacity"
				values="0.3;1;0.3"
				dur="{speed}s"
				repeatCount="indefinite"
				begin="0s"
			/>
		</circle>

		<circle cx="60" cy="15" r="10" opacity="0.3">
			<animate
				attributeName="opacity"
				values="0.3;1;0.3"
				dur="{speed}s"
				repeatCount="indefinite"
				begin="{speed * 0.2}s"
			/>
		</circle>

		<circle cx="105" cy="15" r="10" opacity="0.3">
			<animate
				attributeName="opacity"
				values="0.3;1;0.3"
				dur="{speed}s"
				repeatCount="indefinite"
				begin="{speed * 0.4}s"
			/>
		</circle>
	</svg>
</div>
