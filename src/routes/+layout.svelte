<script lang="ts">
  import '$src/styles/global.scss';
  import '../app.css';

  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { getAppModulesBySas } from '$lib';
  import type { AppModuleResponse, SasResponse } from '$lib/client';
  import { optionEqString } from '$lib/eq';
  import { classNames, humanize } from '$lib/string';
  import { selectOptions } from '$lib/util';
  import { favorites } from '$src/stores';
  import { either, option } from 'fp-ts';
  import { onMount } from 'svelte';
  import Select from '../components/elements/Select.svelte';
  import Sidebar from '../components/layout/Sidebar.svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  let appModules: AppModuleResponse[] = [];

  let sasIdInput: [string, string] | null = null;
  $: sasId = sasIdInput === null ? option.none : option.some(sasIdInput);

  $: if (option.isSome(sasId)) {
    getAppModulesBySas(sasId.value[0])().then((resp) => {
      if (either.isRight(resp)) {
        appModules = [...resp.right];
      }
    });
  }

  let favs: [SasResponse, AppModuleResponse][] = [];
  favorites.subscribe(($) => {
    favs = [...$];
  });

  $: if ($page.data['sas']?.id && $page.data['sas']?.name) {
    sasIdInput = [$page.data['sas'].id, $page.data['sas'].name];
  }

  onMount(async () => {
    const storageFavorites = localStorage.getItem('favorites');

    if (storageFavorites) {
      const favoritesJson = JSON.parse(storageFavorites);

      favorites.set(favoritesJson);
    }

    // const storageLast = localStorage.getItem('last');

    // if (storageLast) {
    //   const [sas, appModule] = JSON.parse(storageLast);

    //   console.log('GOTO IN storageLast');
    //   await goto(`/${appModule.id}`);

    //   sasIdInput = [sas.id, sas.name];
    // }
  });
</script>

<Sidebar>
  <ul role="list" class="flex flex-1 flex-col gap-y-6">
    <section class="-mx-2">
      <Select
        bind:value={sasIdInput}
        on:change={async (event) => {
          const modules = await getAppModulesBySas(event.detail.id)();

          if (either.isLeft(modules) || modules.right.length === 0) {
            return;
          }

          // console.log('GOTO IN select');
          // localStorage.setItem(
          //   'last',
          //   JSON.stringify([$page.data['sas'], $page.data['appModule']])
          // );
          await goto(`/${modules.right[0].id}`);
        }}
        options={selectOptions(data.sases)}
        placeholder="Select SAS..."
      />
    </section>

    {#if option.isSome(sasId)}
      <li>
        <div class="text-xs font-semibold leading-6 text-csas-100 uppercase">App modules</div>
        <ul role="list" class="-mx-2 mt-2 space-y-1">
          {#each appModules as module (module.id)}
            <li>
              <a
                href="{base}/{module.id}"
                class={classNames(
                  optionEqString.equals(
                    option.some(module.id),
                    option.fromNullable($page.params['appModuleId'])
                  )
                    ? 'bg-csas-700 text-white'
                    : 'text-csas-50 hover:text-white hover:bg-csas-700',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all'
                )}
              >
                <span class="truncate">{humanize(module.name)}</span>
              </a>
            </li>
          {/each}
        </ul>
      </li>
    {/if}
    {#if favs.length !== 0}
      <li class="mt-auto pt-2 border-t border-csas-400">
        <div class="text-xs font-semibold leading-6 text-csas-100 uppercase">Favorites</div>
        <ul role="list" class="-mx-2 mt-2 space-y-1">
          {#each favs as [sas, appModule]}
            <li>
              <button
                on:click={async () => {
                  console.log('GOTO IN click on fav');
                  await goto(`/${appModule.id}`);

                  // setTimeout(() => {
                  //   localStorage.setItem(
                  //     'last',
                  //     JSON.stringify([$page.data['sas'], $page.data['appModule']])
                  //   );
                  // }, 1000);
                }}
                class={classNames(
                  optionEqString.equals(
                    option.some(appModule.id),
                    option.fromNullable($page.params['appModuleId'])
                  )
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

<section class="py-6 lg:pl-72">
  <div class="px-4 sm:px-6 lg:px-8">
    <slot />
  </div>
</section>
