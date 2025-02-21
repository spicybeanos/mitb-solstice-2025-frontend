<script lang='ts'>
    let {data,children} = $props();
</script>

<aside class="m-[30px]">
    <h2>Actions</h2>
    <a href="/manage/verify">verify user pass</a>
    <a href="/manage/ids">get details</a>
    <a href="/manage/events">events</a>
</aside>

{@render children()}

<style>
    h1,h2,div{
        color: white;
        padding: 5px 5px 5px 5px;

    }
    a{
        border-style: solid;
        border-width: 1px;
        border-color: lightcoral;
        padding: 5px 5px 5px 5px;
        color: lightcoral;
    }
</style>