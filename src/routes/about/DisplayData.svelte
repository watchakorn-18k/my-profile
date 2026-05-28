<script lang="ts">
    export let waketimes: any[];
    import DisplayCoding from "./DisplayCoding.svelte";
    import DisplayInfo from "./DisplayInfo.svelte";
</script>

<div class="text-center font-mono mt-14">
    <DisplayInfo />
    <h1 class="m-4 md:m-8 xl:text-2xl safe-wrap">Last 30 days for coding</h1>
    <div>
        <div class="flex flex-col justify-start items-center gap-4 w-full">
            <DisplayCoding {waketimes} />
        </div>
    </div>
    <div class="mx-4 md:mx-24 flex flex-col gap-16 items-center mt-6">
        <img
            class="w-full max-w-[40rem]"
            src="https://github.com/watchakorn-18k/watchakorn-18k/raw/main/github-metrics.svg"
            alt="metrics"
        />
    </div>
</div>
