<script lang="ts">
    export let text: string;
    export let className = '';
    let copied = false;
    
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(text);
            copied = true;
            setTimeout(() => copied = false, 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    }
</script>

<button 
    class="btn {className}" 
    on:click={copyToClipboard}
    title="Click to copy"
>
    <span class="text">{text}</span>
    <span class="svg-icon" class:copied>
        {#if copied}
            <svg viewBox="0 0 24 24" height="1em" fill="none" stroke="currentColor">
                <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        {:else}
            <svg viewBox="0 0 384 512" height="1em" fill="currentColor">
                <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
            </svg>
        {/if}
    </span>
</button>

<style>
    .btn {
        min-width: 100px;
        width: fit-content;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border: none;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.2s ease;
        background: none;
        padding: 0;
    }

    .btn:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }

    .btn:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .text {
        flex: 1;
        padding: 0 12px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background-color: rgb(0,0,0);
        transition: background-color 0.2s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .svg-icon {
        width: 35px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background-color: black;
        transition: all 0.2s ease;
    }

    .svg-icon.copied {
        background-color: black;
    }

    .btn:hover .text {
        background-color: rgb(0,0,0);
    }

    .btn:hover .svg-icon {
        background-color: rgb(0,0,0);
    }

    @media (max-width: 640px) {
        .btn {
            min-width: 80px;
            height: 32px;
        }
        
        .text {
            font-size: 0.95rem;
        }
    }
</style>
