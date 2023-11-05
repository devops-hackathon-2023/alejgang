<script lang="ts">
  import '$src/styles/global.scss';
  import '../app.css';

  import { getAppModulesBySas, getSASes } from '$lib';
  import type { AppModuleResponse } from '$lib/client';
  import { classNames, humanize } from '$lib/string';
  import { selectOptions } from '$lib/util';
  import { either, option } from 'fp-ts';
  import Loader from '../components/elements/Loader.svelte';
  import Select from '../components/elements/Select.svelte';
  import Sidebar from '../components/layout/Sidebar.svelte';
  import { selectedAppModule } from '../stores';

  let appModules: AppModuleResponse[] = [];

  let sasIdInput: [string, string] | null = null;
  $: sasId = sasIdInput === null ? option.none : option.some(sasIdInput);

  $: if (option.isSome(sasId)) {
    getAppModulesBySas(sasId.value[0])().then((resp) => {
      if (either.isRight(resp)) {
        appModules = [...resp.right];
        selectedAppModule.set(resp.right[0].id);
      }
    });
  }

  let selectedAppModuleId: string | null = null;
  selectedAppModule.subscribe((id) => {
    selectedAppModuleId = id;
  });
</script>

<Sidebar>
  <ul role="list" class="flex flex-1 flex-col gap-y-5">
    {#await getSASes()}
      <Loader />
    {:then sases}
      {#if either.isLeft(sases)}
        very error help
      {:else}
        <section class="-mx-2">
          <Select
            bind:value={sasIdInput}
            options={selectOptions(sases.right)}
            placeholder="Select SAS..."
          />
        </section>
      {/if}
    {/await}

    {#if option.isSome(sasId)}
      <li>
        <div class="text-xs font-semibold leading-6 text-csas-100 uppercase">App modules</div>
        <ul role="list" class="-mx-2 mt-2 space-y-1">
          {#each appModules as module (module.id)}
            <li>
              <a
                href="#"
                class={classNames(
                  selectedAppModuleId === module.id
                    ? 'bg-csas-700 text-white'
                    : 'text-csas-50 hover:text-white hover:bg-csas-700',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all'
                )}
                on:click={() => {
                  if (selectedAppModuleId !== module.id) selectedAppModule.set(module.id);
                }}
              >
                <span class="truncate">{humanize(module.name)}</span>
              </a>
            </li>
          {/each}
        </ul>
      </li>
    {/if}
    <li class="-mx-6 mt-auto">
      <p>nejaky vecicky dole hello</p>
    </li>
  </ul>
</Sidebar>

<section class="py-10 lg:pl-72">
  <div class="px-4 sm:px-6 lg:px-8">
    <slot />
  </div>
</section>
