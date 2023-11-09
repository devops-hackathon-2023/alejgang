<script lang="ts">
  import { base } from '$app/paths';
  import Copy from '$components/elements/Copy.svelte';
  import DeploymentUnitCard from '$components/elements/DeploymentUnitCard.svelte';
  import LoaderCloud from '$components/elements/LoaderCloud.svelte';
  import Select from '$components/elements/Select.svelte';
  import Clickable from '$components/utils/Clickable.svelte';
  import { getDeploymentsWithVersionsGroupedByEnv, getUnitVersions, sortEnvByEnum } from '$lib';
  import { DeploymentResponse, type AppModuleResponse, type SasResponse } from '$lib/client';
  import { secondsToHMS } from '$lib/date';
  import { selectOptions } from '$lib/util';
  import { either, option } from 'fp-ts';
  import {
    AlertTriangle,
    CheckSquare2,
    ChevronRight,
    FilterX,
    Hourglass,
    Star,
    Timer
  } from 'lucide-svelte';
  import { favorites } from '../../stores';
  import type { PageData } from './$types';

  export let data: PageData;

  let favs: [SasResponse, AppModuleResponse][] = [];
  favorites.subscribe(($) => {
    favs = [...$];
  });

  $: isInFavorites = favs.some(([, appModule]) => appModule.id === data.appModule.id);

  const toggleFavorites = () => {
    favorites.update((favs) => {
      if (!favs.some(([s, m]) => s.id === data.sas.id && m.id === data.appModule.id)) {
        const newFavorites: [SasResponse, AppModuleResponse][] = [
          ...favs,
          [data.sas, data.appModule]
        ];

        localStorage.setItem('favorites', JSON.stringify(newFavorites));

        return newFavorites;
      } else {
        const newFavorites: [SasResponse, AppModuleResponse][] = favs.filter(
          ([s, m]) => s.id !== data.sas.id && m.id !== data.appModule.id
        );

        localStorage.setItem('favorites', JSON.stringify(newFavorites));

        return newFavorites;
      }
    });
  };

  let versionInput: [string, string] | null = null;
  let sortBy: [string, string] | null = ['', 'Default'];

  let secondsFromLoad = 0;
  setInterval(() => secondsFromLoad++, 1000);
</script>

<a class="flex gap-1 items-center" href="{base}/{data.appModule.id}">
  <span class="text-sm">{data.sas.name}</span>
  <ChevronRight size={12} />
</a>
<div class="flex items-center mb-4 gap-4">
  <h1 class="text-2xl">
    {data.appModule.name}
  </h1>
  <Clickable on:click={toggleFavorites}>
    <Star fill={isInFavorites ? '#ffbf00' : '#fff'} color={isInFavorites ? '#ffbf00' : '#222'} />
  </Clickable>
  <Copy prefix="id: " text={data.appModule.id} truncate />
</div>
<div class="grid xl:grid-cols-2 gap-4">
  {#each data.units as unit}
    <DeploymentUnitCard repo={unit.repositoryUrl} id={unit.id}>
      <svelte:fragment slot="name">{unit.name}</svelte:fragment>
      {#await getDeploymentsWithVersionsGroupedByEnv(unit.id)()}
        <LoaderCloud size={128} />
      {:then deploymentGroups}
        {#if either.isLeft(deploymentGroups)}
          Error: {deploymentGroups.left.message}
        {:else}
          <div class="flex justify-between items-center border-t pt-2 gap-2">
            <h3 class="font-light">Environments:</h3>
            <div class="ml-auto mr-0">
              <Select
                bind:value={sortBy}
                options={[
                  ['', 'Default'],
                  ['v-asc', 'Version Asc'],
                  ['v-desc', 'Version Desc'],
                  ['d-asc', 'Date Asc'],
                  ['d-desc', 'Date Desc']
                ]}
                placeholder="Sort By {sortBy?.[1] ?? ''}"
              />
            </div>
            {#await getUnitVersions(unit.id)() then versions}
              {#if either.isRight(versions)}
                <div class="flex items-center gap-2">
                  <Select
                    bind:value={versionInput}
                    options={selectOptions(
                      versions.right.map(($) => ({
                        id: $.id,
                        name: $.version
                      }))
                    )}
                    placeholder="Filter Version"
                  />
                  {#if versionInput !== null}
                    <Clickable on:click={() => (versionInput = null)}>
                      <FilterX size={20} />
                    </Clickable>
                  {/if}
                </div>
              {/if}
            {/await}
          </div>
          <div class="grid grid-cols-[20px,_1fr,_64px,_auto,_auto,_110px,_auto] gap-2 items-center">
            {#each Object.entries(deploymentGroups.right)
              .sort((a, b) => {
                const desc = /desc/i.test(sortBy?.[0] ?? '') ? 1 : -1;
                switch (sortBy?.[0]) {
                  case 'v-asc':
                  case 'v-desc':
                    if ((a[1][0].version?.version ?? '0.0.0') === (b[1][0].version?.version ?? '0.0.0')) return a[0] < b[0] ? -1 : 1;
                    return (a[1][0].version?.version ?? '0.0.0') < (b[1][0].version?.version ?? '0.0.0') ? desc : -1 * desc;
                  case 'd-asc':
                  case 'd-desc':
                    if (a[1][0].startedAt === b[1][0].startedAt) return a[0] < b[0] ? -1 : 1;
                    return a[1][0].startedAt < b[1][0].startedAt ? desc : -1 * desc;
                }
                return sortEnvByEnum(a[0], b[0]);
              })
              .map( ([a, b]) => ({ environment: a, deployments: b.sort( (a, b) => (a.startedAt > b.startedAt ? -1 : 1) ) }) )
              .filter( ({ deployments }) => (versionInput === null ? true : versionInput[1] === deployments[0].version?.version) ) as deploymentGroup}
              {@const deployment = deploymentGroup.deployments[0]}
              {@const failed = deployment.status === DeploymentResponse.status.FAILED}
              {@const success = deployment.status === DeploymentResponse.status.SUCCESS}
              <div class="w-5">
                {#if failed}
                  <AlertTriangle color="#e72222" size={20} />
                {:else if success}
                  <CheckSquare2 color="#028661" size={20} />
                {:else}
                  <Hourglass color="#2870ed" size={20} />
                {/if}
              </div>
              <span class="font-bold">
                {deployment.environment}:
              </span>
              <span>
                {#if deployment.version}
                  <span class="border rounded-lg p-1 pl-2 pr-2 font-mono text-sm text-center">
                    {deployment.version?.version}
                  </span>
                {/if}
              </span>
              {#if option.isSome(deployment.finishedAt)}
                <span class="text-right">
                  {new Date(deployment.finishedAt.value).toLocaleString('cs-CZ', {
                    timeZone: 'CET',
                    timeStyle: 'short'
                  })}
                </span>
                <span class="text-right">
                  {new Date(deployment.finishedAt.value).toLocaleString('cs-CZ', {
                    timeZone: 'CET',
                    dateStyle: 'short'
                  })}
                </span>
              {:else}
                <span /><span />
              {/if}
              <span class="border rounded-lg p-1 pl-2 pr-2 flex items-center gap-2">
                {#if option.isSome(deployment.duration)}
                  <Timer size={16} />
                  {secondsToHMS(deployment.duration.value)}
                {:else}
                  <div class="rotate">
                    <Hourglass size={16} />
                  </div>
                  {secondsToHMS(
                    Math.floor(
                      (new Date().getTime() - new Date(deployment.startedAt).getTime()) / 1000
                    ) + secondsFromLoad
                  )}
                {/if}
              </span>
              <span
                class="p-1 pl-2 pr-2 bg-status flex-inline mr-0 ml-auto"
                class:text-status-fail={failed}
                class:font-bold={failed}
                class:text-status-success={success}
              >
                {deployment.status}
              </span>
            {/each}
          </div>
          <div class="flex justify-end pt-1">
            <a
              href="{base}/{data.appModule.id}/{unit.id}"
              class="p-2 pl-3 pr-3 rounded-lg bg-csas-600 text-csas-50"
            >
              Show More
            </a>
          </div>
        {/if}
      {/await}
    </DeploymentUnitCard>
  {/each}
</div>

<style lang="scss">
  .rotate {
    animation: rotate 4s linear 0ms infinite normal forwards;
  }
  @keyframes rotate {
    from {
      rotate: 0deg;
    }
    to {
      rotate: 360deg;
    }
  }
</style>
