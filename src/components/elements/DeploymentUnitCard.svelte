<script lang="ts">
  import Copy from '$components/elements/Copy.svelte';
  import { GitBranch } from 'lucide-svelte';

  export let repo: string | undefined = undefined;
  export let id: string | undefined = undefined;
</script>

<div class="flex flex-col rounded-2xl border border-inherit p-4 gap-2 min-w-0">
  <div class="flex justify-between items-center">
    <h3 class="text-lg block flex-grow min-w-fit">
      <slot name="name" />
    </h3>
    {#if id}
      <div class="max-w-full min-w-0">
        <Copy prefix="" text={id} truncate />
      </div>
    {/if}
  </div>
  {#if repo}
    <a
      class="flex gap-2 items-center bg-csas-100 rounded-lg p-2 pr-3 font-mono max-w-fit text-xs"
      target="_blank"
      href={repo}
    >
      <GitBranch size={16} />
      <div class="max-w-full min-w-0 truncate">
        {repo}
      </div>
    </a>
  {/if}
  <slot />
</div>
