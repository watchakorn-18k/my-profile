<!-- DataDisplay.svelte -->
<script lang="ts">
  export let waketimes: any[];
  export let maxPercent: number;
</script>

{#if waketimes}
  <div>
    {#each waketimes as waketime}
      {#if waketime.percent > 0}
        <div
          class="flex gap-6 items-center justify-center w-11/12 xl:w-[40rem]"
        >
          <img
            src={`https://icon.icepanel.io/Technology/svg/${waketime.name}.svg`}
            class={`w-6`}
            alt=""
          />
          <p class={`w-32 text-start text-xs xl:text-lg`}>
            {waketime.name}
          </p>
          <progress
            class={`progress progress-primary w-4/5 xl:w-full text-primary border-0 bg-base-300 h-2 xl:h-3`}
            value={waketime.percent}
            max={100}
          ></progress>
          <p class="text-start text-xs xl:text-xl">{waketime.percent}%</p>
        </div>
      {/if}
    {/each}
  </div>
{:else}
  <p>Loading...</p>
{/if}
