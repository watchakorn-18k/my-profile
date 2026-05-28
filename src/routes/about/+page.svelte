<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fetchData } from "$lib/waketime";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  let waketimes: any[] = [];
  let maxPercentData: number = 0;
  let container: HTMLElement;

  const experience = [
    {
      company: "FAKDUAI LOGISTICS & DIGITAL PLATFORM CO., LTD.",
      role: "Software Developer (Full Stack)",
      period: "JAN 2025 - PRESENT",
      location: "NAKHON RATCHASIMA, TH // REMOTE",
      highlights: [
        "Lead developer, architect, and coordinator for Pinto social media super app and mobile POS system",
        "Designed project architecture from ground up: Clean Architecture, database schema, real-time event flows, tech stack decisions",
        "Built and published Pinto app to App Store and Google Play: rich text editor, real-time chat, discovery/search, notifications, identity verification",
        "Designed user-created chatbot system with webhook integration for n8n automation workflows",
        "Shipped mobile POS with Flutter + BLoC: real-time order processing, inventory sync, logistics workflow",
        "Backend services with Go (Echo) + Clean Architecture: content feeds, media processing, event-driven logic",
        "SSR frontend with Vue.js + Nuxt.js for web portals and community pages",
        "Multi-database stack: PostgreSQL (Atlas migrations), MongoDB, Redis pub/sub + caching",
        "JWT authentication, GCP storage middleware, Docker/Podman with zero-downtime deploys",
        "Jenkins CI/CD pipelines with Git-flow on Bitbucket",
      ],
      stack: ["Go", "Echo", "Flutter", "Vue.js", "Nuxt.js", "PostgreSQL", "MongoDB", "Redis", "Docker", "Jenkins"],
    },
    {
      company: "IBOTNOI",
      role: "Software Developer (Backend)",
      period: "JUN 2024 - DEC 2024",
      location: "BANGKOK, TH // REMOTE",
      highlights: [
        "Engineered bulk user onboarding for nationwide educational personnel: 5,000 registrations/day via AWS SQS (2.5x improvement)",
        "Led migration from Python to Go (Fiber): >50% reduction in server crashes under high load",
        "Async worker with Go + AWS SES for email verification and Firebase Admin SDK for account creation, 90% success rate",
        "Real-time notification system with Redis (Garnet) pub/sub and AWS SQS: 20% increase in package purchases",
        "Load testing with Locust: reduced server crash risk by 80% in stress scenarios",
        "RESTful APIs with Go Fiber and FastAPI (Python) in Clean Architecture",
        "Integrated Stripe payments, JWT + 2FA authentication, custom transaction flows",
        "MongoDB Atlas clusters, Redis caching/queuing, Docker containers, Jenkins CI/CD with Git-flow",
      ],
      stack: ["Go", "Fiber", "FastAPI", "AWS SQS", "AWS SES", "Redis", "MongoDB", "Stripe", "Docker", "Locust"],
    },
  ];

  const skillGroups = [
    { label: "LANGUAGES", items: ["Python", "Go", "JavaScript", "TypeScript", "Dart"] },
    { label: "BACKEND", items: ["FastAPI", "Django", "Fiber", "Echo"] },
    { label: "FRONTEND", items: ["React", "Svelte", "Vue", "Nuxt", "Flutter"] },
    { label: "STYLING", items: ["TailwindCSS", "DaisyUI", "Vuetify"] },
    { label: "DATABASES", items: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Supabase"] },
    { label: "CLOUD / STORAGE", items: ["AWS S3", "AWS SQS", "AWS SES", "GCP", "Firebase"] },
    { label: "DEVOPS", items: ["Docker", "Podman", "Jenkins", "GitHub Actions", "Git-flow"] },
    { label: "TESTING", items: ["Unit Tests", "Integration Tests", "Locust"] },
    { label: "ARCHITECTURE", items: ["Clean Architecture", "Microservices", "MVC", "Flutter BLoC"] },
  ];

  const links = {
    github: "https://github.com/watchakorn-18k/",
    linkedin: "https://www.linkedin.com/in/watchakorn/",
    email: "wk18k@proton.me",
  };

  onMount(() => {
    fetchData()
      .then(async (resp) => {
        waketimes = resp.data;
        maxPercentData = waketimes[0]?.percent ?? 0;
        await tick();
        gsap.to(".waka-fill", {
          width: (_, target: HTMLElement) => `${target.dataset.percent}%`,
          duration: 1,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".waka-section", start: "top 80%", once: true },
        });
        ScrollTrigger.refresh();
      })
      .catch((error) => {
        console.error("Error in fetchData:", error);
      });

    const ctx = gsap.context(() => {
      gsap.set(".skill-group, .waka-bar", { autoAlpha: 0 });

      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });
      heroTl
        .from(".about-tag", { y: 30, autoAlpha: 0 })
        .from(".about-name", { y: 50, autoAlpha: 0, duration: 0.8 }, "-=0.4")
        .from(".about-desc", { y: 30, autoAlpha: 0 }, "-=0.4")
        .from(".about-links a", { y: 15, autoAlpha: 0, stagger: 0.08 }, "-=0.3")
        .from(".quick-ref", { x: 40, autoAlpha: 0, duration: 0.6 }, "-=0.6");

      gsap.from(".skills-tag", {
        scrollTrigger: { trigger: ".skills-section", start: "top 80%", once: true },
        y: 30, autoAlpha: 0, duration: 0.6, ease: "power2.out",
      });

      ScrollTrigger.batch(".skill-group", {
        onEnter: (elements) => {
          gsap.to(elements, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" });
        },
        start: "top 90%",
        once: true,
      });

      gsap.set(".skill-group", { y: 40 });

      gsap.from(".exp-tag", {
        scrollTrigger: { trigger: ".exp-section", start: "top 80%", once: true },
        y: 30, autoAlpha: 0, duration: 0.6, ease: "power2.out",
      });

      gsap.utils.toArray<HTMLElement>(".exp-block").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          y: 50, autoAlpha: 0, duration: 0.7, delay: i * 0.15, ease: "power3.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".exp-highlight").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          x: -20, autoAlpha: 0, duration: 0.4, ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".accent-line-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          scaleX: 0, transformOrigin: "left center", duration: 0.6, ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".section-border-anim").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power2.inOut",
        });
      });

      if (waketimes.length > 0) {
        gsap.from(".waka-tag", {
          scrollTrigger: { trigger: ".waka-section", start: "top 80%", once: true },
          y: 30, autoAlpha: 0, duration: 0.6, ease: "power2.out",
        });

        ScrollTrigger.batch(".waka-bar", {
          onEnter: (elements) => {
            gsap.from(elements, { x: -30, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" });
          },
          start: "top 90%",
          once: true,
        });
      }
    }, container);

    return () => ctx.revert();
  });
</script>

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="about-tag tag-bracket mb-6">[ ABOUT // PROFILE ]</div>

    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
      <div class="lg:col-span-2 min-w-0">
        <h1 class="about-name heading-display safe-wrap text-3xl md:text-5xl mb-6">
          WATCHAKORN<br />BUDDEEWONG
        </h1>
        <div class="accent-line-anim accent-line mb-6" />
        <p class="about-desc text-muted text-sm leading-relaxed max-w-lg mb-6">
          Full stack software developer based in Thailand. Building scalable backend services,
          mobile applications, and web platforms. Experienced in leading small teams, designing
          system architecture, and shipping products from concept to production.
        </p>
        <div class="about-links flex flex-wrap gap-3">
          <a href="mailto:{links.email}" class="btn-primary">EMAIL ↗</a>
          <a href={links.github} target="_blank" rel="noopener noreferrer" class="btn-outline">GITHUB ↗</a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" class="btn-outline">LINKEDIN ↗</a>
        </div>
      </div>

      <div class="quick-ref min-w-0 border border-border p-5 md:p-6">
        <div class="tag-bracket mb-4">[ QUICK REF ]</div>
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-border pb-2">
            <span class="text-muted">LOCATION</span>
            <span class="text-right safe-wrap">NAKHON RATCHASIMA, TH</span>
          </div>
          <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-border pb-2">
            <span class="text-muted">STATUS</span>
            <span class="text-right text-accent safe-wrap">EMPLOYED</span>
          </div>
          <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-border pb-2">
            <span class="text-muted">FOCUS</span>
            <span class="text-right safe-wrap">FULL STACK</span>
          </div>
          <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-border pb-2">
            <span class="text-muted">TYPING</span>
            <span class="text-right safe-wrap">36 WPM / 90% ACC</span>
          </div>
          <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
            <span class="text-muted">EMAIL</span>
            <span class="text-right safe-wrap">{links.email}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border" />

  <div class="skills-section py-16 md:py-24">
    <div class="skills-tag tag-bracket mb-8">[ TECHNICAL SKILLS ]</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {#each skillGroups as group}
        <div class="skill-group card-industrial p-5">
          <div class="text-accent text-[10px] font-bold tracking-widest mb-3">
            {group.label}
          </div>
          <div class="flex flex-wrap gap-1.5">
            {#each group.items as item}
              <span class="text-[10px] uppercase tracking-wider bg-surface px-2 py-1 text-muted">
                {item}
              </span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="section-border-anim section-border" />

  <div class="exp-section py-16 md:py-24">
    <div class="exp-tag tag-bracket mb-8">[ EXPERIENCE ]</div>

    {#each experience as exp, i}
      <div class="exp-block mb-16 last:mb-0">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
          <div class="lg:col-span-1">
            <div class="text-accent text-[10px] font-bold tracking-widest mb-2">
              {exp.period}
            </div>
            <div class="tag-bracket mb-1">{exp.location}</div>
            <div class="text-xs font-bold mt-3">{exp.role}</div>
          </div>

          <div class="lg:col-span-3">
            <h3 class="heading-display safe-wrap text-xl md:text-2xl mb-4">
              {exp.company}
            </h3>
            <div class="accent-line-anim accent-line mb-6" />

            <ul class="space-y-2 mb-6">
              {#each exp.highlights as highlight}
                <li class="exp-highlight text-muted text-xs leading-relaxed flex gap-2">
                  <span class="text-accent mt-0.5 shrink-0">///</span>
                  <span>{highlight}</span>
                </li>
              {/each}
            </ul>

            <div class="flex flex-wrap gap-1.5">
              {#each exp.stack as tech}
                <span class="text-[10px] uppercase tracking-wider border border-border px-2 py-1 text-muted">
                  {tech}
                </span>
              {/each}
            </div>
          </div>
        </div>

        {#if i < experience.length - 1}
          <hr class="border-border mt-16" />
        {/if}
      </div>
    {/each}
  </div>

  {#if waketimes.length > 0}
    <div class="section-border-anim section-border" />

    <div class="waka-section py-16 md:py-24">
      <div class="waka-tag tag-bracket mb-8">[ CODING ACTIVITY // LAST 30 DAYS ]</div>

      <div class="space-y-2">
        {#each waketimes as wt}
          {#if wt.percent > 0}
            <div class="waka-bar grid grid-cols-[56px_minmax(0,1fr)_48px] md:grid-cols-[72px_minmax(0,1fr)_56px] gap-2 md:gap-3 items-center text-xs">
              <div class="min-w-0 text-right text-muted truncate">
                {wt.name}
              </div>
              <div class="min-w-0">
                <div class="w-full bg-surface h-2">
                  <div
                    class="waka-fill bg-accent h-2"
                    data-percent={wt.percent}
                    style="width: 0%"
                  />
                </div>
              </div>
              <div class="text-muted text-right">
                {wt.percent}%
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</section>
