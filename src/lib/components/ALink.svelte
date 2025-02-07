<script lang="ts">
 let {style='',href,children} = $props();
</script>

<a style={style} href={href}>
    {@render children()}
</a>

<style>
    a{
        text-decoration: none;
        color: var(--text-light-mode);
        cursor: pointer;
        background-color: var(--background-light);
        padding: 10px;
        border: none;
        border-width: 0px;
        border-bottom-width: 0px;
        border-style: solid;
        border-color: var(--border-light-mode);
        transition: all 0.1s;   
    }

    a:hover {
        border-bottom-width: 3px;
    }

    a:focus {
        border-bottom-width: 0px;
    }
</style>