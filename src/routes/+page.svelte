<script lang="ts">
  import resume from "$lib/assets/my_resume.pdf";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  let container: HTMLElement;
  let profileVideo: HTMLVideoElement | null = null;
  let showProfileVideo = false;
  let videoCurrentTime = 0;
  let videoDuration = 0;
  let videoPlaying = false;
  let videoMuted = false;
  let wasmOsLoaded = false;
  let speechSupported = false;
  let isSpeaking = false;
  let preferredSpeechVoice: SpeechSynthesisVoice | null = null;

  const heroSpeechText = "Watchakorn Buddeewong. Full stack developer building Flutter mobile apps, Vue and Nuxt web platforms, and Golang backend services. Currently lead developer at Fakduai, architecting social media and POS systems from interface to API to deployment.";

  const selectPreferredSpeechVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const voices = window.speechSynthesis.getVoices();
    preferredSpeechVoice = voices.find((voice) => /male|daniel|david|alex|fred/i.test(voice.name) && voice.lang.startsWith("en"))
      ?? voices.find((voice) => voice.lang.startsWith("en"))
      ?? null;
  };

  const formatVideoTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  const toggleProfileVideo = () => {
    if (!profileVideo) return;
    if (profileVideo.paused) {
      profileVideo.play();
      videoPlaying = true;
      return;
    }
    profileVideo.pause();
    videoPlaying = false;
  };

  const seekProfileVideo = (event: Event) => {
    if (!profileVideo) return;
    const value = Number((event.target as HTMLInputElement).value);
    profileVideo.currentTime = value;
    videoCurrentTime = value;
  };

  const toggleProfileVideoMute = () => {
    if (!profileVideo) return;
    profileVideo.muted = !profileVideo.muted;
    videoMuted = profileVideo.muted;
  };

  const openProfileVideoFullscreen = () => {
    profileVideo?.requestFullscreen();
  };

  const closeProfileVideo = () => {
    if (profileVideo) profileVideo.pause();
    videoPlaying = false;
    showProfileVideo = false;
  };

  const handleModalKeydown = (event: KeyboardEvent) => {
    if (showProfileVideo && event.key === "Escape") closeProfileVideo();
  };

  const speakHeroIntro = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(heroSpeechText);
    if (preferredSpeechVoice) utterance.voice = preferredSpeechVoice;
    utterance.lang = preferredSpeechVoice?.lang ?? "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 0.8;
    utterance.onend = () => isSpeaking = false;
    utterance.onerror = () => isSpeaking = false;

    window.speechSynthesis.cancel();
    isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  };

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
    { category: "DEVOPS / CLOUD", items: "Docker, Jenkins, AWS S3, GCP, Cloudflare, GitHub Actions" },
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
    { layer: "OPS", signal: "Docker + Jenkins + AWS S3 + GCP + Cloudflare", status: "DEPLOY SURVIVED" },
  ];

  const demoModes = [
    { id: "mobile", label: "MOBILE APP", title: "Flutter pocket flow", note: "Tap through feed, order, and chat states like a production mobile client." },
    { id: "web", label: "WEB FRONTEND", title: "Vue ops dashboard", note: "Switch interface state and watch dashboard rows react." },
    { id: "api", label: "BACKEND / API", title: "Golang service route", note: "Fire a request from client to gateway to Go service to database." },
    { id: "devops", label: "DEVOPS GAME", title: "Deploy pipeline run", note: "Trigger a release through Docker, Jenkins, AWS S3, GCP, and Cloudflare." },
    { id: "redis", label: "REDIS GAME", title: "Cache and queue control", note: "Click cache lookup or push messages to see Redis speed up reads and buffer jobs." },
    { id: "data", label: "DATA GAME", title: "Database routing board", note: "Choose where product data lands: relational records, document data, cache, or object storage." },
    { id: "testing", label: "TEST GAME", title: "Load test control room", note: "Fire unit, integration, and Locust checks before traffic reaches production." },
  ] as const;

  type DemoMode = typeof demoModes[number]["id"];
  type ApiStatus = "idle" | "sending" | "done";
  type DevOpsStatus = "idle" | "building" | "deployed";
  type RedisMode = "cache" | "queue";

  const devOpsSteps = ["DOCKER", "JENKINS", "AWS S3", "GCP", "CLOUDFLARE"];
  const dataStores = ["POSTGRES", "MONGODB", "REDIS", "S3 / GCP"];
  const testStages = ["UNIT", "INTEGRATION", "LOCUST", "RELEASE"];

  let activeDemo: DemoMode = "mobile";
  let demoPulse = 0;
  let apiStatus: ApiStatus = "idle";
  let devOpsStatus: DevOpsStatus = "idle";
  let redisMode: RedisMode = "cache";
  let redisCacheWarm = false;
  let redisQueueDepth = 0;
  let dataRoute = 0;
  let testLoad = 0;
  let apiTimeout: ReturnType<typeof setTimeout>;
  let devOpsTimeout: ReturnType<typeof setTimeout>;

  $: activeDemoMeta = demoModes.find((mode) => mode.id === activeDemo) ?? demoModes[0];
  $: highlightedRow = demoPulse % 3;
  $: devOpsProgress = activeDemo === "devops" ? demoPulse % (devOpsSteps.length + 1) : 0;
  $: redisLatency = redisCacheWarm ? "12ms" : "240ms";
  $: redisStatus = redisMode === "cache" ? (redisCacheWarm ? "cache hit" : "cache miss") : `${redisQueueDepth} queued`;
  $: dataStatus = dataStores[dataRoute];
  $: testStatus = `${testStages[Math.min(testLoad, testStages.length - 1)]} PASS`;

  const resetTimedDemos = () => {
    clearTimeout(apiTimeout);
    clearTimeout(devOpsTimeout);
    apiStatus = "idle";
    devOpsStatus = "idle";
  };

  const playRedis = (mode: RedisMode) => {
    activeDemo = "redis";
    demoPulse += 1;
    resetTimedDemos();
    redisMode = mode;

    if (mode === "cache") {
      redisCacheWarm = !redisCacheWarm;
      return;
    }

    redisQueueDepth = (redisQueueDepth + 1) % 6;
  };

  const playDemo = (id: DemoMode) => {
    activeDemo = id;
    demoPulse += 1;
    resetTimedDemos();

    if (id === "api") {
      apiStatus = "sending";
      apiTimeout = setTimeout(() => {
        apiStatus = "done";
      }, 650);
      return;
    }

    if (id === "devops") {
      devOpsStatus = "building";
      devOpsTimeout = setTimeout(() => {
        devOpsStatus = "deployed";
      }, 750);
      return;
    }

    if (id === "data") {
      dataRoute = (dataRoute + 1) % dataStores.length;
      return;
    }

    if (id === "testing") {
      testLoad = (testLoad + 1) % testStages.length;
    }
  };

  onMount(() => {
    speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    if (speechSupported) {
      selectPreferredSpeechVoice();
      window.speechSynthesis.onvoiceschanged = selectPreferredSpeechVoice;
    }

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

      gsap.from(".mini-demo-title", {
        scrollTrigger: {
          trigger: ".mini-demo-section",
          start: "top 80%",
          once: true,
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      ScrollTrigger.batch(".mini-demo-control, .mini-demo-panel", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.08,
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

    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
      ctx.revert();
    };
  });
</script>

<svelte:window on:keydown={handleModalKeydown} />

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 py-16 md:py-24 lg:py-32 items-start">
    <div>
      <div class="hero-tag tag-bracket mb-6" style="visibility:hidden;">
        [ RESUME // FULL STACK DEVELOPER // FLUTTER + VUE + GOLANG ]
      </div>

      <h1 class="hero-title heading-display text-4xl md:text-6xl lg:text-8xl mb-8">
        <span class="hero-name hero-glitch inline-block" data-text="WATCHAKORN" style="visibility:hidden;">WATCHAKORN</span><br />
        <span class="hero-accent hero-glitch text-accent inline-block" data-text="BUDDEEWONG" style="visibility:hidden;">BUDDEEWONG</span>
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
          CONTACT ME ↗
        </a>
        <button type="button" on:click={() => showProfileVideo = true} class="btn-outline" style="visibility:hidden;">
          WATCH PROFILE
        </button>
        <button
          type="button"
          on:click={speakHeroIntro}
          class="btn-outline"
          style="visibility:hidden;"
          disabled={!speechSupported}
          aria-pressed={isSpeaking}
        >
          {isSpeaking ? "▰ SPEAKING NOW" : "▱ VOICE INTRO"}
        </button>
        <button type="button" on:click={downloadFile} class="btn-outline" style="visibility:hidden;">
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

    <figure class="hero-portrait card-industrial p-3 group" style="visibility:hidden;">
      <div class="relative overflow-hidden">
        <img
          src="{base}/profile.png"
          alt="Watchakorn Buddeewong speaking with a microphone"
          class="aspect-[4/5] w-full object-cover"
        />
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHNjdHMwNzk3ZDA0bzlzYTRia2Nxa2ZobHh2MGsxN294YmpxOTY1biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gSev6spAmm4dVXRLsV/200.gif"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 mix-blend-screen grayscale transition-opacity duration-300 group-hover:opacity-25"
        />
      </div>
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

  <div class="wasm-os-section py-16 md:py-24">
    <div class="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] border border-border bg-card">
      <div class="p-5 md:p-6 lg:border-r border-border bg-substrate">
        <div class="tag-bracket mb-4">[ WASM OS NODE // V86 ]</div>
        <h2 class="heading-display text-2xl md:text-4xl mb-5">
          BOOT<br />FREEDOS
        </h2>
        <div class="accent-line mb-5" />
        <p class="text-xs text-muted leading-relaxed mb-6">
          Browser x86 emulator running a tiny FreeDOS image through WebAssembly. No local WASM build step — loaded from the public v86 demo only when activated.
        </p>
        <div class="grid grid-cols-2 gap-0 border border-border text-[10px] uppercase tracking-widest mb-4">
          <div class="p-3 border-r border-border">
            <div class="text-muted">PROFILE</div>
            <div class="text-accent font-bold mt-1">FREEDOS</div>
          </div>
          <div class="p-3">
            <div class="text-muted">PAYLOAD</div>
            <div class="text-accent font-bold mt-1">0.6 MB</div>
          </div>
        </div>
        <button
          type="button"
          class="btn-primary w-full justify-center"
          on:click={() => wasmOsLoaded = true}
          disabled={wasmOsLoaded}
        >
          {wasmOsLoaded ? 'OS BOOTED' : 'BOOT WASM OS'}
        </button>
      </div>

      <div class="relative min-h-[420px] overflow-hidden wasm-os-shell">
        <div class="absolute inset-0 opacity-20 pointer-events-none wasm-scanline" />
        <div class="relative z-10 grid grid-cols-[1fr_auto] border-b border-white/20 wasm-os-chrome">
          <div class="px-4 py-3">
            <div class="tag-bracket text-white/70">[ EMULATED TERMINAL // X86_COMPAT ]</div>
          </div>
          <div class="border-l border-border px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-accent">
            {wasmOsLoaded ? 'LIVE' : 'STANDBY'}
          </div>
        </div>

        {#if wasmOsLoaded}
          <div class="relative z-10 h-[380px] overflow-hidden wasm-os-viewport">
            <iframe
              title="v86 FreeDOS WebAssembly OS emulator"
              src="https://copy.sh/v86/?profile=freedos"
              class="h-full w-full wasm-os-frame"
              loading="lazy"
            />
            <div class="pointer-events-none absolute inset-0 wasm-os-tint" />
          </div>
        {:else}
          <div class="relative z-10 flex h-[380px] flex-col justify-center p-6 md:p-8">
            <div class="heading-display text-5xl md:text-7xl text-accent mb-4">86</div>
            <div class="text-[10px] uppercase tracking-widest text-white/65 space-y-2">
              <div>&gt; wasm runtime idle</div>
              <div>&gt; disk image detached</div>
              <div>&gt; press boot to mount freedos</div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border" />

  <div class="mini-demo-section py-16 md:py-24">
    <div class="mini-demo-title mb-8" style="visibility:hidden;">
      <div class="tag-bracket mb-4">[ INTERACTIVE MINI LAB ]</div>
      <div class="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-12">
        <h2 class="heading-display text-2xl md:text-4xl">
          CLICKABLE<br />FULL-STACK PROOF
        </h2>
        <p class="text-muted text-xs leading-relaxed max-w-2xl">
          Three tiny interfaces showing how mobile clients, web dashboards, and backend services fit together.
          No external API here — just a fast local simulation of product thinking from screen to server.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] border border-border">
      <div class="mini-demo-control p-5 md:p-6 lg:border-r border-border bg-substrate" style="visibility:hidden;">
        <div class="tag-bracket mb-4">[ SELECT PROGRAM ]</div>
        <div class="grid grid-cols-1 gap-2 mb-6">
          {#each demoModes as mode}
            <button
              type="button"
              class="text-left border border-border px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors {activeDemo === mode.id ? 'bg-accent text-white border-accent' : 'text-muted hover:text-ink hover:border-ink'}"
              aria-pressed={activeDemo === mode.id}
              on:click={() => playDemo(mode.id)}
            >
              {mode.label}
            </button>
          {/each}
        </div>

        <div class="border-t border-border pt-4 space-y-3">
          <div>
            <div class="tag-bracket mb-1">[ ACTIVE ]</div>
            <div class="text-sm font-bold uppercase tracking-wider">{activeDemoMeta.title}</div>
          </div>
          <p class="text-xs text-muted leading-relaxed">{activeDemoMeta.note}</p>
          <div class="grid grid-cols-2 gap-0 border border-border text-[10px] uppercase tracking-widest">
            <div class="p-3 border-r border-border">
              <div class="text-muted">EVENTS</div>
              <div class="text-accent font-bold mt-1">#{demoPulse}</div>
            </div>
            <div class="p-3">
              <div class="text-muted">STATUS</div>
              <div class="text-accent font-bold mt-1">{activeDemo === 'api' ? apiStatus : activeDemo === 'devops' ? devOpsStatus : activeDemo === 'redis' ? redisStatus : activeDemo === 'data' ? dataStatus : activeDemo === 'testing' ? testStatus : 'ready'}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mini-demo-panel p-5 md:p-6 bg-card" style="visibility:hidden;">
        {#key activeDemo + demoPulse}
          {#if activeDemo === 'mobile'}
            <div class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
              <div class="border-2 border-ink p-3 bg-substrate max-w-[240px] mx-auto w-full">
                <div class="h-5 border-b border-border mb-3 flex items-center justify-between text-[9px] text-muted">
                  <span>09:{(demoPulse % 60).toString().padStart(2, '0')}</span>
                  <span>FLUTTER</span>
                </div>
                <div class="space-y-3">
                  {#each ['FEED SYNC', 'POS ORDER', 'LIVE CHAT'] as card, i}
                    <button
                      type="button"
                      class="w-full text-left border border-border p-3 transition-colors {highlightedRow === i ? 'bg-accent text-white border-accent' : 'bg-card text-ink'}"
                      on:click={() => playDemo('mobile')}
                    >
                      <div class="text-[10px] font-bold tracking-widest">{card}</div>
                      <div class="text-[9px] uppercase tracking-widest mt-2 opacity-75">SYNC #{demoPulse + i}</div>
                    </button>
                  {/each}
                </div>
              </div>
              <div>
                <div class="tag-bracket mb-3">[ MOBILE OUTPUT ]</div>
                <div class="heading-display text-2xl md:text-4xl text-accent mb-4">CLIENT STATE</div>
                <p class="text-xs text-muted leading-relaxed">
                  Tap phone cards. UI state updates like a Flutter app handling feed, POS, and chat flows.
                </p>
              </div>
            </div>
          {:else if activeDemo === 'web'}
            <div class="border border-border bg-substrate">
              <div class="flex items-center justify-between border-b border-border px-4 py-3">
                <div class="tag-bracket">[ VUE OPS DASHBOARD ]</div>
                <button type="button" class="text-accent text-[10px] font-bold tracking-widest" on:click={() => playDemo('web')}>REFRESH ↗</button>
              </div>
              <div class="grid grid-cols-3 border-b border-border text-center text-[10px] uppercase tracking-widest">
                {#each ['ORDERS', 'USERS', 'LATENCY'] as metric, i}
                  <div class="p-4 {i < 2 ? 'border-r border-border' : ''}">
                    <div class="text-muted">{metric}</div>
                    <div class="heading-display text-xl text-accent mt-2">{i === highlightedRow ? 'LIVE' : 'OK'}</div>
                  </div>
                {/each}
              </div>
              <div class="p-4 space-y-2">
                {#each ['render product table', 'hydrate dashboard state', 'ship responsive layout'] as row, i}
                  <div class="grid grid-cols-[32px_1fr_72px] gap-3 border border-border p-3 text-[10px] uppercase tracking-widest {highlightedRow === i ? 'bg-accent text-white border-accent' : 'bg-card'}">
                    <span>0{i + 1}</span>
                    <span>{row}</span>
                    <span class="text-right">{highlightedRow === i ? 'ACTIVE' : 'IDLE'}</span>
                  </div>
                {/each}
              </div>
            </div>
          {:else if activeDemo === 'api'}
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="tag-bracket">[ API ROUTE SIMULATOR ]</div>
                <button type="button" class="btn-primary" on:click={() => playDemo('api')}>SEND REQUEST</button>
              </div>
              <svg viewBox="0 0 720 180" class="w-full border border-border bg-substrate" role="img" aria-label="Client to gateway to Go service to Postgres route">
                <line x1="110" y1="90" x2="610" y2="90" stroke="currentColor" stroke-width="2" class="{apiStatus === 'idle' ? 'text-border' : 'text-accent'}" stroke-dasharray={apiStatus === 'sending' ? '12 10' : '0'} />
                {#each ['CLIENT', 'GATEWAY', 'GO SERVICE', 'POSTGRES'] as node, i}
                  <g transform="translate({80 + i * 180} 55)">
                    <rect width="100" height="70" fill="none" stroke="currentColor" stroke-width="2" class="{apiStatus === 'done' || (apiStatus === 'sending' && i < 3) ? 'text-accent' : 'text-ink'}" />
                    <text x="50" y="42" text-anchor="middle" class="fill-current text-[10px] font-bold tracking-widest">{node}</text>
                  </g>
                {/each}
              </svg>
              <div class="grid grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest">
                <div class="p-3 border-r border-border text-muted">METHOD: POST</div>
                <div class="p-3 border-r border-border text-muted">RUNTIME: GOLANG</div>
                <div class="p-3 text-accent font-bold">{apiStatus === 'done' ? '200 OK' : apiStatus === 'sending' ? 'PENDING' : 'READY'}</div>
              </div>
            </div>
          {:else if activeDemo === 'devops'}
            <div>
              <div class="flex items-center justify-between mb-5 gap-4">
                <div class="tag-bracket">[ DEVOPS DEPLOY GAME ]</div>
                <button type="button" class="btn-primary" on:click={() => playDemo('devops')}>RUN DEPLOY</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-0 border border-border bg-substrate">
                {#each devOpsSteps as step, i}
                  <div class="p-4 border-b md:border-b-0 md:border-r border-border last:border-r-0 {i <= devOpsProgress ? 'bg-accent text-white' : 'bg-card text-ink'}">
                    <div class="text-[10px] font-bold uppercase tracking-widest mb-8">0{i + 1}</div>
                    <div class="heading-display text-lg md:text-xl break-words">{step}</div>
                    <div class="text-[9px] uppercase tracking-widest mt-3 opacity-75">
                      {i < devOpsProgress ? 'PASSED' : i === devOpsProgress ? 'ACTIVE' : 'WAITING'}
                    </div>
                  </div>
                {/each}
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest">
                <div class="p-3 border-r border-border text-muted">IMAGE: DOCKER</div>
                <div class="p-3 border-r border-border text-muted">PIPELINE: JENKINS</div>
                <div class="p-3 border-r border-border text-muted">STORAGE: AWS S3 / GCP</div>
                <div class="p-3 text-accent font-bold">{devOpsStatus === 'deployed' ? 'EDGE LIVE' : devOpsStatus === 'building' ? 'BUILDING' : 'READY'}</div>
              </div>
            </div>
          {:else if activeDemo === 'data'}
            <div>
              <div class="flex items-center justify-between mb-5 gap-4">
                <div>
                  <div class="tag-bracket mb-2">[ DATA ROUTING GAME ]</div>
                  <div class="text-xs text-muted uppercase tracking-widest">ACTIVE STORE: {dataStatus}</div>
                </div>
                <button type="button" class="btn-primary" on:click={() => playDemo('data')}>ROUTE DATA</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-0 border border-border bg-substrate">
                {#each dataStores as store, i}
                  <div class="p-5 border-b md:border-b-0 md:border-r border-border last:border-r-0 {i === dataRoute ? 'bg-accent text-white' : 'bg-card text-ink'}">
                    <div class="text-[10px] font-bold uppercase tracking-widest mb-8">DB-0{i + 1}</div>
                    <div class="heading-display text-xl break-words">{store}</div>
                    <div class="text-[9px] uppercase tracking-widest mt-3 opacity-75">
                      {i === 0 ? 'RELATIONAL' : i === 1 ? 'DOCUMENT' : i === 2 ? 'CACHE' : 'OBJECTS'}
                    </div>
                  </div>
                {/each}
              </div>
              <div class="grid grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest">
                <div class="p-3 border-r border-border text-muted">SCHEMA: ATLAS / SQL</div>
                <div class="p-3 border-r border-border text-muted">FLOW: API WRITE</div>
                <div class="p-3 text-accent font-bold">{dataStatus}</div>
              </div>
            </div>
          {:else if activeDemo === 'testing'}
            <div>
              <div class="flex items-center justify-between mb-5 gap-4">
                <div>
                  <div class="tag-bracket mb-2">[ TEST / LOAD GAME ]</div>
                  <div class="text-xs text-muted uppercase tracking-widest">CHECKPOINT: {testStatus}</div>
                </div>
                <button type="button" class="btn-primary" on:click={() => playDemo('testing')}>RUN CHECK</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-0 border border-border bg-substrate">
                {#each testStages as stage, i}
                  <div class="p-5 border-b md:border-b-0 md:border-r border-border last:border-r-0 {i <= testLoad ? 'bg-accent text-white' : 'bg-card text-ink'}">
                    <div class="text-[10px] font-bold uppercase tracking-widest mb-8">QA-0{i + 1}</div>
                    <div class="heading-display text-xl break-words">{stage}</div>
                    <div class="text-[9px] uppercase tracking-widest mt-3 opacity-75">{i <= testLoad ? 'PASS' : 'WAIT'}</div>
                  </div>
                {/each}
              </div>
              <div class="grid grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest">
                <div class="p-3 border-r border-border text-muted">UNIT: SERVICE LOGIC</div>
                <div class="p-3 border-r border-border text-muted">LOAD: LOCUST</div>
                <div class="p-3 text-accent font-bold">{testStatus}</div>
              </div>
            </div>
          {:else}
            <div>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <div class="tag-bracket mb-2">[ REDIS CACHE / QUEUE GAME ]</div>
                  <div class="text-xs text-muted uppercase tracking-widest">MODE: {redisMode} // LATENCY: {redisLatency}</div>
                </div>
                <div class="flex gap-2">
                  <button type="button" class="btn-outline" on:click={() => playRedis('cache')}>CACHE LOOKUP</button>
                  <button type="button" class="btn-primary" on:click={() => playRedis('queue')}>PUSH JOB</button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-[1fr_160px_1fr] gap-0 border border-border bg-substrate">
                <div class="p-5 border-b md:border-b-0 md:border-r border-border">
                  <div class="tag-bracket mb-3">[ API READ ]</div>
                  <div class="heading-display text-2xl mb-3">GET /FEED</div>
                  <div class="text-xs text-muted leading-relaxed">Request checks Redis before touching database.</div>
                </div>
                <div class="p-5 border-b md:border-b-0 md:border-r border-border {redisCacheWarm || redisQueueDepth > 0 ? 'bg-accent text-white' : 'bg-card text-ink'}">
                  <div class="tag-bracket mb-3 {redisCacheWarm || redisQueueDepth > 0 ? 'text-white' : ''}">[ REDIS ]</div>
                  <div class="heading-display text-3xl mb-3">{redisMode === 'cache' ? (redisCacheWarm ? 'HIT' : 'MISS') : redisQueueDepth}</div>
                  <div class="text-[10px] uppercase tracking-widest opacity-75">{redisMode === 'cache' ? 'CACHE STATE' : 'QUEUE DEPTH'}</div>
                </div>
                <div class="p-5">
                  <div class="tag-bracket mb-3">[ WORKER / DB ]</div>
                  <div class="space-y-2">
                    {#each ['email job', 'notification job', 'feed rebuild', 'media task'] as job, i}
                      <div class="border border-border p-2 text-[10px] uppercase tracking-widest {redisMode === 'queue' && i < redisQueueDepth ? 'bg-accent text-white border-accent' : 'bg-card text-muted'}">
                        {i < redisQueueDepth ? 'QUEUED' : 'IDLE'} // {job}
                      </div>
                    {/each}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest">
                <div class="p-3 border-r border-border text-muted">CACHE: {redisCacheWarm ? 'WARM' : 'COLD'}</div>
                <div class="p-3 border-r border-border text-muted">QUEUE: {redisQueueDepth} MSG</div>
                <div class="p-3 text-accent font-bold">{redisMode === 'cache' ? (redisCacheWarm ? 'FAST PATH' : 'DB FALLBACK') : 'WORKER BUFFER'}</div>
              </div>
            </div>
          {/if}
        {/key}
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border" />

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

{#if showProfileVideo}
  <div class="fixed inset-0 z-50 px-4 py-6 md:p-10 flex items-center justify-center">
    <button
      type="button"
      class="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      aria-label="Close profile video"
      on:click={closeProfileVideo}
    />
    <div
      class="relative w-full max-w-6xl border-2 border-ink bg-substrate shadow-[14px_14px_0_var(--color-accent)]"
      role="dialog"
      aria-modal="true"
      aria-label="Profile video"
    >
      <div class="grid grid-cols-[1fr_auto] border-b-2 border-ink">
        <div class="px-4 py-3 md:px-5">
          <div class="tag-bracket mb-2">[ PROFILE VIDEO // WATCHAKORN ]</div>
          <div class="heading-display text-xl md:text-3xl leading-none">FIELD RECORDING</div>
        </div>
        <button type="button" class="border-l-2 border-ink px-4 md:px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white active:translate-y-px transition-colors" on:click={closeProfileVideo}>
          CLOSE
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_220px] bg-card">
        <div class="p-3 md:p-5">
          <div class="relative border border-ink bg-ink overflow-hidden">
            <div class="absolute left-0 top-0 z-10 border-b-2 border-r-2 border-accent bg-substrate px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-accent">
              LIVE PROFILE
            </div>
            <video
              bind:this={profileVideo}
              src="{base}/profile.mp4"
              class="w-full max-h-[72vh] bg-ink object-contain hover:grayscale-0 transition-all duration-500 {videoPlaying ? 'grayscale-0' : 'grayscale'}"
              autoplay
              playsinline
              on:click={toggleProfileVideo}
              on:loadedmetadata={() => {
                videoDuration = profileVideo?.duration ?? 0;
              }}
              on:play={() => videoPlaying = true}
              on:pause={() => videoPlaying = false}
              on:volumechange={() => {
                videoMuted = profileVideo?.muted ?? false;
              }}
              on:timeupdate={() => videoCurrentTime = profileVideo?.currentTime ?? 0}
            >
              <track kind="captions" />
            </video>
            <div class="absolute inset-x-3 bottom-3 z-20 bg-ink/80 text-white backdrop-blur-sm">
              <input
                type="range"
                min="0"
                max={videoDuration || 0}
                step="0.1"
                value={videoCurrentTime}
                aria-label="Seek profile video"
                class="w-full h-2 block accent-accent cursor-pointer"
                on:input={seekProfileVideo}
              />
              <div class="grid grid-cols-[auto_1fr_auto_auto] gap-3 p-2 items-center text-[10px] uppercase tracking-widest">
                <button
                  type="button"
                  class="font-bold hover:text-accent active:translate-y-px transition-colors"
                  on:click={toggleProfileVideo}
                >
                  {videoPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <div class="flex items-center justify-between text-white/70 tabular-nums">
                  <span>{formatVideoTime(videoCurrentTime)}</span>
                  <span>{formatVideoTime(videoDuration)}</span>
                </div>
                <button
                  type="button"
                  class="font-bold hover:text-accent active:translate-y-px transition-colors"
                  on:click={toggleProfileVideoMute}
                >
                  {videoMuted ? 'MUTED' : 'SOUND'}
                </button>
                <button
                  type="button"
                  class="font-bold hover:text-accent active:translate-y-px transition-colors"
                  on:click={openProfileVideoFullscreen}
                >
                  FULL
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside class="border-t-2 lg:border-t-0 lg:border-l-2 border-ink p-4 md:p-5 bg-substrate">
          <div class="tag-bracket mb-4">[ PLAYER STATUS ]</div>
          <div class="space-y-4 text-[10px] uppercase tracking-widest text-muted">
            <div class="border border-border p-3 bg-card">
              <div class="text-border mb-1">SOURCE</div>
              <div class="heading-display text-lg text-ink">PROFILE.MP4</div>
            </div>
            <div class="border border-border p-3 bg-card">
              <div class="text-border mb-1">TIME</div>
              <div class="heading-display text-lg text-accent tabular-nums">
                {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration)}
              </div>
            </div>
            <div class="border border-border p-3 bg-card">
              <div class="text-border mb-1">MODE</div>
              <div class="heading-display text-lg text-ink">BRUTAL PLAYER</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
{/if}


<style>
  .hero-glitch {
    position: relative;
    isolation: isolate;
  }

  .hero-glitch::before,
  .hero-glitch::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 120ms steps(2, end), transform 120ms steps(2, end);
  }

  .hero-title:hover .hero-glitch {
    text-shadow: 3px 0 0 color-mix(in srgb, var(--color-accent) 70%, transparent);
  }

  .hero-title:hover .hero-glitch::before {
    opacity: 0.5;
    color: var(--color-accent);
    clip-path: inset(0 0 58% 0);
    animation: hero-glitch-top 520ms steps(2, end) infinite;
  }

  .hero-title:hover .hero-glitch::after {
    opacity: 0.35;
    color: var(--color-ink);
    clip-path: inset(62% 0 0 0);
    animation: hero-glitch-bottom 420ms steps(2, end) infinite;
  }

  @keyframes hero-glitch-top {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-3px, -1px); }
    50% { transform: translate(2px, 0); }
    75% { transform: translate(-1px, 1px); }
  }

  @keyframes hero-glitch-bottom {
    0%, 100% { transform: translate(0, 0); }
    20% { transform: translate(3px, 1px); }
    45% { transform: translate(-2px, 0); }
    70% { transform: translate(1px, -1px); }
  }

  .wasm-scanline {
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.16) 2px, rgba(255, 255, 255, 0.16) 3px);
  }

  .wasm-os-shell,
  .wasm-os-chrome,
  .wasm-os-viewport,
  .wasm-os-frame {
    background: #0a0a0a;
    color: #eaeaea;
  }

  .wasm-os-frame {
    border: 0;
    color-scheme: dark;
    filter: invert(1) grayscale(1) contrast(1.35) brightness(0.72);
  }

  .wasm-os-tint {
    background: rgba(10, 10, 10, 0.18);
    mix-blend-mode: multiply;
  }
</style>
