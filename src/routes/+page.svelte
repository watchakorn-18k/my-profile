<script lang="ts">
  import resume from "$lib/assets/my_resume.pdf";
  import { base } from "$app/paths";
  import { onMount, tick } from "svelte";
  import gsap from "gsap";

  let container: HTMLElement;
  let profileVideo: HTMLVideoElement | null = null;
  let showProfileVideo = false;
  let videoCurrentTime = 0;
  let videoDuration = 0;
  let videoPlaying = false;
  let videoMuted = false;
  type V86Constructor = new (options: Record<string, unknown>) => unknown;

  let wasmOsLoaded = false;
  let wasmScreen: HTMLDivElement | null = null;

  const loadV86Script = () => new Promise<void>((resolve, reject) => {
    if ((window as Window & { V86?: V86Constructor }).V86) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `${base}/v86/libv86.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load v86"));
    document.head.appendChild(script);
  });

  const bootWasmOs = async () => {
    wasmOsLoaded = true;
    await tick();
    await loadV86Script();

    if (!wasmScreen) return;

    const V86 = (window as unknown as Window & { V86: V86Constructor }).V86;
    new V86({
      wasm_path: `${base}/v86/v86.wasm`,
      memory_size: 32 * 1024 * 1024,
      vga_memory_size: 2 * 1024 * 1024,
      screen_container: wasmScreen,
      bios: { url: `${base}/v86/seabios.bin` },
      vga_bios: { url: `${base}/v86/vgabios.bin` },
      cdrom: { url: `${base}/v86/linux.iso` },
      autostart: true,
    });
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

  const webMcpPractices = [
    { id: "01", title: "TOOL STRATEGY", rule: "One tool = one function. No overlap = no agent confusion.", detail: "Register tools when useful, unregister when not. More tools = bigger context window hit + slower completion." },
    { id: "02", title: "NAMING", rule: "Distinguish execution vs initiation in tool names.", detail: "create-event fires now. start-event-creation-process redirects to form. Positive descriptions only." },
    { id: "03", title: "MINIMIZE COMPUTE", rule: "Accept raw strings. Don't ask model to do math.", detail: "Declare specific param types: string, number, enum. Use natural labels not IDs." },
    { id: "04", title: "RELIABILITY", rule: "Rate limits: return meaningful error or tell user to do manually.", detail: "Update UI state after function completes — agent uses UI to plan next steps. Validate strict in code, loose in schema." },
    { id: "05", title: "EVALS", rule: "Use eval-driven dev: repeatable process, catches regressions.", detail: "Define: problem, baseline, ideal result, evaluation method. Don't patch narrow model quirks with narrow rules." },
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
  type TransformerStatus = "idle" | "loading" | "running" | "done" | "error";
  type PromptStatus = "idle" | "running" | "done" | "error";
  type PasskeyStep = "idle" | "challenge" | "biometric" | "signed" | "verified";
  type PromptSession = {
    prompt: (input: string) => Promise<string>;
    destroy?: () => void;
  };
  type PromptFactory = {
    availability?: () => Promise<string>;
    create: (options?: Record<string, unknown>) => Promise<PromptSession>;
  };
  type PromptWindow = Window & {
    LanguageModel?: PromptFactory;
    ai?: { languageModel?: PromptFactory };
  };
  type WebGpuStatus = "idle" | "running" | "gpu" | "cpu" | "error";
  type MinimalGpu = {
    requestAdapter: () => Promise<{
      requestDevice: () => Promise<{
        createBuffer: (options: { size: number; usage: number }) => unknown;
        createCommandEncoder: () => {
          copyBufferToBuffer: (source: unknown, sourceOffset: number, destination: unknown, destinationOffset: number, size: number) => void;
          finish: () => unknown;
        };
        queue: {
          writeBuffer: (buffer: unknown, offset: number, data: Uint32Array) => void;
          submit: (commands: unknown[]) => void;
          onSubmittedWorkDone: () => Promise<void>;
        };
      }>;
    } | null>;
  };
  type GpuNavigator = Navigator & { gpu?: MinimalGpu };
  type RouterResult = { label: string; score: number; signal: string };
  type EmbeddingOutput = { tolist: () => number[] | number[][] };
  type EmbeddingPipeline = (input: string | string[], options: { pooling: "mean"; normalize: true }) => Promise<EmbeddingOutput>;

  const devOpsSteps = ["DOCKER", "JENKINS", "AWS S3", "GCP", "CLOUDFLARE"];
  const dataStores = ["POSTGRES", "MONGODB", "REDIS", "S3 / GCP"];
  const testStages = ["UNIT", "INTEGRATION", "LOCUST", "RELEASE"];
  const skillRoutes = [
    { label: "API ENGINEER", signal: "golang api service fiber echo rest grpc backend endpoint" },
    { label: "BACKEND", signal: "server business logic domain model middleware microservice" },
    { label: "SYSTEM DESIGN", signal: "architecture scalability service boundary event driven distributed system" },
    { label: "DATA ENGINEER", signal: "postgres mongodb sql analytics pipeline query schema database" },
    { label: "DATABASE TUNING", signal: "index query optimization migration transaction performance relational nosql" },
    { label: "CACHE / QUEUE", signal: "redis queue cache worker pubsub realtime job latency" },
    { label: "REALTIME", signal: "websocket live update streaming notification chat presence event" },
    { label: "FRONTEND UI", signal: "svelte vue react interface animation browser component" },
    { label: "DESIGN SYSTEM", signal: "tailwind css theme component visual typography responsive layout" },
    { label: "MOBILE APP", signal: "flutter dart mobile app ios android client store" },
    { label: "PWA", signal: "progressive web app offline service worker install manifest" },
    { label: "DESKTOP APP", signal: "electron tauri desktop native window cross platform app" },
    { label: "DEVOPS", signal: "docker jenkins cicd cloudflare aws gcp deployment" },
    { label: "PLATFORM", signal: "internal platform developer experience tooling automation scaffold" },
    { label: "CLOUD STORAGE", signal: "aws s3 gcp bucket object storage file upload cdn" },
    { label: "INFRASTRUCTURE", signal: "network server linux vm container orchestration provisioning terraform" },
    { label: "SECURITY", signal: "authentication authorization token session validation rate limit secure api" },
    { label: "APPSEC", signal: "xss csrf sql injection vulnerability secure coding owasp" },
    { label: "AI / WASM", signal: "machine learning transformers webassembly browser inference embedding" },
    { label: "LLM APP", signal: "chatbot prompt rag vector database agent retrieval generation" },
    { label: "COMPUTER VISION", signal: "image detection classification ocr segmentation visual model" },
    { label: "QA / LOAD TEST", signal: "unit integration locust load test benchmark reliability" },
    { label: "OBSERVABILITY", signal: "logging metrics tracing monitoring alert dashboard incident latency" },
    { label: "SRE", signal: "incident response uptime error budget reliability oncall resilience" },
    { label: "PERFORMANCE", signal: "latency bundle optimization cache profiling lighthouse core web vitals" },
    { label: "GAME DEV", signal: "game loop canvas webgl physics sprite input collision" },
    { label: "WEB3", signal: "blockchain wallet smart contract token nft dapp solidity" },
    { label: "IOT", signal: "sensor mqtt device edge firmware embedded telemetry" },
    { label: "GIS / MAPS", signal: "map geolocation gps coordinate layer route spatial data" },
    { label: "PAYMENTS", signal: "checkout payment stripe billing invoice subscription transaction" },
    { label: "ECOMMERCE", signal: "cart product catalog order inventory checkout marketplace" },
    { label: "CMS", signal: "content markdown blog editor publishing headless cms" },
    { label: "CRM / ERP", signal: "customer sales inventory accounting workflow enterprise resource" },
    { label: "AGENT TOOLS", signal: "mcp tool schema agent browser automation evaluation" },
  ];

  let activeDemo: DemoMode = "mobile";
  let demoPulse = 0;
  let apiStatus: ApiStatus = "idle";
  let devOpsStatus: DevOpsStatus = "idle";
  let redisMode: RedisMode = "cache";
  let redisCacheWarm = false;
  let redisQueueDepth = 0;
  let dataRoute = 0;
  let testLoad = 0;
  let transformerStatus: TransformerStatus = "idle";
  let transformerInput = "Build a realtime backend with Redis queues, PostgreSQL, Docker, and Cloudflare deploys.";
  let routerResults: RouterResult[] = [];
  let transformerError = "";
  let embeddingExtractor: EmbeddingPipeline | null = null;
  let skillEmbeddings: number[][] | null = null;
  let webGpuStatus: WebGpuStatus = "idle";
  let webGpuSupported = false;
  let webGpuWorkgroups = "--";
  let webGpuBufferSize = "--";
  let webGpuFrameTime = "--";
  let webGpuMatrix = Array.from({ length: 64 }, (_, index) => index % 5 === 0);
  let promptApiSupported = false;
  let promptApiStatus: PromptStatus = "idle";
  let promptInput = "Write one sharp sentence describing a brutalist developer portfolio.";
  let promptOutput = "";
  let promptError = "";
  let promptSession: PromptSession | null = null;
  let passkeyStep: PasskeyStep = "idle";
  let passkeyChallenge = "CHLG-0000";
  let passkeyLatency = "--";
  let passkeyCredential = "credential pending";
  let passkeyTimeout: ReturnType<typeof setTimeout>;
  let apiTimeout: ReturnType<typeof setTimeout>;
  let devOpsTimeout: ReturnType<typeof setTimeout>;

  $: activeDemoMeta = demoModes.find((mode) => mode.id === activeDemo) ?? demoModes[0];
  $: highlightedRow = demoPulse % 3;
  $: devOpsProgress = activeDemo === "devops" ? demoPulse % (devOpsSteps.length + 1) : 0;
  $: redisLatency = redisCacheWarm ? "12ms" : "240ms";
  $: redisStatus = redisMode === "cache" ? (redisCacheWarm ? "cache hit" : "cache miss") : `${redisQueueDepth} queued`;
  $: dataStatus = dataStores[dataRoute];
  $: testStatus = `${testStages[Math.min(testLoad, testStages.length - 1)]} PASS`;
  $: transformerStatusLabel = transformerStatus === "done" && embeddingExtractor ? "cached" : transformerStatus;
  $: topRoute = routerResults[0];
  $: transformerConfidence = topRoute ? `${Math.round(topRoute.score * 100)}%` : "--";
  $: transformerLabel = topRoute?.label ?? "awaiting route";

  const resetTimedDemos = () => {
    clearTimeout(apiTimeout);
    clearTimeout(devOpsTimeout);
    clearTimeout(passkeyTimeout);
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

  const asVector = (output: EmbeddingOutput) => {
    const values = output.tolist();
    return Array.isArray(values[0]) ? values[0] as number[] : values as number[];
  };

  const cosineSimilarity = (left: number[], right: number[]) => {
    let dot = 0;
    let leftMagnitude = 0;
    let rightMagnitude = 0;

    for (let i = 0; i < left.length; i += 1) {
      const a = left[i] ?? 0;
      const b = right[i] ?? 0;
      dot += a * b;
      leftMagnitude += a * a;
      rightMagnitude += b * b;
    }

    return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
  };

  const runTransformerDemo = async () => {
    const input = transformerInput.trim();
    if (!input || transformerStatus === "loading" || transformerStatus === "running") return;

    transformerError = "";
    transformerStatus = embeddingExtractor ? "running" : "loading";

    try {
      if (!embeddingExtractor) {
        const { pipeline } = await import("@huggingface/transformers");
        embeddingExtractor = await pipeline(
          "feature-extraction",
          "Xenova/all-MiniLM-L6-v2"
        ) as EmbeddingPipeline;
      }

      transformerStatus = "running";
      if (!skillEmbeddings) {
        const labels = skillRoutes.map((route) => route.signal);
        skillEmbeddings = (await Promise.all(
          labels.map(async (label) => asVector(await embeddingExtractor!(label, { pooling: "mean", normalize: true })))
        ));
      }

      const inputEmbedding = asVector(await embeddingExtractor(input, { pooling: "mean", normalize: true }));
      routerResults = skillRoutes
        .map((route, index) => ({
          ...route,
          score: cosineSimilarity(inputEmbedding, skillEmbeddings?.[index] ?? []),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      transformerStatus = "done";
    } catch (error) {
      transformerError = error instanceof Error ? error.message : "Model execution failed";
      transformerStatus = "error";
    }
  };

  const runPasskeyCeremony = () => {
    clearTimeout(passkeyTimeout);
    const startedAt = performance.now();
    const challengeId = Math.floor(1000 + Math.random() * 9000);
    passkeyChallenge = `CHLG-${challengeId}`;
    passkeyCredential = "challenge issued";
    passkeyStep = "challenge";

    passkeyTimeout = setTimeout(() => {
      passkeyStep = "biometric";
      passkeyCredential = "platform authenticator unlocked";

      passkeyTimeout = setTimeout(() => {
        passkeyStep = "signed";
        passkeyCredential = `pk-${challengeId.toString(16)}-signed`;

        passkeyTimeout = setTimeout(() => {
          passkeyStep = "verified";
          passkeyLatency = `${Math.max(1, performance.now() - startedAt).toFixed(0)}ms`;
        }, 400);
      }, 450);
    }, 450);
  };

  const getPromptFactory = (): PromptFactory | undefined => {
    if (typeof window === "undefined") return undefined;
    const promptWindow = window as PromptWindow;
    return promptWindow.LanguageModel ?? promptWindow.ai?.languageModel;
  };

  const detectPromptApi = async () => {
    const factory = getPromptFactory();
    if (!factory) return;

    if (factory.availability) {
      try {
        const status = await factory.availability();
        if (status === "unavailable") return;
      } catch {
        return;
      }
    }
    promptApiSupported = true;
  };

  const runPromptNode = async () => {
    const input = promptInput.trim();
    if (!input || promptApiStatus === "running") return;
    const factory = getPromptFactory();
    if (!factory) return;

    promptApiStatus = "running";
    promptError = "";

    try {
      promptSession ??= await factory.create();
      promptOutput = await promptSession.prompt(input);
      promptApiStatus = "done";
    } catch (error) {
      promptError = error instanceof Error ? error.message : "Prompt API failed";
      promptApiStatus = "error";
    }
  };

  const runCpuWebGpuFallback = (startedAt: number) => {
    const values = Array.from({ length: 64 }, (_, index) => ((index * 17 + demoPulse * 11) % 29) > 13);
    webGpuMatrix = values;
    webGpuStatus = "cpu";
    webGpuSupported = false;
    webGpuWorkgroups = "CPU SIM";
    webGpuBufferSize = `${values.length * 4} B`;
    webGpuFrameTime = `${Math.max(1, performance.now() - startedAt).toFixed(2)}ms`;
  };

  const runWebGpuLab = async () => {
    if (webGpuStatus === "running") return;

    const startedAt = performance.now();
    webGpuStatus = "running";
    const gpu = (navigator as GpuNavigator).gpu;

    if (!gpu) {
      runCpuWebGpuFallback(startedAt);
      return;
    }

    try {
      const adapter = await gpu.requestAdapter();
      if (!adapter) {
        runCpuWebGpuFallback(startedAt);
        return;
      }

      const device = await adapter.requestDevice();
      const input = new Uint32Array(64);
      for (let i = 0; i < input.length; i += 1) input[i] = i + demoPulse;

      const buffer = device.createBuffer({
        size: input.byteLength,
        usage: 128 | 8 | 4,
      });
      const outputBuffer = device.createBuffer({
        size: input.byteLength,
        usage: 8 | 4,
      });
      device.queue.writeBuffer(buffer, 0, input);

      const encoder = device.createCommandEncoder();
      encoder.copyBufferToBuffer(buffer, 0, outputBuffer, 0, input.byteLength);
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();

      webGpuMatrix = Array.from(input, (value) => value % 3 === 0 || value % 7 === 0);
      webGpuStatus = "gpu";
      webGpuSupported = true;
      webGpuWorkgroups = "8 x 8";
      webGpuBufferSize = `${input.byteLength} B`;
      webGpuFrameTime = `${Math.max(1, performance.now() - startedAt).toFixed(2)}ms`;
    } catch {
      runCpuWebGpuFallback(startedAt);
    }
  };

  onMount(() => {
    detectPromptApi();

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

    }, container);

    return () => ctx.revert();
  });
</script>

<svelte:window on:keydown={handleModalKeydown} />

<section bind:this={container} class="max-w-content mx-auto px-4 md:px-8">
  <div class="grid min-w-0 grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-10 2xl:gap-16 py-12 md:py-24 lg:py-32 items-start">
    <div class="min-w-0">
      <div class="hero-tag tag-bracket mb-6" style="visibility:hidden;">
        [ RESUME // FULL STACK DEVELOPER // FLUTTER + VUE + GOLANG ]
      </div>

      <h1 class="hero-title heading-display safe-wrap text-[clamp(2.5rem,15vw,4.5rem)] md:text-6xl lg:text-8xl mb-8">
        <span class="hero-name hero-glitch inline-block" data-text="WATCHAKORN" style="visibility:hidden;">WATCHAKORN</span><br />
        <span class="hero-accent hero-glitch text-accent inline-block" data-text="BUDDEEWONG" style="visibility:hidden;">BUDDEEWONG</span>
      </h1>

      <div class="hero-desc max-w-xl min-w-0 mb-8 md:mb-10" style="visibility:hidden;">
        <p class="text-muted text-sm leading-relaxed">
          Full stack developer resume snapshot: Flutter mobile apps, Vue/Nuxt web platforms,
          and Golang backend services. Currently lead developer at Fakduai, architecting
          social media and POS systems from UI to API to deployment.
        </p>
      </div>

      <div class="hero-buttons grid grid-cols-1 gap-3 mb-10 sm:flex sm:flex-wrap">
        <a href="mailto:wk18k@proton.me" class="btn-primary w-full justify-center sm:w-auto" style="visibility:hidden;">
          CONTACT ME ↗
        </a>
        <button type="button" on:click={() => showProfileVideo = true} class="btn-outline w-full justify-center sm:w-auto" style="visibility:hidden;">
          WATCH PROFILE
        </button>
        <button type="button" on:click={downloadFile} class="btn-outline w-full justify-center sm:w-auto" style="visibility:hidden;">
          DOWNLOAD CV
        </button>
      </div>

      <div class="developer-console cq-panel card-industrial max-w-2xl min-w-0 p-4 md:p-5" style="visibility:hidden;">
        <div class="tag-bracket mb-3">[ RESUME STACK // MOBILE + WEB + BACKEND ]</div>
        {#each stackSignals as item}
          <div class="console-row console-row-cq grid grid-cols-[56px_minmax(0,1fr)] gap-3 border-t border-border py-3">
            <div class="text-accent text-[10px] font-bold tracking-widest">{item.layer}</div>
            <div class="text-xs text-muted safe-wrap min-w-0">{item.signal}</div>
            <div class="console-status hidden text-xs text-muted text-right">{item.status}</div>
          </div>
        {/each}
        <div class="border-t border-border pt-3 text-[10px] uppercase tracking-widest text-muted safe-wrap">
          &gt; flutter clients, vue dashboards, golang APIs — one resume, full pipeline
        </div>
      </div>
    </div>

    <figure class="hero-portrait card-industrial hidden min-w-0 p-3 group 2xl:block 2xl:w-full 2xl:max-w-none" style="visibility:hidden;">
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

  <div class="section-border-anim section-border scroll-line" />

  <div class="cq-panel stats-bar grid grid-cols-2 gap-0 border-b border-border overflow-hidden">
    {#each stats as stat, i}
      <div class="stat-item scroll-reveal min-w-0 p-4 md:p-8 {i < stats.length - 1 ? 'border-r border-border' : ''}">
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
    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] border border-border bg-card">
      <div class="p-5 md:p-6 lg:border-r border-border bg-substrate">
        <div class="tag-bracket mb-4">[ WASM OS NODE // V86 ]</div>
        <h2 class="heading-display text-2xl md:text-4xl mb-5">
          BOOT<br />LINUX
        </h2>
        <div class="accent-line mb-5" />
        <p class="text-xs text-muted leading-relaxed mb-6">
          Browser x86 emulator booting a Linux ISO through WebAssembly. All assets served locally — no external dependencies.
        </p>
        <div class="grid grid-cols-2 gap-0 border border-border text-[10px] uppercase tracking-widest mb-4">
          <div class="p-3 border-r border-border">
            <div class="text-muted">PROFILE</div>
            <div class="text-accent font-bold mt-1">LINUX</div>
          </div>
          <div class="p-3">
            <div class="text-muted">PAYLOAD</div>
            <div class="text-accent font-bold mt-1">~5.4 MB</div>
          </div>
        </div>
        <button
          type="button"
          class="btn-primary w-full justify-center"
          on:click={bootWasmOs}
          disabled={wasmOsLoaded}
        >
          {wasmOsLoaded ? 'OS BOOTED' : 'BOOT WASM OS'}
        </button>
      </div>

      <div class="relative min-h-[420px] md:min-h-[620px] min-w-0 max-w-full overflow-hidden wasm-os-shell scroll-parallax-soft">
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
          <div class="relative z-10 h-[420px] md:h-[560px] max-w-full overflow-hidden wasm-os-viewport">
            <div bind:this={wasmScreen} class="wasm-os-screen">
              <div class="wasm-os-text-screen" />
              <canvas class="hidden" />
            </div>
          </div>
        {:else}
          <div class="relative z-10 flex h-[320px] md:h-[380px] flex-col justify-center p-6 md:p-8">
            <div class="heading-display text-5xl md:text-7xl text-accent mb-4">86</div>
            <div class="text-[10px] uppercase tracking-widest text-white/65 space-y-2">
              <div>&gt; wasm runtime idle</div>
              <div>&gt; disk image detached</div>
              <div>&gt; press boot to mount linux</div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border scroll-line" />

  <div class="mini-demo-section py-16 md:py-24">
    <div class="mini-demo-title scroll-reveal mb-8">
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

    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] border border-border">
      <div class="mini-demo-control scroll-reveal p-5 md:p-6 lg:border-r border-border bg-substrate">
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

      <div class="mini-demo-panel scroll-reveal cq-panel min-w-0 overflow-hidden p-4 md:p-6 bg-card">
        {#key activeDemo + demoPulse}
          {#if activeDemo === 'mobile'}
            <div class="demo-mobile-grid grid grid-cols-1 gap-6 items-center">
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
              <div class="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div class="tag-bracket">[ VUE OPS DASHBOARD ]</div>
                <button type="button" class="text-accent text-[10px] font-bold tracking-widest" on:click={() => playDemo('web')}>REFRESH ↗</button>
              </div>
              <div class="grid grid-cols-1 min-[380px]:grid-cols-3 border-b border-border text-center text-[10px] uppercase tracking-widest">
                {#each ['ORDERS', 'USERS', 'LATENCY'] as metric, i}
                  <div class="p-4 {i < 2 ? 'border-r border-border' : ''}">
                    <div class="text-muted">{metric}</div>
                    <div class="heading-display text-xl text-accent mt-2">{i === highlightedRow ? 'LIVE' : 'OK'}</div>
                  </div>
                {/each}
              </div>
              <div class="p-4 space-y-2">
                {#each ['render product table', 'hydrate dashboard state', 'ship responsive layout'] as row, i}
                  <div class="grid grid-cols-[32px_minmax(0,1fr)_auto] gap-3 border border-border p-3 text-[10px] uppercase tracking-widest {highlightedRow === i ? 'bg-accent text-white border-accent' : 'bg-card'}">
                    <span>0{i + 1}</span>
                    <span class="min-w-0 safe-wrap">{row}</span>
                    <span class="text-right">{highlightedRow === i ? 'ACTIVE' : 'IDLE'}</span>
                  </div>
                {/each}
              </div>
            </div>
          {:else if activeDemo === 'api'}
            <div>
              <div class="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-3 mb-5">
                <div class="tag-bracket">[ API ROUTE SIMULATOR ]</div>
                <button type="button" class="btn-primary" on:click={() => playDemo('api')}>SEND REQUEST</button>
              </div>
              <svg viewBox="0 0 720 180" class="w-full max-w-full border border-border bg-substrate" role="img" aria-label="Client to gateway to Go service to Postgres route">
                <line x1="110" y1="90" x2="610" y2="90" stroke="currentColor" stroke-width="2" class="{apiStatus === 'idle' ? 'text-border' : 'text-accent'}" stroke-dasharray={apiStatus === 'sending' ? '12 10' : '0'} />
                {#each ['CLIENT', 'GATEWAY', 'GO SERVICE', 'POSTGRES'] as node, i}
                  <g transform="translate({80 + i * 180} 55)">
                    <rect width="100" height="70" fill="none" stroke="currentColor" stroke-width="2" class="{apiStatus === 'done' || (apiStatus === 'sending' && i < 3) ? 'text-accent' : 'text-ink'}" />
                    <text x="50" y="42" text-anchor="middle" class="fill-current text-[10px] font-bold tracking-widest">{node}</text>
                  </g>
                {/each}
              </svg>
              <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest safe-wrap">
                <div class="p-3 border-r border-border text-muted">METHOD: POST</div>
                <div class="p-3 border-r border-border text-muted">RUNTIME: GOLANG</div>
                <div class="p-3 text-accent font-bold">{apiStatus === 'done' ? '200 OK' : apiStatus === 'sending' ? 'PENDING' : 'READY'}</div>
              </div>
            </div>
          {:else if activeDemo === 'devops'}
            <div>
              <div class="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-4 mb-5">
                <div class="tag-bracket">[ DEVOPS DEPLOY GAME ]</div>
                <button type="button" class="btn-primary" on:click={() => playDemo('devops')}>RUN DEPLOY</button>
              </div>
              <div class="demo-devops-grid grid grid-cols-1 gap-0 border border-border bg-substrate">
                {#each devOpsSteps as step, i}
                  <div class="demo-devops-step p-4 border-b border-border {i <= devOpsProgress ? 'bg-accent text-white' : 'bg-card text-ink'}">
                    <div class="text-[10px] font-bold uppercase tracking-widest mb-8">0{i + 1}</div>
                    <div class="heading-display text-lg md:text-xl break-words">{step}</div>
                    <div class="text-[9px] uppercase tracking-widest mt-3 opacity-75">
                      {i < devOpsProgress ? 'PASSED' : i === devOpsProgress ? 'ACTIVE' : 'WAITING'}
                    </div>
                  </div>
                {/each}
              </div>
              <div class="demo-footer-4 grid grid-cols-2 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest">
                <div class="p-3 border-r border-border text-muted">IMAGE: DOCKER</div>
                <div class="p-3 border-r border-border text-muted">PIPELINE: JENKINS</div>
                <div class="p-3 border-r border-border text-muted">STORAGE: AWS S3 / GCP</div>
                <div class="p-3 text-accent font-bold">{devOpsStatus === 'deployed' ? 'EDGE LIVE' : devOpsStatus === 'building' ? 'BUILDING' : 'READY'}</div>
              </div>
            </div>
          {:else if activeDemo === 'data'}
            <div>
              <div class="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-4 mb-5">
                <div>
                  <div class="tag-bracket mb-2">[ DATA ROUTING GAME ]</div>
                  <div class="text-xs text-muted uppercase tracking-widest">ACTIVE STORE: {dataStatus}</div>
                </div>
                <button type="button" class="btn-primary" on:click={() => playDemo('data')}>ROUTE DATA</button>
              </div>
              <div class="demo-4col-grid grid grid-cols-1 gap-0 border border-border bg-substrate">
                {#each dataStores as store, i}
                  <div class="demo-4col-step p-5 border-b border-border {i === dataRoute ? 'bg-accent text-white' : 'bg-card text-ink'}">
                    <div class="text-[10px] font-bold uppercase tracking-widest mb-8">DB-0{i + 1}</div>
                    <div class="heading-display text-xl break-words">{store}</div>
                    <div class="text-[9px] uppercase tracking-widest mt-3 opacity-75">
                      {i === 0 ? 'RELATIONAL' : i === 1 ? 'DOCUMENT' : i === 2 ? 'CACHE' : 'OBJECTS'}
                    </div>
                  </div>
                {/each}
              </div>
              <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest safe-wrap">
                <div class="p-3 border-r border-border text-muted">SCHEMA: ATLAS / SQL</div>
                <div class="p-3 border-r border-border text-muted">FLOW: API WRITE</div>
                <div class="p-3 text-accent font-bold">{dataStatus}</div>
              </div>
            </div>
          {:else if activeDemo === 'testing'}
            <div>
              <div class="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-4 mb-5">
                <div>
                  <div class="tag-bracket mb-2">[ TEST / LOAD GAME ]</div>
                  <div class="text-xs text-muted uppercase tracking-widest">CHECKPOINT: {testStatus}</div>
                </div>
                <button type="button" class="btn-primary" on:click={() => playDemo('testing')}>RUN CHECK</button>
              </div>
              <div class="demo-4col-grid grid grid-cols-1 gap-0 border border-border bg-substrate">
                {#each testStages as stage, i}
                  <div class="demo-4col-step p-5 border-b border-border {i <= testLoad ? 'bg-accent text-white' : 'bg-card text-ink'}">
                    <div class="text-[10px] font-bold uppercase tracking-widest mb-8">QA-0{i + 1}</div>
                    <div class="heading-display text-xl break-words">{stage}</div>
                    <div class="text-[9px] uppercase tracking-widest mt-3 opacity-75">{i <= testLoad ? 'PASS' : 'WAIT'}</div>
                  </div>
                {/each}
              </div>
              <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest safe-wrap">
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
                <div class="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
                  <button type="button" class="btn-outline" on:click={() => playRedis('cache')}>CACHE LOOKUP</button>
                  <button type="button" class="btn-primary" on:click={() => playRedis('queue')}>PUSH JOB</button>
                </div>
              </div>

              <div class="demo-redis-grid grid grid-cols-1 gap-0 border border-border bg-substrate">
                <div class="demo-redis-cell p-5 border-b border-border">
                  <div class="tag-bracket mb-3">[ API READ ]</div>
                  <div class="heading-display text-2xl mb-3">GET /FEED</div>
                  <div class="text-xs text-muted leading-relaxed">Request checks Redis before touching database.</div>
                </div>
                <div class="demo-redis-cell p-5 border-b border-border {redisCacheWarm || redisQueueDepth > 0 ? 'bg-accent text-white' : 'bg-card text-ink'}">
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

              <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest safe-wrap">
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

  <div class="section-border-anim section-border scroll-line" />

  <div class="webgpu-section py-16 md:py-24">
    <div class="webgpu-title scroll-reveal mb-8">
      <div class="tag-bracket mb-4">[ WEBGPU COMPUTE // 2026 ]</div>
      <div class="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-12">
        <h2 class="heading-display text-2xl md:text-4xl">
          GPU<br />COMPUTE PASS
        </h2>
        <p class="text-muted text-xs leading-relaxed max-w-2xl">
          Tiny browser compute lab. It checks navigator.gpu, runs a lightweight GPU pass when available, then falls back to a CPU simulation without loading heavy files.
        </p>
      </div>
    </div>

    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] border border-border bg-card">
      <div class="webgpu-control scroll-reveal p-5 md:p-6 lg:border-r border-border bg-substrate">
        <div class="tag-bracket mb-4">[ COMPUTE CONTROL ]</div>
        <div class="grid grid-cols-2 gap-0 border border-border text-[10px] uppercase tracking-widest mb-5">
          <div class="p-3 border-r border-border">
            <div class="text-muted">NAVIGATOR.GPU</div>
            <div class="text-accent font-bold mt-1">{webGpuSupported ? 'READY' : 'CHECK'}</div>
          </div>
          <div class="p-3">
            <div class="text-muted">MODE</div>
            <div class="text-accent font-bold mt-1">{webGpuStatus === 'gpu' ? 'GPU' : webGpuStatus === 'cpu' ? 'CPU' : webGpuStatus}</div>
          </div>
        </div>
        <button
          type="button"
          class="btn-primary w-full justify-center"
          on:click={runWebGpuLab}
          disabled={webGpuStatus === 'running'}
        >
          {webGpuStatus === 'running' ? 'RUNNING PASS' : 'RUN GPU PASS'}
        </button>
      </div>

      <div class="webgpu-panel scroll-reveal min-w-0 overflow-hidden p-4 md:p-6 bg-card">
        <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border border-border text-[10px] uppercase tracking-widest mb-5 safe-wrap">
          <div class="p-3 border-r border-border">
            <div class="text-muted">WORKGROUPS</div>
            <div class="text-accent font-bold mt-1">{webGpuWorkgroups}</div>
          </div>
          <div class="p-3 border-r border-border">
            <div class="text-muted">BUFFER</div>
            <div class="text-accent font-bold mt-1">{webGpuBufferSize}</div>
          </div>
          <div class="p-3">
            <div class="text-muted">FRAME</div>
            <div class="text-accent font-bold mt-1">{webGpuFrameTime}</div>
          </div>
        </div>

        <div class="grid grid-cols-8 gap-px border border-border bg-border p-px" aria-label="WebGPU compute pixel matrix">
          {#each webGpuMatrix as active, index}
            <div class="aspect-square {active ? 'bg-accent' : 'bg-substrate'}" title="CELL {index}" />
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border scroll-line" />

  <div class="passkey-section py-16 md:py-24">
    <div class="scroll-reveal mb-8">
      <div class="tag-bracket mb-4">[ PASSKEYS // WEBAUTHN FLOW ]</div>
      <div class="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-12">
        <h2 class="heading-display text-2xl md:text-4xl">
          PASSWORDLESS<br />AUTH CEREMONY
        </h2>
        <p class="text-muted text-xs leading-relaxed max-w-2xl">
          Production-style passkey flow simulator: server challenge, device biometric unlock,
          signed assertion, backend verification. No real credential is created.
        </p>
      </div>
    </div>

    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] border border-border bg-card">
      <div class="scroll-reveal p-5 md:p-6 lg:border-r border-border bg-substrate">
        <div class="tag-bracket mb-4">[ AUTH CONTROL ]</div>
        <div class="grid grid-cols-2 gap-0 border border-border text-[10px] uppercase tracking-widest mb-5">
          <div class="p-3 border-r border-border">
            <div class="text-muted">CEREMONY</div>
            <div class="text-accent font-bold mt-1">{passkeyStep}</div>
          </div>
          <div class="p-3">
            <div class="text-muted">LATENCY</div>
            <div class="text-accent font-bold mt-1">{passkeyLatency}</div>
          </div>
        </div>
        <button
          type="button"
          class="btn-primary w-full justify-center"
          on:click={runPasskeyCeremony}
          disabled={passkeyStep === 'challenge' || passkeyStep === 'biometric' || passkeyStep === 'signed'}
        >
          {passkeyStep === 'challenge' || passkeyStep === 'biometric' || passkeyStep === 'signed' ? 'VERIFYING' : 'RUN PASSKEY FLOW'}
        </button>
      </div>

      <div class="scroll-reveal min-w-0 overflow-hidden p-4 md:p-6 bg-card">
        <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border border-border text-[10px] uppercase tracking-widest mb-5 safe-wrap">
          <div class="p-3 border-r border-border">
            <div class="text-muted">CHALLENGE</div>
            <div class="text-accent font-bold mt-1">{passkeyChallenge}</div>
          </div>
          <div class="p-3 border-r border-border">
            <div class="text-muted">AUTHENTICATOR</div>
            <div class="text-accent font-bold mt-1">PLATFORM</div>
          </div>
          <div class="p-3">
            <div class="text-muted">PASSWORD</div>
            <div class="text-accent font-bold mt-1">NONE</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-0 border border-border bg-substrate mb-5">
          {#each ['CHALLENGE', 'BIOMETRIC', 'ASSERTION', 'VERIFY'] as step, index}
            <div class="p-4 border-b sm:border-b-0 sm:border-r border-border {(['challenge', 'biometric', 'signed', 'verified'].indexOf(passkeyStep) >= index) ? 'bg-accent text-white' : 'bg-card text-muted'}">
              <div class="text-[10px] font-bold uppercase tracking-widest mb-8">0{index + 1}</div>
              <div class="heading-display text-lg break-words">{step}</div>
            </div>
          {/each}
        </div>

        <div class="border border-border bg-substrate p-5 min-h-[120px]">
          <div class="tag-bracket mb-4">[ ASSERTION OUTPUT ]</div>
          <div class="text-xs uppercase tracking-widest safe-wrap">{passkeyCredential}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border scroll-line" />

  {#if promptApiSupported}
    <div class="prompt-section py-16 md:py-24">
      <div class="scroll-reveal mb-8">
        <div class="tag-bracket mb-4">[ BUILT-IN AI // PROMPT API ]</div>
        <div class="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-12">
          <h2 class="heading-display text-2xl md:text-4xl">
            LOCAL<br />PROMPT NODE
          </h2>
          <p class="text-muted text-xs leading-relaxed max-w-2xl">
            Gemini Nano running inside this browser — no server, no API key, model managed by Chrome.
            Only visible when your browser ships the Prompt API.
          </p>
        </div>
      </div>

      <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] border border-border bg-card">
        <div class="scroll-reveal p-5 md:p-6 lg:border-r border-border bg-substrate">
          <div class="tag-bracket mb-4">[ PROMPT CONTROL ]</div>
          <div class="border border-border bg-card mb-4">
            <div class="grid grid-cols-[1fr_auto] border-b border-border text-[10px] uppercase tracking-widest">
              <div class="px-3 py-2 text-muted">INPUT PROMPT</div>
              <div class="border-l border-border px-3 py-2 text-accent font-bold">LOCAL</div>
            </div>
            <textarea
              bind:value={promptInput}
              class="w-full min-h-[100px] resize-none p-4 font-mono text-xs uppercase leading-relaxed tracking-widest outline-none placeholder:text-muted"
              style="background:#0a0a0a;color:#eaeaea;caret-color:#e61919;"
              aria-label="Prompt input"
              placeholder="TYPE A PROMPT..."
            />
          </div>
          <button
            type="button"
            class="btn-primary w-full justify-center"
            on:click={runPromptNode}
            disabled={promptApiStatus === 'running' || !promptInput.trim()}
          >
            {promptApiStatus === 'running' ? 'GENERATING' : 'RUN PROMPT'}
          </button>
        </div>

        <div class="scroll-reveal min-w-0 overflow-hidden p-4 md:p-6 bg-card">
          <div class="grid grid-cols-2 gap-0 border border-border text-[10px] uppercase tracking-widest mb-5">
            <div class="p-3 border-r border-border">
              <div class="text-muted">MODEL</div>
              <div class="text-accent font-bold mt-1">GEMINI NANO</div>
            </div>
            <div class="p-3">
              <div class="text-muted">STATUS</div>
              <div class="text-accent font-bold mt-1">{promptApiStatus}</div>
            </div>
          </div>

          <div class="border border-border bg-substrate p-5 min-h-[180px]">
            <div class="tag-bracket mb-4">[ MODEL OUTPUT ]</div>
            {#if promptApiStatus === 'error'}
              <div class="heading-display text-2xl text-accent mb-3">ERR</div>
              <div class="text-xs text-muted break-words">{promptError}</div>
            {:else if promptOutput}
              <div class="text-xs leading-relaxed safe-wrap">{promptOutput}</div>
            {:else}
              <div class="text-xs text-muted uppercase tracking-widest">&gt; awaiting prompt</div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="section-border-anim section-border scroll-line" />
  {/if}

  <div class="transformers-section py-16 md:py-24">
    <div class="transformers-title scroll-reveal tag-bracket mb-8">[ LOCAL AI NODE // TRANSFORMERS.JS V3 ]</div>
    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] border border-border bg-card">
      <div class="transformers-control scroll-reveal p-5 md:p-6 lg:border-r border-border bg-substrate">
        <div class="tag-bracket mb-4">[ BROWSER ML // NO BACKEND ]</div>
        <h2 class="heading-display text-2xl md:text-4xl mb-5">
          SEMANTIC<br />ROUTER
        </h2>
        <div class="accent-line mb-5" />
        <p class="text-xs text-muted leading-relaxed mb-5">
          Transformers.js turns requirements into embeddings, compares them against portfolio skill vectors, then routes the work to the best technical layer.
        </p>
        <div class="border border-border bg-card">
          <div class="grid grid-cols-[1fr_auto] border-b border-border text-[10px] uppercase tracking-widest">
            <div class="px-3 py-2 text-muted">INPUT BUFFER</div>
            <div class="border-l border-border px-3 py-2 text-accent font-bold">UTF-8</div>
          </div>
          <textarea
            bind:value={transformerInput}
            class="w-full min-h-[118px] resize-none p-4 font-mono text-xs uppercase leading-relaxed tracking-widest outline-none placeholder:text-muted"
            style="background:#0a0a0a;color:#eaeaea;caret-color:#e61919;"
            aria-label="Skill routing input"
            placeholder="TYPE SIGNAL TEXT..."
          />
          <div class="grid grid-cols-[1fr_auto] border-t border-border text-[10px] uppercase tracking-widest">
            <div class="px-3 py-2 text-muted">CHARS: {transformerInput.length}</div>
            <button
              type="button"
              class="border-l border-border px-4 py-2 font-bold text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent"
              on:click={runTransformerDemo}
              disabled={transformerStatus === 'loading' || transformerStatus === 'running' || !transformerInput.trim()}
            >
              {transformerStatus === 'loading' ? 'LOADING' : transformerStatus === 'running' ? 'RUNNING' : 'EXECUTE'}
            </button>
          </div>
        </div>
      </div>

      <div class="transformers-panel scroll-reveal min-w-0 overflow-hidden p-4 md:p-6 bg-card">
        <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border border-border text-[10px] uppercase tracking-widest mb-5 safe-wrap">
          <div class="p-3 border-r border-border">
            <div class="text-muted">STATUS</div>
            <div class="text-accent font-bold mt-1">{transformerStatusLabel}</div>
          </div>
          <div class="p-3 border-r border-border">
            <div class="text-muted">MODEL</div>
            <div class="text-accent font-bold mt-1">MINILM</div>
          </div>
          <div class="p-3">
            <div class="text-muted">DEVICE</div>
            <div class="text-accent font-bold mt-1">WASM</div>
          </div>
        </div>

        <div class="border border-border bg-substrate p-5 min-h-[220px]">
          <div class="tag-bracket mb-4">[ INFERENCE OUTPUT ]</div>
          {#if transformerStatus === 'error'}
            <div class="heading-display text-3xl md:text-5xl text-accent mb-4">ERR</div>
            <div class="text-xs uppercase tracking-widest text-muted break-words">{transformerError}</div>
          {:else}
            <div class="heading-display text-3xl md:text-5xl text-accent mb-4">{transformerLabel}</div>
            <div class="grid grid-cols-[minmax(0,6rem)_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)] gap-0 border border-border text-[10px] uppercase tracking-widest mb-4 safe-wrap">
              <div class="p-3 border-r border-border text-muted">MATCH</div>
              <div class="p-3 font-bold">{transformerConfidence}</div>
              <div class="p-3 border-r border-t border-border text-muted">PIPELINE</div>
              <div class="p-3 border-t border-border font-bold">FEATURE-EXTRACTION</div>
              <div class="p-3 border-r border-t border-border text-muted">RUNTIME</div>
              <div class="p-3 border-t border-border font-bold">TRANSFORMERS.JS</div>
            </div>
            <div class="space-y-2">
              {#each routerResults as route, index}
                <div class="grid grid-cols-[2rem_minmax(0,1fr)_3rem] sm:grid-cols-[2.5rem_minmax(0,1fr)_4rem] gap-0 border border-border text-[10px] uppercase tracking-widest {index === 0 ? 'bg-accent text-white border-accent' : 'bg-card text-muted'}">
                  <div class="p-2 border-r border-border">0{index + 1}</div>
                  <div class="p-2 border-r border-border font-bold safe-wrap min-w-0">{route.label}</div>
                  <div class="p-2 font-bold">{Math.round(route.score * 100)}%</div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="section-border-anim section-border scroll-line" />

  <div class="skills-section py-16 md:py-24">
    <div class="skills-title scroll-reveal tag-bracket mb-8">[ TECHNICAL STACK ]</div>
    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-0 border border-border">
      <div class="skill-card scroll-reveal p-6 md:p-8 lg:border-r border-border bg-substrate">
        <div class="tag-bracket mb-6">[ OPERATING LAYERS ]</div>
        <div class="space-y-4">
          {#each stackSignals as signal}
            <div class="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-t border-border pt-4">
              <div class="text-accent text-[10px] font-bold tracking-widest">{signal.layer}</div>
              <div>
                <div class="text-xs font-bold uppercase tracking-wider text-ink safe-wrap">{signal.signal}</div>
                <div class="text-[10px] uppercase tracking-widest text-muted mt-1">{signal.status}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="cq-panel skill-grid grid grid-cols-1">
        {#each skills as skill}
          <div class="skill-card scroll-reveal skill-card-cq p-6 border-t border-border">
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

  <div class="section-border-anim section-border scroll-line" />

  <div class="webmcp-section py-16 md:py-24">
    <div class="webmcp-title scroll-reveal mb-8">
      <div class="tag-bracket mb-4">[ WEBMCP BEST PRACTICES // CHROME AI ]</div>
      <div class="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6 lg:gap-12">
        <h2 class="heading-display text-2xl md:text-4xl">
          AGENT<br />TOOL DESIGN
        </h2>
        <p class="text-muted text-xs leading-relaxed max-w-2xl">
          Best practices for building WebMCP tools that AI agents can use reliably.
          Derived from Chrome's developer documentation on tool strategy, naming, compute, reliability, and evaluation-driven development.
        </p>
      </div>
    </div>

    <div class="cq-panel grid grid-cols-1 border border-border">
      {#each webMcpPractices as practice, i}
        <div class="webmcp-card scroll-reveal webmcp-card-cq grid grid-cols-1 gap-0 {i < webMcpPractices.length - 1 ? 'border-b border-border' : ''}">
          <div class="webmcp-id p-5 border-border bg-substrate">
            <div class="heading-display text-2xl md:text-3xl text-accent">{practice.id}</div>
          </div>
          <div class="webmcp-rule p-5 border-border">
            <div class="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">{practice.title}</div>
            <div class="text-xs font-bold uppercase tracking-wider text-ink safe-wrap">{practice.rule}</div>
          </div>
          <div class="p-5 bg-card">
            <div class="text-xs text-muted leading-relaxed">{practice.detail}</div>
          </div>
        </div>
      {/each}
    </div>

    <div class="grid grid-cols-1 min-[380px]:grid-cols-3 gap-0 border-x border-b border-border text-[10px] uppercase tracking-widest safe-wrap">
      <div class="p-3 border-r border-border text-muted">SOURCE: CHROME DEV DOCS</div>
      <div class="p-3 border-r border-border text-muted">SPEC: WEBMCP</div>
      <div class="p-3 text-accent font-bold">5 RULES</div>
    </div>
  </div>

  <div class="section-border-anim section-border scroll-line" />

  <div class="roles-section py-16 md:py-24">
    <div class="grid min-w-0 grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      <div class="role-left scroll-reveal-left">
        <div class="tag-bracket mb-4">[ CURRENT ROLE // 2026 ]</div>
        <h2 class="heading-display text-2xl md:text-3xl mb-4">
          FAKDUAI LOGISTICS<br/>& DIGITAL PLATFORM
        </h2>
        <div class="accent-line-anim accent-line scroll-line mb-6" />
        <p class="text-muted text-xs leading-relaxed">
          Lead developer and architect for Pinto social media super app and mobile POS system.
          Designed full project architecture, mentored juniors, shipped to both App Store
          and Google Play. Built with Go (Echo), Flutter BLoC, Vue/Nuxt, PostgreSQL, MongoDB, Redis.
        </p>
      </div>
      <div class="role-right scroll-reveal-right">
        <div class="tag-bracket mb-4">[ PREVIOUS // JUN-DEC 2024 ]</div>
        <h2 class="heading-display text-2xl md:text-3xl mb-4">
          IBOTNOI
        </h2>
        <div class="accent-line-anim accent-line scroll-line mb-6" />
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
      class="relative w-full max-w-[calc(100vw-2rem)] md:max-w-6xl border-2 border-ink bg-substrate shadow-[6px_6px_0_var(--color-accent)] md:shadow-[14px_14px_0_var(--color-accent)]"
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
              <div class="grid grid-cols-2 sm:grid-cols-[auto_1fr_auto_auto] gap-2 sm:gap-3 p-2 items-center text-[9px] sm:text-[10px] uppercase tracking-widest">
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
  .wasm-os-screen {
    background: #0a0a0a;
    color: #eaeaea;
  }

  .wasm-os-viewport {
    padding: 0;
  }

  .wasm-os-screen {
    position: relative;
    height: 100%;
    overflow: hidden;
    padding: 0;
    font: 13px/1.35 JetBrains Mono, monospace;
  }

  .wasm-os-screen :global(canvas) {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  .wasm-os-text-screen {
    position: absolute;
    inset: 0;
    overflow: hidden;
    white-space: pre;
  }

</style>
