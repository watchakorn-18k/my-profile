<script lang="ts">
  import resume from "$lib/assets/my_resume.pdf";
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
    { category: "LANG", items: "Python, Go, TypeScript, Dart, JavaScript" },
    { category: "BACKEND", items: "FastAPI, Django, Fiber, Echo" },
    { category: "FRONTEND", items: "React, Svelte, Vue, Nuxt, Flutter" },
    { category: "DATA", items: "PostgreSQL, MongoDB, Redis, MySQL" },
    { category: "INFRA", items: "Docker, Podman, Jenkins, GitHub Actions" },
  ];

  const stats = [
    { value: "2+", label: "YRS EXP" },
    { value: "5", label: "LANGUAGES" },
    { value: "25+", label: "PROJECTS" },
    { value: "20", label: "CERTS" },
  ];

  onMount(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });

      heroTl
        .from(".hero-tag", { y: 30, autoAlpha: 0 })
        .from(".hero-name", { y: 60, autoAlpha: 0, duration: 0.9 }, "-=0.4")
        .from(".hero-accent", { y: 60, autoAlpha: 0, duration: 0.9 }, "-=0.7")
        .from(".hero-desc", { y: 30, autoAlpha: 0 }, "-=0.5")
        .from(".hero-buttons a, .hero-buttons button", { y: 20, autoAlpha: 0, stagger: 0.1 }, "-=0.3");

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
  <div class="py-16 md:py-24 lg:py-32">
    <div class="hero-tag tag-bracket mb-6" style="visibility:hidden;">
      [ FULL STACK DEVELOPER // NAKHON RATCHASIMA, TH ]
    </div>

    <h1 class="heading-display text-4xl md:text-6xl lg:text-8xl mb-8">
      <span class="hero-name inline-block" style="visibility:hidden;">WATCHAKORN</span><br />
      <span class="hero-accent text-accent inline-block" style="visibility:hidden;">BUDDEEWONG</span>
    </h1>

    <div class="hero-desc max-w-xl mb-10" style="visibility:hidden;">
      <p class="text-muted text-sm leading-relaxed">
        Software developer building scalable backend services, mobile apps, and web platforms.
        Currently lead developer at Fakduai, architecting social media and POS systems
        with Go, Flutter, and Vue.
      </p>
    </div>

    <div class="hero-buttons flex flex-wrap gap-3 mb-16">
      <a href="mailto:wk18k@proton.me" class="btn-primary" style="visibility:hidden;">
        CONTACT ↗
      </a>
      <button on:click={downloadFile} class="btn-outline" style="visibility:hidden;">
        DOWNLOAD CV
      </button>
    </div>
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {#each skills as skill}
        <div class="skill-card card-industrial p-6" style="visibility:hidden;">
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
