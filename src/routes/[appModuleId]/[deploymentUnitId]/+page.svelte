<script lang="ts">
  import { base } from '$app/paths';
  import Copy from '$components/elements/Copy.svelte';
  import LoaderCloud from '$components/elements/LoaderCloud.svelte';
  import Select from '$components/elements/Select.svelte';
  import Clickable from '$components/utils/Clickable.svelte';
  import { getDeploymentsWithVersionsGroupedByEnv, getUnitVersions, sortEnvByEnum } from '$lib';
  import { DeploymentResponse } from '$lib/client';
  import { secondsToHMS } from '$lib/date';
  import { selectOptions } from '$lib/util';
  import { array, either, option } from 'fp-ts';
  import { pipe } from 'fp-ts/lib/function';
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
{#await getDeploymentsWithVersionsGroupedByEnv(unit.id)()}
  <LoaderCloud size={128} />
{:then deploymentGroups}
  {#if either.isLeft(deploymentGroups)}
    Error: {deploymentGroups.left.message}
  {:else}
    <div class="flex gap-6">
      {#each Object.entries(deploymentGroups.right)
        .sort((a, b) => {
          return sortEnvByEnum(a[0], b[0]);
        })
        .map( ([a, b]) => ({ environment: a, deployments: b.sort( (a, b) => (a.startedAt > b.startedAt ? -1 : 1) ) }) ) as deploymentGroup}
        {@const deployments = deploymentGroup.deployments
          .sort((a, b) =>
            (a.version?.version ?? '0.0.0') > (b.version?.version ?? '0.0.0') ? -1 : 1
          )
          .filter((a) => (versionInput === null ? true : versionInput[1] === a.version?.version))}
        <div class="border p-4 rounded-2xl flex-1">
          <h2
            class="mb-2 font-bold"
            class:text-status-fail={pipe(
              deployments,
              array.head,
              option.map(({ status }) => status === DeploymentResponse.status.FAILED),
              option.getOrElse(() => false)
            )}
            class:text-status-success={pipe(
              deployments,
              array.head,
              option.map(({ status }) => status === DeploymentResponse.status.SUCCESS),
              option.getOrElse(() => false)
            )}
          >
            {deploymentGroup.environment}
          </h2>
          <div class="flex flex-col gap-2">
            {#each deployments as deployment}
              {@const failed = deployment.status === DeploymentResponse.status.FAILED}
              {@const success = deployment.status === DeploymentResponse.status.SUCCESS}
              <div class="flex items-center gap-2 relative border-t pt-2">
                <div class="absolute left-[-26px] bg-white">
                  {#if failed}
                    <AlertTriangle color="#e72222" size={20} />
                  {:else if success}
                    <CheckSquare2 color="#028661" size={20} />
                  {:else}
                    <Hourglass color="#2870ed" size={20} />
                  {/if}
                </div>
                {#if deployment.version}
                  <span
                    class="border rounded-lg p-1 pl-2 pr-2 font-mono text-sm text-center block w-19"
                  >
                    {deployment.version?.version}
                  </span>
                {/if}
                {#if option.isSome(deployment.finishedAt)}
                  <p class="text-right text-sm flex-1">
                    {new Date(deployment.finishedAt.value).toLocaleString('cs-CZ', {
                      timeZone: 'CET',
                      timeStyle: 'short'
                    })}
                    {new Date(deployment.finishedAt.value).toLocaleString('cs-CZ', {
                      timeZone: 'CET',
                      dateStyle: 'short'
                    })}
                  </p>
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
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/await}
