<script lang="ts">
  import '../app.css';

  import { getAppModulesBySas, getSASes } from '$lib';
  import { humanize } from '$lib/string';
  import { selectOptions } from '$lib/util';
  import { either, option } from 'fp-ts';
  import Loader from '../components/elements/loader.svelte';
  import Select from '../components/elements/select.svelte';
  import Main from '../components/layout/main.svelte';
  import Sidebar from '../components/layout/sidebar.svelte';
  import { selectedAppModule } from '../stores';

  let sasIdInput: [string, string] | null = null;
  $: sasId = sasIdInput === null ? option.none : option.some(sasIdInput);

  let selectedAppModuleId: string | null = null;
  selectedAppModule.subscribe((id) => {
    selectedAppModuleId = id;
  });
</script>

<Main>
  <Sidebar>
    {#await getSASes()}
      <Loader />
    {:then sases}
      {#if either.isLeft(sases)}
        very error help
      {:else}
        <Select
          bind:value={sasIdInput}
          options={selectOptions(sases.right)}
          placeholder="Select SAS..."
        />
      {/if}
    {/await}

    {#if option.isSome(sasId)}
      {#await getAppModulesBySas(sasId.value[0])()}
        <Loader />
      {:then appModules}
        {#if either.isLeft(appModules)}
          very error help
        {:else}
          <section class="flex flex-1 flex-col" aria-label="Module selector">
            <ul role="list" class="space-y-1">
              {#each appModules.right as module}
                <li>
                  <a
                    href="#"
                    class={selectedAppModuleId === module.id
                      ? 'text-csasBlue-50 bg-csasBlue-500 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-medium'
                      : 'text-csasBlue-50 hover:bg-csasBlue-500 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-medium'}
                    on:click={() => {
                      if (selectedAppModuleId !== module.id) selectedAppModule.set(module.id);
                    }}>{humanize(module.name)}</a
                  >
                </li>
              {/each}
            </ul>
          </section>
        {/if}
      {/await}
    {/if}
  </Sidebar>

  <section>
    <slot />
  </section>
</Main>
