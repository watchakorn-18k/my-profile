<script lang="ts">
  import certificates from "$lib/certificate.json";
</script>

<div class="text-center font-mono m-14">
  <h1 class="text-3xl">My Certificate 🎑</h1>
</div>

<div
  class="flex flex-wrap justify-center items-center gap-10 font-mono h-auto my-16"
>
  {#each certificates as cert (cert.id)}
    <div
      class="card w-11/12 xl:w-2/6 xl:h-auto bg-base-100 border border-neutral hover:border-neutral-content ease-in-out transition-all duration-500 shadow-xl hover:bg-base-200"
    >
      <div class="card-body">
        <h2 class="card-title xl:text-3xl my-2">{cert.id + 1}.{cert.name}</h2>
        <img
          class="rounded border border-neutral hover:filter hover:saturate-150 hover:shadow-base-100 shadow-xl ease-in-out transition-all duration-500 object-cover h-auto w-full"
          src=https://raw.githubusercontent.com/watchakorn-18k/my-profile/master/static/certificate/{cert.image_url}
        />
      </div>
    </div>
  {/each}
</div>
