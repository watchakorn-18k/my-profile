<script lang="ts">
  import waketimes from "$lib/waketime.json";
  let maxPercent = waketimes.data[0].percent;
</script>

<div class="text-center font-mono mt-14">
  <h1 class="text-3xl m-8">🤳🏻My Profile</h1>
  <div class="mx-24 flex flex-col gap-16 items-center mt-6">
    <img
      class="w-[30rem] lg:w-[15rem]"
      src="https://github.com/watchakorn-18k/watchakorn-18k/raw/main/devcard.svg"
      alt="metrics"
    />
  </div>
  <div class="flex flex-col justify-start items-center m-8 p-8 gap-4">
    <p>👋Hello, I'm wk18k</p>
    <p>👨🏻‍💻I'm a Backend Developer</p>
    <p>
      Github : <a class="link" href="https://github.com/watchakorn-18k"
        >watchakorn-18k</a
      >
    </p>
    <p>
      Linkedin : <a class="link" href="https://www.linkedin.com/in/watchakorn/"
        >watchakorn</a
      >
    </p>
  </div>
  <h1 class="xl:text-2xl m-8">Last 30 days for coding</h1>
  <div>
    <div class="flex flex-col justify-start items-center gap-4 w-full">
      {#each waketimes.data as waketime}
        {#if waketime.percent > 0}
          <div class="flex gap-6 items-center justify-center w-11/12 xl:w-3/5">
            <img
              src={`https://icon.icepanel.io/Technology/svg/${waketime.name}.svg`}
              class={`w-6`}
              alt=""
            />
            <p class={`w-32 text-start text-xs xl:text-lg`}>
              {waketime.name}
            </p>
            <progress
              class={`progress progress-primary w-4/5 xl:w-3/5 text-primary border-0 bg-base-300`}
              value={waketime.percent}
              max={maxPercent}
            ></progress>
            <p class="text-start text-xs xl:text-xl">{waketime.percent}%</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  <div class="mx-24 flex flex-col gap-16 items-center mt-6">
    <img
      class="w-[40rem] lg:w-[40rem]"
      src="https://github.com/watchakorn-18k/watchakorn-18k/raw/main/github-metrics.svg"
      alt="metrics"
    />
  </div>
</div>
