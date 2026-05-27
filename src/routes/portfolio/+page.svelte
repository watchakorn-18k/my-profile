<script lang="ts">
  import portfolios from "$lib/portfolio.json";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  let container: HTMLElement;

  onMount(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });
      heroTl
        .from(".port-tag", { y: 30, autoAlpha: 0 })
        .from(".port-title", { y: 50, autoAlpha: 0, duration: 0.8 }, "-=0.4")
        .from(".port-desc", { y: 30, autoAlpha: 0 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>(".port-item").forEach((el, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
          defaults: { duration: 0.6, ease: "power2.out" },
        });

        tl.from(el.querySelector(".port-number"), { x: -30, autoAlpha: 0 })
          .from(el.querySelector(".port-image"), { y: 40, autoAlpha: 0, duration: 0.7 }, "-=0.4")
          .from(el.querySelector(".port-info"), { y: 30, autoAlpha: 0 }, "-=0.4");
      });

      gsap.utils.toArray<HTMLElement>(".section-border-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power2.inOut",
        });
      });
    }, container);

    return () => ctx.revert();
  });
</script>

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="port-tag tag-bracket mb-6" style="visibility:hidden;">[ PORTFOLIO // {portfolios.length} PROJECTS ]</div>

    <h1 class="port-title heading-display text-3xl md:text-5xl mb-4" style="visibility:hidden;">
      SELECTED <span class="text-accent">WORK</span>
    </h1>

    <p class="port-desc text-muted text-sm max-w-lg mb-12" style="visibility:hidden;">
      Open-source projects, tools, and experiments across Python, Go, JavaScript, and more.
    </p>
  </div>

  <div class="section-border-anim section-border" />

  <div class="py-8">
    {#each portfolios as port, index}
      <article class="port-item grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8 border-b border-border">
        <div class="lg:col-span-1 flex items-start">
          <span class="port-number heading-display text-2xl md:text-3xl text-border" style="visibility:hidden;">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div class="lg:col-span-5 port-image" style="visibility:hidden;">
          <div class="aspect-video overflow-hidden border border-border bg-surface">
            <img
              src={port.image}
              alt="{port.name} project screenshot"
              class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
        </div>

        <div class="lg:col-span-6 port-info flex flex-col justify-between" style="visibility:hidden;">
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
