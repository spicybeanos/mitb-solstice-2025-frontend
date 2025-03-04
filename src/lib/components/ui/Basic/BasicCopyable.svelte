<script lang="ts">
    let {text} = $props()

    function copyToClipboard() {
        navigator.clipboard
            .writeText(text)
            .then(() => console.log("Copied to clipboard!"))
            .catch((err) => console.error("Failed to copy:", err));
    }
</script>


<button 
    type="button"
    class="bg-transparent text-blue-400 border border-blue-300 rounded-lg p-2.5 cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
    onclick={copyToClipboard}
>
    Copy
</button>
