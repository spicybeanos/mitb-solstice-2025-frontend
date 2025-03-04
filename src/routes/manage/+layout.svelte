<script lang='ts'>
    let {data,children} = $props();
</script>

<aside class="m-[30px]">
    <a href="/manage/verify">Verify user pass</a>
    <a href="/manage/ids">Get Details</a>
    <a href="/manage/events">Events</a>
    <a href="/manage/support">Support</a>
</aside>

{@render children()}

<style>
    a{
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        border-color: lightcoral;
        padding: 10px 10px 10px 10px;
        color: lightcoral;
        margin: 15px 15px 15px 15px;
        margin-top: 30px;
    }
</style>