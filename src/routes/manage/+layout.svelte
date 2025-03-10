<script lang="ts">
    let { data, children } = $props();
</script>

<aside class="m-[10px] flex flex-wrap">
    <a href="/manage/verify/">Verify user pass</a>
    <a href="/manage/ids/">Get Details</a>
    <a href="/manage/events/">Events</a>
    <a href="/manage/eventpass/">Event-Pass</a>
    <a href="/manage/pass/">Passes</a>
    <a href="/manage/support/">Support</a>
    <a href="/manage/create/">Create (Admin)</a>

</aside>

{@render children()}

<style>
    a {
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        border-color: lightcoral;
        padding: 10px 10px 10px 10px;
        color: lightcoral;
    }
</style>
