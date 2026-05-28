<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { onDestroy, onMount } from "svelte";

  let speechSupported = false;
  let isSpeaking = false;
  let preferredSpeechVoice: SpeechSynthesisVoice | null = null;

  const selectPreferredSpeechVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const voices = window.speechSynthesis.getVoices();
    preferredSpeechVoice = voices.find((voice) => /male|daniel|david|alex|fred|mark/i.test(voice.name) && voice.lang.startsWith("en"))
      ?? voices.find((voice) => voice.lang.startsWith("en"))
      ?? null;
  };

  const getCurrentPageText = () => {
    return document.querySelector("main")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 1600)
      ?? "Watchakorn Buddeewong portfolio page.";
  };

  const stopSpeaking = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    isSpeaking = false;
  };

  const speakCurrentPage = () => {
    if (!speechSupported || typeof window === "undefined" || !("SpeechSynthesisUtterance" in window)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(getCurrentPageText());
    if (preferredSpeechVoice) utterance.voice = preferredSpeechVoice;
    utterance.lang = preferredSpeechVoice?.lang ?? "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 0.8;
    utterance.onend = () => isSpeaking = false;
    utterance.onerror = () => isSpeaking = false;

    window.speechSynthesis.cancel();
    isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  };

  onMount(() => {
    speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    if (!speechSupported) return;

    selectPreferredSpeechVoice();
    window.speechSynthesis.onvoiceschanged = selectPreferredSpeechVoice;
  });

  afterNavigate(() => {
    stopSpeaking();
  });

  onDestroy(() => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    }
  });
</script>

<button
  type="button"
  class="fixed bottom-3 right-3 z-[60] max-w-[calc(100vw-1.5rem)] border-2 border-ink bg-substrate px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest text-ink shadow-[3px_3px_0_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:bottom-6 md:right-6 md:px-4 md:py-3 md:text-[10px] md:shadow-[4px_4px_0_var(--color-ink)]"
  class:bg-accent={isSpeaking}
  class:text-white={isSpeaking}
  on:click={speakCurrentPage}
  disabled={!speechSupported}
  aria-pressed={isSpeaking}
  aria-label={isSpeaking ? "Stop speaking page text" : "Read current page text aloud"}
  title={isSpeaking ? "Stop speaking page text" : "Read current page text aloud"}
>
  {isSpeaking ? "▰ SPEAKING NOW" : "▱ READ PAGE"}
</button>
