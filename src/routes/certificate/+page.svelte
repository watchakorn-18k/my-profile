<script lang="ts">
  import certificates from "$lib/certificate.json";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  let container: HTMLElement;

  onMount(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });
      heroTl
        .from(".cert-tag", { y: 30, autoAlpha: 0 })
        .from(".cert-title", { y: 50, autoAlpha: 0, duration: 0.8 }, "-=0.4")
        .from(".cert-desc", { y: 30, autoAlpha: 0 }, "-=0.4")
        .from(".cert-count", { scale: 0.5, autoAlpha: 0, duration: 0.5 }, "-=0.3");

      gsap.utils.toArray<HTMLElement>(".section-border-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power2.inOut",
        });
      });

      ScrollTrigger.batch(".cert-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 50,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
          });
        },
        start: "top 88%",
        once: true,
      });

      gsap.utils.toArray<HTMLElement>(".cert-img").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scale: 0.92, autoAlpha: 0, duration: 0.5, ease: "power2.out",
        });
      });
    }, container);

    return () => ctx.revert();
  });
</script>

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
      <div>
        <div class="cert-tag tag-bracket mb-6" style="visibility:hidden;">
          [ CERTIFICATIONS // {certificates.length} ITEMS ]
        </div>
        <h1 class="cert-title heading-display text-3xl md:text-5xl mb-4" style="visibility:hidden;">
          CERTIFICATES <span class="text-accent">&</span><br class="hidden md:block" /> CREDENTIALS
        </h1>
        <p class="cert-desc text-muted text-sm max-w-md" style="visibility:hidden;">
          Professional certifications in programming, cloud, and software development.
        </p>
      </div>
      <div class="cert-count flex-shrink-0 mb-1" style="visibility:hidden;">
        <div class="heading-display text-6xl md:text-8xl text-accent leading-none">
          {certificates.length}
        </div>
        <div class="tag-bracket mt-1">TOTAL CERTS</div>
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border" />

  <div class="py-12 md:py-16">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
      {#each certificates as cert, i}
        <div class="cert-card bg-substrate group" style="visibility:hidden;">
          <div class="p-5 md:p-6 h-full flex flex-col">
            <div class="flex items-baseline gap-3 mb-4">
              <span class="heading-display text-lg text-border/40 tabular-nums shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 class="text-[11px] font-bold uppercase tracking-wider leading-snug line-clamp-2">
                {cert.name}
              </h2>
            </div>
            <div class="cert-img mt-auto aspect-[4/3] overflow-hidden border border-border bg-surface" style="visibility:hidden;">
              <img
                src="https://raw.githubusercontent.com/watchakorn-18k/my-profile/master/static/certificate/{cert.image_url}"
                alt="{cert.name}"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
