<script lang="ts">
  import "../app.css";
  import { base } from "$app/paths";
</script>

<div
  class="navbar
bg-base-200 text-base-content sticky top-0 z-30 flex w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 [transform:translate3d(0,0,0)]
shadow-sm font-mono
"
>
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="{base}/">Home</a>
  </div>
  <div class="flex-none hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="/about">About</a>
      </li>
    </ul>
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="https://github.com/watchakorn-18k/" target="_blank">Github</a>
      </li>
    </ul>
  </div>
  <div class="flex-none hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="https://watchakorn-18k.github.io/wk-docs/blog" target="_blank"
          >Blog</a
        >
      </li>
    </ul>
  </div>
  <div class="flex-none hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="https://watchakorn-18k.github.io/wk-docs/tutorials"
          >Tutorials</a
        >
      </li>
    </ul>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="{base}/certificate">Certificate</a></li>
    </ul>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal">
      <li><a href="{base}/portfolio">Portfolio</a></li>
    </ul>
  </div>
</div>

<slot />
