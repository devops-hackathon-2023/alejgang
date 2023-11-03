<script lang="ts">
  import '../app.css';

  import { getAppModulesBySas, getSASes } from '$lib';
  import { selectOptions } from '$lib/util';
  import { either, option } from 'fp-ts';
  import Loader from '../components/elements/loader.svelte';
  import Select from '../components/elements/select.svelte';
  import Main from '../components/layout/main.svelte';
  import Sidebar from '../components/layout/sidebar.svelte';

  let sasIdInput: [string, string] | null = null;
  $: sasId = sasIdInput === null ? option.none : option.some(sasIdInput);
</script>

<Main>
  <Sidebar>
    {#await getSASes()}
      <Loader />
    {:then sases}
      {#if either.isLeft(sases)}
        very error help
      {:else}
        <Select bind:value={sasIdInput} options={selectOptions(sases.right.toLog())} />
      {/if}
    {/await}

    {#if option.isSome(sasId)}
      {#await getAppModulesBySas(sasId.value[0])()}
        <Loader />
      {:then appModules}
        {#if either.isLeft(appModules)}
          very error help
        {:else}
          <Select options={selectOptions(appModules.right.toLog())} />
        {/if}
      {/await}
    {/if}
  </Sidebar>

  <slot />
</Main>
