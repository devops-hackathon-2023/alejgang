<script lang="ts">
  import { humanize } from '$lib/string';
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition
  } from '@rgossiaux/svelte-headlessui';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let value: [string, string] | null = null;
  export let options: [string, string][] = [];
  export let placeholder = 'Select...';

  // $: if (value) {
  //   dispatch('change', {
  //     id: value[0]
  //   });
  // }
</script>

<Listbox bind:value let:open class="relative">
  <ListboxButton
    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-csas-400 sm:text-sm sm:leading-6"
  >
    {value ? humanize(value[1]) : placeholder}
    {#if open}
      <ChevronUp
        class="absolute right-1 top-1/2 translate-y-[-50%]"
        color="#444"
        strokeWidth={2}
        size={18}
      />
    {:else}
      <ChevronDown
        class="absolute right-1 top-1/2 translate-y-[-50%]"
        color="#444"
        strokeWidth={2}
        size={18}
      />
    {/if}
  </ListboxButton>
  <Transition
    show={open}
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <ListboxOptions
      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
    >
      {#each options as option (option[0])}
        <ListboxOption
          value={option}
          class={({ active }) =>
            `${
              active ? 'bg-csas-600 text-white' : 'text-black'
            } relative cursor-default select-none py-2 pl-3 pr-9`}
          on:click={() => dispatch('change', { id: option[0] })}
        >
          {humanize(option[1])}
        </ListboxOption>
      {/each}
    </ListboxOptions>
  </Transition>
</Listbox>
