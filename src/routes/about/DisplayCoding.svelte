<!-- DataDisplay.svelte -->
<script lang="ts">
  export let waketimes: any[];
</script>

{#if waketimes}
  <div>
    {#each waketimes as waketime}
      {#if waketime.percent > 0}
        <div
          class="grid w-full max-w-[40rem] grid-cols-[24px_minmax(0,7rem)_minmax(0,1fr)_auto] items-center gap-2 px-2 md:gap-4"
        >
          <img
            src={`https://icon.icepanel.io/Technology/svg/${waketime.name}.svg`}
            class={`w-6`}
            alt=""
          />
          <p class={`min-w-0 truncate text-start text-xs xl:text-lg`}>
            {waketime.name}
          </p>
          <progress
            class={`progress progress-primary w-full min-w-0 text-primary border-0 bg-base-300 h-2 xl:h-3`}
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
