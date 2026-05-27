<script lang="ts">
  import "../app.css";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { theme } from "$lib/theme";
  import { onMount } from "svelte";

  onMount(() => {
    theme.init();
  });

  const navLinks = [
    { href: "/", label: "INDEX" },
    { href: "/about", label: "ABOUT" },
    { href: "/portfolio", label: "WORK" },
    { href: "/certificate", label: "CERT" },
  ];

  const externalLinks = [
    { href: "https://github.com/watchakorn-18k/", label: "GH" },
    { href: "https://www.linkedin.com/in/watchakorn/", label: "LI" },
    { href: "https://watchakorn-18k.github.io/wk-docs/blog", label: "BLOG" },
  ];
</script>

<div class="noise-overlay min-h-screen flex flex-col">
  <nav class="border-b-2 border-ink bg-substrate sticky top-0 z-40">
    <div class="max-w-content mx-auto px-4 md:px-8">
      <div class="flex items-center justify-between h-12">
        <a href="{base}/" class="font-mono text-[11px] font-bold tracking-widest uppercase text-ink">
          WK-18K
        </a>

        <div class="hidden md:flex items-center">
          {#each navLinks as link}
            <a
              href="{base}{link.href === '/' ? '/' : link.href}"
              class="nav-link"
              class:active={
                link.href === '/'
                  ? $page.url.pathname === base + '/' || $page.url.pathname === base
                  : $page.url.pathname.startsWith(base + link.href)
              }
            >
              {link.label}
            </a>
          {/each}
          <span class="mx-3 text-border">|</span>
          {#each externalLinks as link}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link"
            >
              {link.label} ↗
            </a>
          {/each}
          <span class="mx-3 text-border">|</span>
          <button
            class="theme-toggle"
            on:click={() => theme.toggle()}
            aria-label="Toggle theme"
          >
            {$theme === 'light' ? 'DK' : $theme === 'dark' ? 'SYS' : 'LT'}
          </button>
        </div>

        <div class="md:hidden flex items-center gap-1">
          {#each navLinks as link}
            <a
              href="{base}{link.href === '/' ? '/' : link.href}"
              class="nav-link text-[9px]"
              class:active={
                link.href === '/'
                  ? $page.url.pathname === base + '/' || $page.url.pathname === base
                  : $page.url.pathname.startsWith(base + link.href)
              }
            >
              {link.label}
            </a>
          {/each}
          <button
            class="theme-toggle"
            on:click={() => theme.toggle()}
            aria-label="Toggle theme"
          >
            {$theme === 'light' ? 'DK' : $theme === 'dark' ? 'SYS' : 'LT'}
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="border-t-2 border-ink mt-auto">
    <div class="max-w-content mx-auto px-4 md:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="tag-bracket">
          [ WATCHAKORN BUDDEEWONG // SOFTWARE DEVELOPER // 2025 ]
        </div>
        <div class="flex gap-6">
          <a href="mailto:wk18k@proton.me" class="tag-bracket hover:text-ink transition-colors">
            EMAIL
          </a>
          <a href="https://github.com/watchakorn-18k/" target="_blank" rel="noopener noreferrer" class="tag-bracket hover:text-ink transition-colors">
            GITHUB
          </a>
          <a href="https://www.linkedin.com/in/watchakorn/" target="_blank" rel="noopener noreferrer" class="tag-bracket hover:text-ink transition-colors">
            LINKEDIN
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>
