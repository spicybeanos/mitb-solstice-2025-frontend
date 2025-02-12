<script>
    import QRCode from 'qrcode';
    import { onMount } from 'svelte';
    
    export let text = '';
    let canvas;
    
    onMount(() => {
        QRCode.toCanvas(canvas, text, {
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
    });
</script>

<canvas bind:this={canvas}></canvas>