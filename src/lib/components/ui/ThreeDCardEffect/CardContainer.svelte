<script lang="ts">

	export let className: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;
	export let isMouseEntered = false;

	let containerRef: HTMLDivElement;

</script>

<div
	class={flex items-center justify-center '}
	style="perspective: 1000px;"
>
	<div
		bind:this={containerRef}
		role="button"
		class={
			'relative flex items-center justify-center transition-all duration-200 ease-linear'}
		style="transform-style: preserve-3d;"
	>
		<slot />
	</div>
</div>
