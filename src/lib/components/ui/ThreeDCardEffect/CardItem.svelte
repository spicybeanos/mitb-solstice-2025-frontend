<script lang="ts">
	import { cn } from '$lib/utils/cn.ts';

	export let className: string | undefined = undefined;
	export let isMouseEntered: boolean = false;

	let ref: HTMLDivElement;

	$: isMouseEntered;

</script>

<div
	bind:this={ref}
	class={cn('w-fit transition duration-200 ease-linear', className)}
	{...$$props}
>
	<slot />
</div>