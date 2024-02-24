<script lang="ts">
  import portfolios from "$lib/portfolio.json";
</script>

<div class="text-center font-mono mt-14">
  <h1 class="text-3xl">My Portfolio 📃</h1>
</div>

<div class="flex flex-col justify-center items-center gap-10 m-6 font-mono">
  {#each portfolios as port (port.id)}
    <div
      class="card w-11/12 xl:w-2/4 bg-base-100 border border-neutral hover:border-neutral-content ease-in-out transition-all duration-500 shadow-xl hover:bg-base-200"
    >
      <div class="card-body">
        <h2 class="card-title text-3xl my-2">{port.name}</h2>
        <img class="rounded border border-neutral" src={port.image} />
        <p class="my-2 bg-base-300 border border-neutral p-4 rounded">
          {port.desc}
        </p>
        <div class="card-actions justify-end">
          <a href={port.url} class="btn btn-md font-mono border border-neutral"
            >Source Code</a
          >
        </div>
      </div>
    </div>
  {/each}
</div>
