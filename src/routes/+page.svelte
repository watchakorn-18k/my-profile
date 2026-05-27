<script lang="ts">
  import resume from "$lib/assets/my_resume.pdf";
  import { onMount } from "svelte";

  let visible = false;

  onMount(() => {
    visible = true;
  });

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
</script>

<section class="max-w-content mx-auto px-4 md:px-8">
  <div class="py-16 md:py-24 lg:py-32" class:fade-up={visible}>
    <div class="tag-bracket mb-6 fade-up" class:fade-up-delay-1={visible}>
      [ FULL STACK DEVELOPER // NONTHABURI, TH ]
    </div>

    <h1 class="heading-display text-4xl md:text-6xl lg:text-8xl mb-8 fade-up" class:fade-up-delay-1={visible}>
      WATCHAKORN<br />
      <span class="text-accent">BUDDEEWONG</span>
    </h1>

    <div class="max-w-xl mb-10 fade-up" class:fade-up-delay-2={visible}>
      <p class="text-muted text-sm leading-relaxed">
        Software developer building scalable backend services, mobile apps, and web platforms.
        Currently lead developer at Fakduai, architecting social media and POS systems
        with Go, Flutter, and Vue.
      </p>
    </div>

    <div class="flex flex-wrap gap-3 mb-16 fade-up" class:fade-up-delay-3={visible}>
      <a href="mailto:wk18k@proton.me" class="btn-primary">
        CONTACT ↗
      </a>
      <button on:click={downloadFile} class="btn-outline">
        DOWNLOAD CV
      </button>
    </div>
  </div>

  <div class="section-border" />

  <div class="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-border fade-up" class:fade-up-delay-3={visible}>
    {#each stats as stat, i}
      <div class="p-6 md:p-8 {i < stats.length - 1 ? 'border-r border-border' : ''}">
        <div class="heading-display text-3xl md:text-5xl text-accent mb-2">
          {stat.value}
        </div>
        <div class="tag-bracket">
          {stat.label}
        </div>
      </div>
    {/each}
  </div>

  <div class="py-16 md:py-24">
    <div class="tag-bracket mb-8">[ TECHNICAL STACK ]</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {#each skills as skill, i}
        <div class="card-industrial p-6 fade-up" style="animation-delay: {i * 0.08}s">
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

  <div class="section-border" />

  <div class="py-16 md:py-24">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      <div>
        <div class="tag-bracket mb-4">[ CURRENT ROLE // 2025 ]</div>
        <h2 class="heading-display text-2xl md:text-3xl mb-4">
          FAKDUAI LOGISTICS<br/>& DIGITAL PLATFORM
        </h2>
        <div class="accent-line mb-6" />
        <p class="text-muted text-xs leading-relaxed">
          Lead developer and architect for Pinto social media super app and mobile POS system.
          Designed full project architecture, mentored juniors, shipped to both App Store
          and Google Play. Built with Go (Echo), Flutter BLoC, Vue/Nuxt, PostgreSQL, MongoDB, Redis.
        </p>
      </div>
      <div>
        <div class="tag-bracket mb-4">[ PREVIOUS // JUN-DEC 2024 ]</div>
        <h2 class="heading-display text-2xl md:text-3xl mb-4">
          IBOTNOI
        </h2>
        <div class="accent-line mb-6" />
        <p class="text-muted text-xs leading-relaxed">
          Backend developer on large-scale educational platform with millions of users.
          Migrated Python services to Go (Fiber) reducing crashes by 50%.
          Engineered bulk onboarding processing 5,000 registrations/day via AWS SQS.
        </p>
      </div>
    </div>
  </div>
</section>
