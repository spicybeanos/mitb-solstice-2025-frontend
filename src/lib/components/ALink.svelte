<script lang="ts">
 let {style='',href,children} = $props();
</script>

<a style={style} href={href}>
    {@render children()}
</a>

<style>
    a{
        text-decoration: none;
        color: black;
        cursor: pointer;
        background-color: white;
        padding: 10px;
        border: none;
        border-width: 0px;
        border-bottom-width: 0px;
        border-style: solid;
        border-color: black;
        transition: all 0.1s;   
    }

    a:hover {
        border-bottom-width: 3px;
    }

    a:focus {
        border-bottom-width: 0px;
    }
</style>