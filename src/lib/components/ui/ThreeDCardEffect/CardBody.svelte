<script lang="ts">
	import { cn } from '$lib/utils/cn.ts';

	export let className: string;
</script>

<div
	class={cn(
		'h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]',
		className
	)}
>
	<slot />
</div>