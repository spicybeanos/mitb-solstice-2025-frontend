<script lang="ts">

	export let className: string | undefined = undefined;
	export let isMouseEntered: boolean = false;

	let ref: HTMLDivElement;

	$: isMouseEntered;

</script>

<div
	bind:this={ref}
	class={'w-fit transition duration-200 ease-linear'}
	{...$$props}
>
	<slot />
</div>
