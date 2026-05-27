<script lang="ts">
  import resume from "$lib/assets/my_resume.pdf";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  let container: HTMLElement;

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = "resume_watchakorn_buddeewong.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const skills = [
    { category: "LANG", items: "Golang, Dart, TypeScript, Python, JavaScript" },
    { category: "BACKEND", items: "Golang, Echo, Fiber, FastAPI, Django" },
    { category: "FRONTEND", items: "Flutter, Vue, Nuxt, Svelte, React" },
    { category: "DATA", items: "PostgreSQL, MongoDB, Redis, MySQL" },
    { category: "INFRA", items: "Docker, Podman, Jenkins, GitHub Actions" },
  ];

  const careerStartYear = 2024;
  const yearsExperience = `${new Date().getFullYear() - careerStartYear}+`;

  const stats = [
    { value: yearsExperience, label: "YRS EXP" },
    { value: "5", label: "LANGUAGES" },
    { value: "25+", label: "PROJECTS" },
    { value: "20", label: "CERTS" },
  ];

  const stackSignals = [
    { layer: "MOBILE", signal: "Flutter + Dart production apps", status: "APP STORE READY" },
    { layer: "WEB", signal: "Vue / Nuxt / Svelte interfaces", status: "PIXEL PUSHED" },
    { layer: "API", signal: "Golang services with Echo/Fiber", status: "LATENCY HUNTED" },
    { layer: "SHIP", signal: "Docker + CI/CD + cloud storage", status: "DEPLOY SURVIVED" },
  ];

  onMount(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });

      heroTl
        .from(".hero-tag", { y: 30, autoAlpha: 0 })
        .from(".hero-name", { y: 60, autoAlpha: 0, duration: 0.9 }, "-=0.4")
        .from(".hero-accent", { y: 60, autoAlpha: 0, duration: 0.9 }, "-=0.7")
        .from(".hero-portrait", { x: 48, autoAlpha: 0, duration: 0.8 }, "-=0.7")
        .from(".hero-desc", { y: 30, autoAlpha: 0 }, "-=0.5")
        .from(".hero-buttons a, .hero-buttons button", { y: 20, autoAlpha: 0, stagger: 0.1 }, "-=0.3")
        .from(".developer-console", { y: 24, autoAlpha: 0 }, "-=0.2")
        .from(".console-row", { x: -16, autoAlpha: 0, stagger: 0.08 }, "-=0.1");

      ScrollTrigger.batch(".stat-item", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          });
        },
        start: "top 85%",
        once: true,
      });

      gsap.from(".skills-title", {
        scrollTrigger: {
          trigger: ".skills-section",
          start: "top 80%",
          once: true,
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      ScrollTrigger.batch(".skill-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          });
        },
        start: "top 85%",
        once: true,
      });

      gsap.from(".role-left", {
        scrollTrigger: {
          trigger: ".roles-section",
          start: "top 75%",
          once: true,
        },
        x: -50,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".role-right", {
        scrollTrigger: {
          trigger: ".roles-section",
          start: "top 75%",
          once: true,
        },
        x: 50,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".accent-line-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".section-border-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power2.inOut",
        });
      });

    }, container);

    return () => ctx.revert();
  });
</script>

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 py-16 md:py-24 lg:py-32 items-start">
    <div>
      <div class="hero-tag tag-bracket mb-6" style="visibility:hidden;">
        [ RESUME // FULL STACK DEVELOPER // FLUTTER + VUE + GOLANG ]
      </div>

      <h1 class="heading-display text-4xl md:text-6xl lg:text-8xl mb-8">
        <span class="hero-name inline-block" style="visibility:hidden;">WATCHAKORN</span><br />
        <span class="hero-accent text-accent inline-block" style="visibility:hidden;">BUDDEEWONG</span>
      </h1>

      <div class="hero-desc max-w-xl mb-10" style="visibility:hidden;">
        <p class="text-muted text-sm leading-relaxed">
          Full stack developer resume snapshot: Flutter mobile apps, Vue/Nuxt web platforms,
          and Golang backend services. Currently lead developer at Fakduai, architecting
          social media and POS systems from UI to API to deployment.
        </p>
      </div>

      <div class="hero-buttons flex flex-wrap gap-3 mb-10">
        <a href="mailto:wk18k@proton.me" class="btn-primary" style="visibility:hidden;">
          CONTACT ↗
        </a>
        <button on:click={downloadFile} class="btn-outline" style="visibility:hidden;">
          DOWNLOAD CV
        </button>
      </div>

      <div class="developer-console card-industrial max-w-2xl p-4 md:p-5" style="visibility:hidden;">
        <div class="tag-bracket mb-3">[ RESUME STACK // MOBILE + WEB + BACKEND ]</div>
        {#each stackSignals as item}
          <div class="console-row grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr_140px] gap-3 border-t border-border py-3">
            <div class="text-accent text-[10px] font-bold tracking-widest">{item.layer}</div>
            <div class="text-xs text-muted">{item.signal}</div>
            <div class="hidden md:block text-xs text-muted text-right">{item.status}</div>
          </div>
        {/each}
        <div class="border-t border-border pt-3 text-[10px] uppercase tracking-widest text-muted">
          &gt; flutter clients, vue dashboards, golang APIs — one resume, full pipeline
        </div>
      </div>
    </div>

    <figure class="hero-portrait card-industrial p-3" style="visibility:hidden;">
      <img
        src="{base}/profile.png"
        alt="Watchakorn Buddeewong speaking with a microphone"
        class="aspect-[4/5] w-full object-cover"
      />
      <figcaption class="tag-bracket border-t border-border pt-3 mt-3">
        [ WATCHAKORN // FULL STACK DEVELOPER ]
      </figcaption>
    </figure>
  </div>

  <div class="section-border-anim section-border" />

  <div class="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-border">
    {#each stats as stat, i}
      <div class="stat-item p-6 md:p-8 {i < stats.length - 1 ? 'border-r border-border' : ''}" style="visibility:hidden;">
        <div class="heading-display text-3xl md:text-5xl text-accent mb-2">
          {stat.value}
        </div>
        <div class="tag-bracket">
          {stat.label}
        </div>
      </div>
    {/each}
  </div>

  <div class="skills-section py-16 md:py-24">
    <div class="skills-title tag-bracket mb-8" style="visibility:hidden;">[ TECHNICAL STACK ]</div>
    <div class="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-0 border border-border">
      <div class="skill-card p-6 md:p-8 lg:border-r border-border bg-substrate" style="visibility:hidden;">
        <div class="tag-bracket mb-6">[ OPERATING LAYERS ]</div>
        <div class="space-y-4">
          {#each stackSignals as signal}
            <div class="grid grid-cols-[3rem_1fr] gap-4 border-t border-border pt-4">
              <div class="text-accent text-[10px] font-bold tracking-widest">{signal.layer}</div>
              <div>
                <div class="text-xs font-bold uppercase tracking-wider text-ink">{signal.signal}</div>
                <div class="text-[10px] uppercase tracking-widest text-muted mt-1">{signal.status}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2">
        {#each skills as skill}
          <div class="skill-card p-6 border-t border-border sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(odd)]:border-r" style="visibility:hidden;">
            <div class="text-accent text-[10px] font-bold tracking-widest mb-3">
              {skill.category}
            </div>
            <div class="text-xs text-muted leading-relaxed">
              {skill.items}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border" />

  <div class="roles-section py-16 md:py-24">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      <div class="role-left" style="visibility:hidden;">
        <div class="tag-bracket mb-4">[ CURRENT ROLE // 2026 ]</div>
        <h2 class="heading-display text-2xl md:text-3xl mb-4">
          FAKDUAI LOGISTICS<br/>& DIGITAL PLATFORM
        </h2>
        <div class="accent-line-anim accent-line mb-6" />
        <p class="text-muted text-xs leading-relaxed">
          Lead developer and architect for Pinto social media super app and mobile POS system.
          Designed full project architecture, mentored juniors, shipped to both App Store
          and Google Play. Built with Go (Echo), Flutter BLoC, Vue/Nuxt, PostgreSQL, MongoDB, Redis.
        </p>
      </div>
      <div class="role-right" style="visibility:hidden;">
        <div class="tag-bracket mb-4">[ PREVIOUS // JUN-DEC 2024 ]</div>
        <h2 class="heading-display text-2xl md:text-3xl mb-4">
          IBOTNOI
        </h2>
        <div class="accent-line-anim accent-line mb-6" />
        <p class="text-muted text-xs leading-relaxed">
          Backend developer on large-scale educational platform with millions of users.
          Migrated Python services to Go (Fiber) reducing crashes by 50%.
          Engineered bulk onboarding processing 5,000 registrations/day via AWS SQS.
        </p>
      </div>
    </div>
  </div>
</section>
