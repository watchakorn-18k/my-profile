<script lang="ts">
  import { onMount, tick } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  export let data;

  gsap.registerPlugin(ScrollTrigger);

  const batchSize = 6;

  let container: HTMLElement;
  let sentinel: HTMLElement;
  let visibleCount = batchSize;

  $: visibleRepos = data.repos.slice(0, visibleCount);
  $: hasMore = visibleCount < data.repos.length;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(value));

  const animateRepoItem = (el: HTMLElement) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
      defaults: { duration: 0.6, ease: "power2.out" },
    });

    tl.from(el.querySelector(".repo-number"), { x: -30, autoAlpha: 0 })
      .from(el.querySelector(".repo-image"), { y: 40, autoAlpha: 0, duration: 0.7 }, "-=0.4")
      .from(el.querySelector(".repo-info"), { y: 30, autoAlpha: 0 }, "-=0.4")
      .from(el.querySelector(".repo-meta"), { y: 20, autoAlpha: 0 }, "-=0.4");
  };

  onMount(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });
      heroTl
        .from(".repo-tag", { y: 30, autoAlpha: 0 })
        .from(".repo-title", { y: 50, autoAlpha: 0, duration: 0.8 }, "-=0.4")
        .from(".repo-desc", { y: 30, autoAlpha: 0 }, "-=0.4")
        .from(".repo-profile", { y: 30, autoAlpha: 0 }, "-=0.4")
        .from(".repo-count", { y: 30, autoAlpha: 0 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>(".repo-item").forEach(animateRepoItem);

      gsap.from(".section-border-anim", {
        scrollTrigger: { trigger: ".section-border-anim", start: "top 90%", once: true },
        scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power2.inOut",
      });
    }, container);

    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || !hasMore) return;

      const previousCount = visibleCount;
      visibleCount = Math.min(visibleCount + batchSize, data.repos.length);
      await tick();

      gsap.context(() => {
        gsap.utils
          .toArray<HTMLElement>(".repo-item")
          .slice(previousCount)
          .forEach(animateRepoItem);
        ScrollTrigger.refresh();
      }, container);
    }, { rootMargin: "300px" });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  });
</script>

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="repo-tag tag-bracket mb-6" style="visibility:hidden;">[ GITHUB // {data.repos.length} PUBLIC REPOS ]</div>

    <h1 class="repo-title heading-display text-3xl md:text-5xl mb-4" style="visibility:hidden;">
      PUBLIC <span class="text-accent">REPOSITORIES</span>
    </h1>

    <p class="repo-desc text-muted text-sm max-w-lg mb-8" style="visibility:hidden;">
      Public GitHub work from watchakorn-18k, sorted by latest activity and filtered to owned repositories.
    </p>

    {#if data.profile}
      <a
        href={data.profile.html_url}
        target="_blank"
        rel="noopener noreferrer"
        class="repo-profile inline-grid grid-cols-[72px_1fr] gap-4 items-center border-2 border-ink bg-surface p-4 mb-4 hover:bg-accent hover:text-white transition-colors"
        style="visibility:hidden;"
      >
        <img
          src={data.profile.avatar_url}
          alt="{data.profile.login} GitHub profile"
          class="w-[72px] h-[72px] border border-border object-cover grayscale"
          loading="lazy"
          decoding="async"
        />
        <div>
          <div class="tag-bracket mb-2">[ GITHUB PROFILE ]</div>
          <div class="heading-display text-lg md:text-xl">{data.profile.name ?? data.profile.login}</div>
          <div class="grid grid-cols-2 gap-2 mt-3 text-[10px] uppercase tracking-wider text-muted">
            <div>
              <span class="text-border">FOLLOWERS</span>
              <div class="heading-display text-lg text-ink">{data.profile.followers}</div>
            </div>
            <div>
              <span class="text-border">FOLLOWING</span>
              <div class="heading-display text-lg text-ink">{data.profile.following}</div>
            </div>
          </div>
        </div>
      </a>
    {/if}

    <div class="repo-count grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl" style="visibility:hidden;">
      <div class="border-2 border-ink bg-surface px-5 py-4">
        <div class="tag-bracket mb-2">[ TOTAL PUBLIC OWNED REPOS ]</div>
        <div class="heading-display text-4xl md:text-6xl text-accent leading-none">{data.repos.length}</div>
      </div>
      <a
        href="https://committers.top/thailand"
        target="_blank"
        rel="noopener noreferrer"
        class="block border-2 border-ink bg-surface px-5 py-4 hover:bg-accent hover:text-white transition-colors"
      >
        <div class="tag-bracket mb-2">[ COMMITTERS.TOP THAILAND ]</div>
        <div class="heading-display text-4xl md:text-6xl text-accent leading-none">#2</div>
        <div class="text-[10px] uppercase tracking-wider text-muted mt-2">15,850 CONTRIBUTIONS</div>
      </a>
    </div>
  </div>

  <div class="section-border-anim section-border" />

  <div class="py-8">
    {#each visibleRepos as repo, index}
      <article class="repo-item grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-8 border-b border-border">
        <div class="lg:col-span-1 flex items-start">
          <span class="repo-number heading-display text-2xl md:text-3xl text-border" style="visibility:hidden;">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div class="lg:col-span-4 repo-image" style="visibility:hidden;">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="block aspect-video overflow-hidden border border-border bg-surface"
          >
            <img
              src={repo.image_url}
              alt="{repo.name} repository preview"
              class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>

        <div class="lg:col-span-4 repo-info" style="visibility:hidden;">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <h2 class="heading-display text-lg md:text-xl">
              {repo.name}
            </h2>
            {#if repo.archived}
              <span class="text-[10px] uppercase tracking-wider border border-border px-2 py-1 text-muted">
                ARCHIVED
              </span>
            {/if}
          </div>

          <p class="text-muted text-xs leading-relaxed mb-4 max-w-xl">
            {repo.description}
          </p>

          <div class="flex flex-wrap gap-1.5 mb-4">
            {#if repo.language}
              <span class="text-[10px] uppercase tracking-wider border border-accent px-2 py-1 text-accent">
                {repo.language}
              </span>
            {/if}
            {#each repo.topics as topic}
              <span class="text-[10px] uppercase tracking-wider border border-border px-2 py-1 text-muted">
                {topic}
              </span>
            {/each}
          </div>

          <div class="flex flex-wrap gap-3">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline text-[10px]"
            >
              SOURCE CODE ↗
            </a>
            {#if repo.homepage}
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline text-[10px]"
              >
                LIVE SITE ↗
              </a>
            {/if}
          </div>
        </div>

        <div class="lg:col-span-3 repo-meta" style="visibility:hidden;">
          <div class="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-wider text-muted">
            <div class="border border-border p-3 bg-surface">
              <div class="text-border mb-1">STARS</div>
              <div class="heading-display text-lg text-ink">{repo.stargazers_count}</div>
            </div>
            <div class="border border-border p-3 bg-surface">
              <div class="text-border mb-1">UPDATED</div>
              <div class="heading-display text-sm text-ink">{formatDate(repo.updated_at)}</div>
            </div>
          </div>
        </div>
      </article>
    {/each}

    <div bind:this={sentinel} class="py-8 text-center">
      {#if hasMore}
        <span class="tag-bracket">[ LOADING MORE REPOS ]</span>
      {:else}
        <span class="tag-bracket">[ END OF PUBLIC REPOS ]</span>
      {/if}
    </div>
  </div>
</section>
