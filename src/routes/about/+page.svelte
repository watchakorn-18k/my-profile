<script lang="ts">
  import { onMount } from "svelte";
  import { fetchData } from "$lib/waketime";

  let waketimes: any[] = [];
  let maxPercentData: number = 0;
  let visible = false;

  onMount(async () => {
    visible = true;
    try {
      const resp = await fetchData();
      waketimes = resp.data;
      maxPercentData = waketimes[0]?.percent ?? 0;
    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  });

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
</script>

<section class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24">
    <div class="tag-bracket mb-6 fade-up">[ ABOUT // PROFILE ]</div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 fade-up fade-up-delay-1">
      <div class="lg:col-span-2">
        <h1 class="heading-display text-3xl md:text-5xl mb-6">
          WATCHAKORN<br />BUDDEEWONG
        </h1>
        <div class="accent-line mb-6" />
        <p class="text-muted text-sm leading-relaxed max-w-lg mb-6">
          Full stack software developer based in Thailand. Building scalable backend services,
          mobile applications, and web platforms. Experienced in leading small teams, designing
          system architecture, and shipping products from concept to production.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="mailto:{links.email}" class="btn-primary">EMAIL ↗</a>
          <a href={links.github} target="_blank" rel="noopener noreferrer" class="btn-outline">GITHUB ↗</a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" class="btn-outline">LINKEDIN ↗</a>
        </div>
      </div>

      <div class="border border-border p-6">
        <div class="tag-bracket mb-4">[ QUICK REF ]</div>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted">LOCATION</span>
            <span>NAKHON RATCHASIMA, TH</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted">STATUS</span>
            <span class="text-accent">EMPLOYED</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted">FOCUS</span>
            <span>FULL STACK</span>
          </div>
          <div class="flex justify-between border-b border-border pb-2">
            <span class="text-muted">TYPING</span>
            <span>36 WPM / 90% ACC</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">EMAIL</span>
            <span>{links.email}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-border" />

  <div class="py-16 md:py-24">
    <div class="tag-bracket mb-8 fade-up">[ TECHNICAL SKILLS ]</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 fade-up fade-up-delay-1">
      {#each skillGroups as group, i}
        <div class="card-industrial p-5" style="animation-delay: {i * 0.05}s">
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

  <div class="section-border" />

  <div class="py-16 md:py-24">
    <div class="tag-bracket mb-8 fade-up">[ EXPERIENCE ]</div>

    {#each experience as exp, i}
      <div class="mb-16 last:mb-0 fade-up" style="animation-delay: {i * 0.15}s">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
          <div class="lg:col-span-1">
            <div class="text-accent text-[10px] font-bold tracking-widest mb-2">
              {exp.period}
            </div>
            <div class="tag-bracket mb-1">{exp.location}</div>
            <div class="text-xs font-bold mt-3">{exp.role}</div>
          </div>

          <div class="lg:col-span-3">
            <h3 class="heading-display text-xl md:text-2xl mb-4">
              {exp.company}
            </h3>
            <div class="accent-line mb-6" />

            <ul class="space-y-2 mb-6">
              {#each exp.highlights as highlight}
                <li class="text-muted text-xs leading-relaxed flex gap-2">
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
    <div class="section-border" />

    <div class="py-16 md:py-24">
      <div class="tag-bracket mb-8 fade-up">[ CODING ACTIVITY // LAST 30 DAYS ]</div>

      <div class="space-y-2 fade-up fade-up-delay-1">
        {#each waketimes as wt}
          {#if wt.percent > 0}
            <div class="grid grid-cols-12 gap-3 items-center text-xs">
              <div class="col-span-2 md:col-span-1 text-right text-muted truncate">
                {wt.name}
              </div>
              <div class="col-span-8 md:col-span-10">
                <div class="w-full bg-surface h-2">
                  <div
                    class="bg-accent h-2 transition-all duration-500"
                    style="width: {wt.percent}%"
                  />
                </div>
              </div>
              <div class="col-span-2 md:col-span-1 text-muted text-right">
                {wt.percent}%
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</section>
