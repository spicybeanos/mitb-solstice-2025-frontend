<script lang="ts">
	export let className: string;
</script>

<div
	class={
		'h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]'}
>
	<slot />
</div>
