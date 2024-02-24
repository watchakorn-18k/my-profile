<script lang="ts">
  import portfolios from "$lib/portfolio.json";
</script>

<div class="text-center font-mono m-14">
  <h1 class="text-3xl">My Portfolio 📃</h1>
</div>

<div
  class="flex flex-wrap justify-center items-center gap-10 font-mono h-auto my-16"
>
  {#each portfolios as port (port.id)}
    <div
      class="card w-11/12 xl:w-2/6 xl:h-[39rem] bg-base-100 border border-neutral hover:border-neutral-content ease-in-out transition-all duration-500 shadow-xl hover:bg-base-200"
    >
      <div class="card-body">
        <h2 class="card-title xl:text-3xl my-2">{port.id + 1}.{port.name}</h2>
        <img
          class="rounded border border-neutral hover:filter hover:saturate-150 hover:shadow-base-100 shadow-xl ease-in-out transition-all duration-500 object-cover h-64 w-full"
          src={port.image}
        />
        <p class="my-2 bg-base-300 border border-neutral p-4 rounded">
          {port.desc}
        </p>
        <div class="card-actions justify-end">
          <div class="flex gap-2 items-center justify-between w-full">
            <div class="flex gap-2 flex-wrap">
              {#each port.tag as tag}
                <div class="badge badge-primary font-mono p-4 text-xs">
                  {tag}
                </div>
              {/each}
            </div>

            <a
              href={port.url}
              class="btn btn-md font-mono border border-neutral">Source Code</a
            >
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
