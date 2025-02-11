<script lang="ts">
	import { cn } from '$lib/utils/cn.ts';

	export let className: string | undefined = undefined;
	export let containerClassName: string | undefined = undefined;
	export let isMouseEntered = false;

	let containerRef: HTMLDivElement;

</script>

<div
	class={cn('flex items-center justify-center ', containerClassName)}
	style="perspective: 1000px;"
>
	<div
		bind:this={containerRef}
		role="button"
		class={cn(
			'relative flex items-center justify-center transition-all duration-200 ease-linear',
			className
		)}
		style="transform-style: preserve-3d;"
	>
		<slot />
	</div>
</div>