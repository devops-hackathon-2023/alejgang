<script lang="ts">
  import { base } from '$app/paths';
  import Copy from '$components/elements/Copy.svelte';
  import LoaderCloud from '$components/elements/LoaderCloud.svelte';
  import Select from '$components/elements/Select.svelte';
  import Clickable from '$components/utils/Clickable.svelte';
  import { getDeploymentsWithVersionsGroupedByVersion, getUnitVersions } from '$lib';
  import { DeploymentResponse } from '$lib/client';
  import { secondsToHMS } from '$lib/date';
  import { selectOptions } from '$lib/util';
  import { either, option } from 'fp-ts';
  import {
    AlertTriangle,
    CheckSquare2,
    ChevronRight,
    FilterX,
    Hourglass,
    Timer
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const unit = data.deployment.right;

  let versionInput: [string, string] | null = null;
</script>

<a class="flex gap-1 items-center" href="{base}/{data.appModule.id}">
  <span class="text-sm">{data.sas.name}</span>
  <ChevronRight size={12} />
  <span class="text-sm">{data.appModule.name}</span>
  <ChevronRight size={12} />
</a>
<div class="flex items-center mb-4 gap-4">
  <h1 class="text-2xl">
    {unit.name}{#if versionInput === null}@latest{:else}@{versionInput[1]}{/if}
  </h1>
  <Copy prefix="id: " text={unit.id} truncate />
  {#await getUnitVersions(unit.id)() then versions}
    {#if either.isRight(versions)}
      <div class="flex items-center gap-2 mr-0 ml-auto">
        <Select
          bind:value={versionInput}
          options={selectOptions(
            versions.right
              .map(($) => ({
                id: $.id,
                name: $.version
              }))
              .sort((a, b) => (a.name > b.name ? -1 : 1))
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
{#await getDeploymentsWithVersionsGroupedByVersion(unit.id)()}
  <LoaderCloud size={128} />
{:then deploymentGroups}
  {#if either.isLeft(deploymentGroups)}
    Error: {deploymentGroups.left.message}
  {:else}
    {@const deploymentEnvironments = Object.values(DeploymentResponse.environment)}
    <div class="flex gap-6 border rounded-2xl p-4 pl-6">
      <div class="flex flex-col min-h-full">
        {#each deploymentEnvironments as environment}
          <div class="flex-1">
            <h2 class="mb-2 font-bold">
              {environment}
            </h2>
          </div>
        {/each}
      </div>
      <div class="overflow-scroll w-full min-h-full">
        <div class="flex min-h-full ml-4">
          {#each Object.entries(deploymentGroups.right)
            .sort(([a], [b]) => (a > b ? -1 : 1))
            .filter(([$]) => versionInput === null || $ === versionInput[1])
            .map( ([, $]) => deploymentEnvironments.map( (environment) => ({ environment, deployment: $.sort( (a, b) => a.startedAt.localeCompare(b.startedAt) ).find(($) => $.environment === environment) }) ) ) as version}
            <div class="grid grid-rows-{deploymentEnvironments.length} min-w-[16rem]">
              {#each version as environment}
                <div class="flex-1 border-l relative p-4">
                  {#if environment.deployment}
                    {@const deployment = environment.deployment}
                    {@const failed = deployment.status === DeploymentResponse.status.FAILED}
                    {@const success = deployment.status === DeploymentResponse.status.SUCCESS}
                    <div>
                      <div class="absolute left-[-10px] top-5 bg-white">
                        {#if failed}
                          <AlertTriangle color="#e72222" size={20} />
                        {:else if success}
                          <CheckSquare2 color="#028661" size={20} />
                        {:else}
                          <Hourglass color="#2870ed" size={20} />
                        {/if}
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          {#if deployment.version}
                            <span
                              class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80"
                            >
                              v{deployment.version?.version}
                            </span>
                          {/if}
                        </div>
                        <div>
                          {#if option.isSome(deployment.duration)}
                            <span
                              class="border rounded-lg p-1 pl-2 pr-2 flex items-center gap-2 text-sm w-24"
                            >
                              <Timer size={16} />
                              {secondsToHMS(deployment.duration.value)}
                            </span>
                          {/if}
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          {#if option.isSome(deployment.finishedAt)}
                            <span class="text-right text-sm flex-1">
                              {new Date(deployment.finishedAt.value).toLocaleString('cs-CZ', {
                                timeZone: 'CET',
                                timeStyle: 'short'
                              })}
                              {new Date(deployment.finishedAt.value).toLocaleString('cs-CZ', {
                                timeZone: 'CET',
                                dateStyle: 'short'
                              })}
                            </span>
                          {/if}
                        </div>
                        <div class="text-sm">
                          {deployment.deployer}
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/await}
