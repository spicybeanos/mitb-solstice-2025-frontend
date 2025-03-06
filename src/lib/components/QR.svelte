<script lang="ts">
    import QRCode from "qrcode";
    import { onMount } from "svelte";

    let { text } = $props();
    let canvas: HTMLCanvasElement;

    onMount(async () => {
        try {
            await QRCode.toCanvas(canvas, text, {
                width: 200,
                margin: 1,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            });
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    });
</script>

<div>
    <canvas bind:this={canvas}></canvas>
</div>
