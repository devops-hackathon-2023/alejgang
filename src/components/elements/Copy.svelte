<script lang="ts">
  import { copy } from '$lib/util';
  import { Check, Copy } from 'lucide-svelte';

  export let prefix: string | number | undefined = undefined;
  export let text: string;
  export let suffix: string | number | undefined = undefined;

  export let truncate = false;

  let copied = false;
</script>

<button
  class="font-mono text-[10px] flex gap-2 border border-solid border-transparent hover:border-csas-200 rounded-lg transition p-2 min-w-0 max-w-full items-center"
  on:click={() => {
    copy(text ?? '');
    copied = true;
    setInterval(() => {
      copied = false;
    }, 3000);
  }}
>
  <p class:truncate>
    {prefix ?? ''}{text}{suffix ?? ''}
  </p>
  {#if copied}
    <Check size={14} />
  {:else}
    <Copy size={14} />
  {/if}
</button>
