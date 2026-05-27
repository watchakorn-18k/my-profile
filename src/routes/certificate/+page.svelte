<script lang="ts">
  import certificates from "$lib/certificate.json";
  import { onMount } from "svelte";

  let visible = false;
  onMount(() => { visible = true; });
</script>

<section class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="tag-bracket mb-6 fade-up">[ CERTIFICATIONS // {certificates.length} ITEMS ]</div>

    <h1 class="heading-display text-3xl md:text-5xl mb-4 fade-up fade-up-delay-1">
      CERTIFICATES <span class="text-accent">&</span> CREDENTIALS
    </h1>

    <p class="text-muted text-sm max-w-lg mb-12 fade-up fade-up-delay-2">
      Professional certifications in programming, cloud, and software development.
    </p>
  </div>

  <div class="section-border" />

  <div class="py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
      {#each certificates as cert, i}
        <div
          class="card-industrial p-6 fade-up"
          style="animation-delay: {i * 0.05}s"
        >
          <div class="flex items-start gap-4">
            <span class="heading-display text-2xl text-border shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div class="flex-1 min-w-0">
              <h2 class="text-xs font-bold uppercase tracking-wider mb-3 leading-snug">
                {cert.name}
              </h2>
              <div class="aspect-video overflow-hidden border border-border bg-surface">
                <img
                  src="https://raw.githubusercontent.com/watchakorn-18k/my-profile/master/static/certificate/{cert.image_url}"
                  alt="{cert.name} certificate"
                  class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
