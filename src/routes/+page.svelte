<script lang="ts">
  import { getUnits, getUnitsByModuleId } from '$lib';
  import type { AppModuleResponse, SasResponse } from '$lib/client';
  import { either, option } from 'fp-ts';
  import { get } from 'svelte/store';
  import { favorites, selectedAppModule, selectedSas } from '../stores';

  let selectedModule: option.Option<AppModuleResponse> = option.none;
  selectedAppModule.subscribe((module) => {
    selectedModule = module;
  });

  const addToFavorites = () => {
    favorites.update((favs) => {
      const sas = get(selectedSas);
      const module = get(selectedAppModule);

      if (option.isSome(sas) && option.isSome(module)) {
        if (!favs.some(([s, m]) => s.id === sas.value.id && m.id === module.value.id)) {
          const newFavorites: [SasResponse, AppModuleResponse][] = [
            ...favs,
            [sas.value, module.value]
          ];

          localStorage.setItem('favorites', JSON.stringify(newFavorites));

          return newFavorites;
        } else {
          return favs;
        }
      } else {
        return favs;
      }
    });
  };
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={getUnits}>Run example (check networks tab)</button>

{#await getUnitsByModuleId(option.map(($) => $.id)(selectedModule))()}
  Loading...
{:then units}
  {#if either.isLeft(units)}
    Error: {units.left.message}
  {:else if units.right.length !== 0}
    {#each units.right as unit}
      <p>{unit.id}: {unit.name}</p>
    {/each}

    <button on:click={addToFavorites}>add to favs</button>
  {/if}
{/await}
