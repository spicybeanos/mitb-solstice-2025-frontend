<script lang="ts">
    import { cn } from "../../utils/cn";
  
    let className: any = "";
    export { className as class };
  </script>
  
  <div
    class={cn(
      "pointer-events-none absolute h-[100%] w-full overflow-hidden opacity-50 [perspective:200px]",
      className
    )}
  >
    <!-- Grid  -->
    <div class="absolute inset-0 [transform:rotateX(35deg)]">
      <div
        class={cn(
          "animate-grid",
  
          "[background-repeat:repeat] [background-size:60px_60px] [height:200vh] [inset:-50%_0px] [margin-left:-50%] [transform-origin:200%_0_0] [width:600vw]",
  
          // Light Styles
          "[background-image:linear-gradient(to_right,rgba(171,131,254,1)_3px,transparent_0),linear-gradient(to_bottom,rgba(171,131,254,1)_3px,transparent_0)]",
  
          // Dark styles
          "dark:[background-image:linear-gradient(to_right,rgba(171,131,254,0.8)_3px,transparent_0),linear-gradient(to_bottom,rgba(171,131,254,0.8)_3px,transparent_0)]"
        )}
      />
    </div>
  
    <!-- Background Gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black"
    />
  </div>
  