<script lang="ts">
  import portfolios from "$lib/portfolio.json";
  import { onMount } from "svelte";

  let visible = false;
  onMount(() => { visible = true; });
</script>

<section class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="tag-bracket mb-6 fade-up">[ PORTFOLIO // {portfolios.length} PROJECTS ]</div>

    <h1 class="heading-display text-3xl md:text-5xl mb-4 fade-up fade-up-delay-1">
      SELECTED <span class="text-accent">WORK</span>
    </h1>

    <p class="text-muted text-sm max-w-lg mb-12 fade-up fade-up-delay-2">
      Open-source projects, tools, and experiments across Python, Go, JavaScript, and more.
    </p>
  </div>

  <div class="section-border" />

  <div class="py-8">
    {#each portfolios as port, index}
      <article
        class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8 border-b border-border fade-up"
        style="animation-delay: {index * 0.06}s"
      >
        <div class="lg:col-span-1 flex items-start">
          <span class="heading-display text-2xl md:text-3xl text-border">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div class="lg:col-span-5">
          <div class="aspect-video overflow-hidden border border-border bg-surface">
            <img
              src={port.image}
              alt="{port.name} project screenshot"
              class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
        </div>

        <div class="lg:col-span-6 flex flex-col justify-between">
          <div>
            <h2 class="heading-display text-lg md:text-xl mb-3">
              {port.name}
            </h2>
            <p class="text-muted text-xs leading-relaxed mb-4 max-w-md">
              {port.desc}
            </p>
            <div class="flex flex-wrap gap-1.5 mb-4">
              {#each port.tag as tag}
                <span class="text-[10px] uppercase tracking-wider border border-border px-2 py-1 text-muted">
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <div>
            <a
              href={port.url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline text-[10px]"
            >
              SOURCE CODE ↗
            </a>
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>
