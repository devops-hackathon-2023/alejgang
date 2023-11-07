<script lang="ts">
  import '$src/styles/global.scss';
  import '../app.css';

  import { getAppModulesBySas, getSASes } from '$lib';
  import type { AppModuleResponse, SasResponse } from '$lib/client';
  import { optionEqString } from '$lib/eq';
  import { classNames, humanize } from '$lib/string';
  import { selectOptions } from '$lib/util';
  import { either, option } from 'fp-ts';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Loader from '../components/elements/Loader.svelte';
  import Select from '../components/elements/Select.svelte';
  import Sidebar from '../components/layout/Sidebar.svelte';
  import { favorites, selectedAppModule, selectedSas } from '../stores';

  let appModules: AppModuleResponse[] = [];

  let sasIdInput: [string, string] | null = null;
  $: sasId = sasIdInput === null ? option.none : option.some(sasIdInput);

  selectedSas.subscribe((sas) => {
    if (option.isSome(sas) && sas.value.id !== sasIdInput?.at(0)) {
      sasIdInput = [sas.value.id, sas.value.name];
    }
  });

  $: if (option.isSome(sasId)) {
    getAppModulesBySas(sasId.value[0])().then((resp) => {
      if (either.isRight(resp)) {
        appModules = [...resp.right];
        selectedAppModule.set(option.some(resp.right[0]));
      }
    });
  }

  let selectedAppModuleId: option.Option<string> = option.none;
  selectedAppModule.subscribe((module) => {
    selectedAppModuleId = option.map<AppModuleResponse, string>(($) => $.id)(module);

    const sas = get(selectedSas);

    if (option.isSome(sas) && option.isSome(module)) {
      localStorage.setItem('last', JSON.stringify([sas.value, module.value]));
    }
  });

  let favs: [SasResponse, AppModuleResponse][] = [];
  favorites.subscribe(($) => {
    favs = [...$];
  });

  onMount(() => {
    const storageFavorites = localStorage.getItem('favorites');

    if (storageFavorites) {
      const favoritesJson = JSON.parse(storageFavorites);

      favorites.set(favoritesJson);
    }

    const storageLast = localStorage.getItem('last');

    if (storageLast) {
      const [sas, appModule] = JSON.parse(storageLast);

      selectedSas.set(option.some(sas));

      // fuj, can be avoided by storing sasId and appModuleId in the same store (tuple), because there is never a sas selected without an appModule
      setTimeout(() => {
        selectedAppModule.set(option.some(appModule));
      }, 500);
    }
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
            on:change={(event) => {
              selectedSas.set(
                option.fromNullable(sases.right.find(($) => $.id === event.detail.id) ?? null)
              );
            }}
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
                  optionEqString.equals(option.some(module.id), selectedAppModuleId)
                    ? 'bg-csas-700 text-white'
                    : 'text-csas-50 hover:text-white hover:bg-csas-700',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all'
                )}
                on:click={() => {
                  if (!optionEqString.equals(option.some(module.id), selectedAppModuleId)) {
                    console.log('selection!!!');
                    selectedAppModule.set(option.some(module));
                  }
                }}
              >
                <span class="truncate">{humanize(module.name)}</span>
              </a>
            </li>
          {/each}
        </ul>
      </li>
    {/if}
    {#if favs.length !== 0}
      <li class="mt-auto">
        <div class="text-xs font-semibold leading-6 text-csas-100 uppercase">Favorites</div>
        <ul role="list" class="-mx-2 mt-2 space-y-1">
          {#each favs as [sas, appModule]}
            <li>
              <button
                on:click={() => {
                  selectedSas.set(option.some(sas));

                  // fuj, can be avoided by storing sasId and appModuleId in the same store (tuple), because there is never a sas selected without an appModule
                  setTimeout(() => {
                    selectedAppModule.set(option.some(appModule));
                  }, 300);
                }}
                class={classNames(
                  optionEqString.equals(option.some(appModule.id), selectedAppModuleId)
                    ? 'bg-csas-700 text-white'
                    : 'text-csas-50 hover:text-white hover:bg-csas-700',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all w-full'
                )}
              >
                <span class="truncate">{humanize(sas.name)} - {humanize(appModule.name)}</span>
              </button>
            </li>
          {/each}
        </ul>
      </li>
    {/if}
  </ul>
</Sidebar>

<section class="py-10 lg:pl-72">
  <div class="px-4 sm:px-6 lg:px-8">
    <slot />
  </div>
</section>
