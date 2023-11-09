<script lang="ts">
  import Select from '$components/elements/Select.svelte';
  import { secondsToHMS } from '$lib/date';
  import {
    AlertTriangle,
    CheckSquare2,
    CornerDownRight,
    ExternalLink,
    GitBranch,
    Timer
  } from 'lucide-svelte';

  let selected: [string, string] | null = ['DEV', 'Development'];
</script>

<div class="flex gap-1 items-center mb-4 justify-between">
  <span class="text-base">Current running version overview</span>
  <Select
    bind:value={selected}
    options={[
      ['DEV', 'Development'],
      ['PROD', 'Production']
    ]}
  />
</div>

<section class="-mx-2">
  <div class="mb-4 gap-4 grid grid-cols-2">
    <h1 class="text-2xl w-full col-span-2">devops</h1>

    <div class="flex flex-col rounded-2xl border border-inherit p-4 gap-2 min-w-0">
      <div class="flex flex-col items-stretch">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg block flex-grow min-w-fit">artifactory</h3>
          <a
            class="flex gap-2 items-center bg-csas-100 rounded-lg p-2 pr-3 font-mono max-w-fit text-xs"
            target="_blank"
            href={'https://github.com/csas-dev/devops-jfrog'}
          >
            <GitBranch size={16} />
            <div class="max-w-full min-w-0 truncate">https://github.com/csas-dev/devops-jfrog</div>
          </a>
        </div>

        <div>
          <div class="flex gap-4 items-center justify-between mb-1">
            <p>jfrog</p>
            <div
              class="grid grid-cols-[20px,_1fr,_auto,_auto,_auto,_auto,_auto] gap-3 items-center"
            >
              <div class="w-5">
                <CheckSquare2 color="#028661" size={20} />
              </div>
              <span class="font-bold"> {selected ? selected[0] : 'DEV'} </span>
              <span class="flex gap-1">
                <a href={`https://github.com/csas/commit/fwjqpf394201kdh29ekl0`} target="_blank">
                  <span
                    class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                  >
                    v2.5.9
                    <ExternalLink size={12} class="ml-1" />
                  </span>
                </a>
                <span
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                >
                  Azure
                </span>
              </span>
              <span class="text-right"> 11:48 </span>
              <span class="text-right"> 25.10.2023 </span>
              <span class="border rounded-lg p-1 pl-2 pr-2 flex items-center justify-between gap-2">
                <Timer size={16} />
                {secondsToHMS(235)}
              </span>
              <span
                class="p-1 pl-2 pr-2 bg-status flex-inline mr-0 ml-auto"
                class:text-status-success={true}
              >
                SUCCESS
              </span>
            </div>
          </div>
          <div class="flex gap-4 items-center justify-between">
            <p>nexus</p>

            <div
              class="grid grid-cols-[20px,_1fr,_auto,_auto,_auto,_auto,_auto] gap-3 items-center"
            >
              <div class="w-5">
                <CheckSquare2 color="#028661" size={20} />
              </div>
              <span class="font-bold"> {selected ? selected[0] : 'DEV'} </span>
              <span class="flex gap-1">
                <a href={`https://github.com/csas/commit/fwjqpf394201kdh29ekl0`} target="_blank">
                  <span
                    class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                  >
                    v2.5.9
                    <ExternalLink size={12} class="ml-1" />
                  </span>
                </a>
                <span
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                >
                  Azure
                </span>
              </span>
              <span class="text-right"> 16:48 </span>
              <span class="text-right"> 25.09.2023 </span>
              <span class="border rounded-lg p-1 pl-2 pr-2 flex items-center justify-between gap-2">
                <Timer size={16} />
                {secondsToHMS(235)}
              </span>
              <span
                class="p-1 pl-2 pr-2 bg-status flex-inline mr-0 ml-auto"
                class:text-status-success={true}
              >
                SUCCESS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col rounded-2xl border border-inherit p-4 gap-2 min-w-0">
      <div class="flex flex-col items-stretch">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg block flex-grow min-w-fit">cd</h3>
          <a
            class="flex gap-2 items-center bg-csas-100 rounded-lg p-2 pr-3 font-mono max-w-fit text-xs"
            target="_blank"
            href={'https://github.com/csas-dev/devops-jfrog'}
          >
            <GitBranch size={16} />
            <div class="max-w-full min-w-0 truncate">https://github.com/csas-dev/devops-cd</div>
          </a>
        </div>

        <div>
          <div class="flex gap-4 items-center justify-between mb-1">
            <p>agrocd</p>
            <div
              class="grid grid-cols-[20px,_1fr,_auto,_auto,_auto,_auto,_auto] gap-3 items-center"
            >
              <div class="w-5">
                <AlertTriangle color="#e72222" size={20} />
              </div>
              <span class="font-bold"> {selected ? selected[0] : 'DEV'} </span>
              <span class="flex gap-1">
                <a href={`https://github.com/csas/commit/fwjqpf394201kdh29ekl0`} target="_blank">
                  <span
                    class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                  >
                    v1.5.9
                    <ExternalLink size={12} class="ml-1" />
                  </span>
                </a>
                <span
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                >
                  Azure
                </span>
              </span>
              <span class="text-right"> 11:48 </span>
              <span class="text-right"> 26.10.2023 </span>
              <span class="border rounded-lg p-1 pl-2 pr-2 flex items-center justify-between gap-2">
                <Timer size={16} />
                {secondsToHMS(235)}
              </span>
              <span
                class="p-1 pl-2 pr-2 bg-status flex-inline mr-0 ml-auto w-26"
                class:text-status-fail={true}
              >
                FAILED
              </span>
            </div>
          </div>
          <div class="flex items-start mt-1 ml-1">
            <CornerDownRight size={20} color="#333" />
            <p class="text-base font-semibold ml-2">
              Current running version is
              <a href={`https://github.com/csas/commit/fwjqpf394201kdh29ekl0`} target="_blank">
                <span
                  class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                >
                  v1.5.8
                  <ExternalLink size={12} class="ml-1" />
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <h1 class="text-2xl w-full col-span-2">payments</h1>

    <div class="flex flex-col rounded-2xl border border-inherit p-4 gap-2 min-w-0">
      <div class="flex flex-col items-stretch">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg block flex-grow min-w-fit">card guardian</h3>
          <a
            class="flex gap-2 items-center bg-csas-100 rounded-lg p-2 pr-3 font-mono max-w-fit text-xs"
            target="_blank"
            href={'https://github.com/csas-dev/devops-jfrog'}
          >
            <GitBranch size={16} />
            <div class="max-w-full min-w-0 truncate">https://github.com/csas-dev/card-guardian</div>
          </a>
        </div>

        <div>
          <div class="flex gap-4 items-center justify-between mb-1">
            <p>card-guardian-fe</p>
            <div
              class="grid grid-cols-[20px,_1fr,_auto,_auto,_auto,_auto,_auto] gap-3 items-center"
            >
              <div class="w-5">
                <CheckSquare2 color="#028661" size={20} />
              </div>
              <span class="font-bold"> {selected ? selected[0] : 'DEV'} </span>
              <span class="flex gap-1">
                <a href={`https://github.com/csas/commit/fwjqpf394201kdh29ekl0`} target="_blank">
                  <span
                    class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                  >
                    v1.4.6
                    <ExternalLink size={12} class="ml-1" />
                  </span>
                </a>
                <span
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                >
                  Azure
                </span>
              </span>
              <span class="text-right"> 11:48 </span>
              <span class="text-right"> 25.10.2023 </span>
              <span class="border rounded-lg p-1 pl-2 pr-2 flex items-center justify-between gap-2">
                <Timer size={16} />
                {secondsToHMS(235)}
              </span>
              <span
                class="p-1 pl-2 pr-2 bg-status flex-inline mr-0 ml-auto"
                class:text-status-success={true}
              >
                SUCCESS
              </span>
            </div>
          </div>
          <div class="flex gap-4 items-center justify-between">
            <p>card-guardian-be</p>

            <div
              class="grid grid-cols-[20px,_1fr,_auto,_auto,_auto,_auto,_auto] gap-3 items-center"
            >
              <div class="w-5">
                <CheckSquare2 color="#028661" size={20} />
              </div>
              <span class="font-bold"> {selected ? selected[0] : 'DEV'} </span>
              <span class="flex gap-1">
                <a href={`https://github.com/csas/commit/fwjqpf394201kdh29ekl0`} target="_blank">
                  <span
                    class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                  >
                    v1.6.8
                    <ExternalLink size={12} class="ml-1" />
                  </span>
                </a>
                <span
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-100/80 text-center"
                >
                  Azure
                </span>
              </span>
              <span class="text-right"> 16:48 </span>
              <span class="text-right"> 25.09.2023 </span>
              <span class="border rounded-lg p-1 pl-2 pr-2 flex items-center justify-between gap-2">
                <Timer size={16} />
                {secondsToHMS(235)}
              </span>
              <span
                class="p-1 pl-2 pr-2 bg-status flex-inline mr-0 ml-auto"
                class:text-status-success={true}
              >
                SUCCESS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
