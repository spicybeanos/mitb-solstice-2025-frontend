<script lang="ts">
	import { Motion, AnimatePresence, useViewportScroll, useMotionValue } from 'svelte-motion';
	import { cn } from '../../../utils/cn';

	export let navItems: {
		name: string;
		link: string;
	}[];
	export let className: string | undefined = undefined;

	// const { scrollYProgress } = useScroll();
	const { scrollYProgress } = useViewportScroll();

	let visible = true;

	$: $scrollYProgress, updateDirection();

	function updateDirection() {
		console.log($scrollYProgress);

		let direction = $scrollYProgress - scrollYProgress.getPrevious();
		console.log(direction);

		if (scrollYProgress.get() < 0.05) {
			// visible = false;
		} else {
			if (direction < 0) {
				visible = true;
			} else {
				visible = false;
			}
		}
	}
</script>

<AnimatePresence show={true}>
	<Motion
		let:motion
		initial={{
			opacity: 1,
			y: -100
		}}
		animate={{
			y: visible ? 0 : -100,
			opacity: visible ? 1 : 0
		}}
		transition={{
			duration: 0.2
		}}
	>
		<div
			use:motion
			class={cn(
				'max-sm:hidden fixed inset-x-0  top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-transparent py-2 pl-8 pr-2  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:border-white/[0.2] bg-[#f5efef]',
				className
			)}
		>
			{#each navItems as navItem, idx (`link=${idx}`)}
				<a
					href={navItem.link}
					class={cn(
						`hover:z-50 hover:scale-[1.15] transition-all relative flex p-1 items-center space-x-1 text-black/60  hover:text-black`, idx === 3 ? "pr-6" : ""
					)}
				>
					<span class="text-sm">{navItem.name}</span>
				</a>
			{/each}
			<!-- <button
				class="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white"
			> -->
				<!-- <span>Login</span> -->
				<!-- <span
					class="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
				></span> -->
			<!-- </button> -->
		</div>
	</Motion>
</AnimatePresence>
