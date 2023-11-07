<script lang="ts">
  import { Dialog, DialogOverlay, Transition, TransitionChild } from '@rgossiaux/svelte-headlessui';

  let sidebarOpen = false;
</script>

<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
  <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-csas-600 px-6 pb-4">
    <div class="flex h-16 shrink-0 items-center">
      <img
        class="h-8 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=white"
        alt="Your Company"
      />
    </div>
    <nav class="flex flex-1 flex-col">
      <slot />
    </nav>
  </div>
</div>

<Transition show={sidebarOpen}>
  <Dialog class="relative z-50 lg:hidden" open={sidebarOpen} on:close={() => (sidebarOpen = false)}>
    <DialogOverlay />
    <TransitionChild
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div class="fixed inset-0 bg-gray-900/80" />
    </TransitionChild>

    <div class="fixed inset-0 flex">
      <TransitionChild
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div class="relative mr-16 flex w-full max-w-xs h-full flex-1">
          <TransitionChild
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" class="-m-2.5 p-2.5" on:click={() => (sidebarOpen = false)}>
                <span class="sr-only">Close sidebar</span>
              </button>
            </div>
          </TransitionChild>
          <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-csas-600 px-6 pb-4">
            <div class="flex h-16 shrink-0 items-center">
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
            </div>
            <nav class="flex flex-1 flex-col">
              <slot />
            </nav>
          </div>
        </div>
      </TransitionChild>
    </div>
  </Dialog>
</Transition>

<div
  class="sticky top-0 z-40 flex items-center gap-x-6 bg-csas-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden"
>
  <button
    type="button"
    class="-m-2.5 p-2.5 text-csas-200 lg:hidden"
    on:click={() => (sidebarOpen = true)}
  >
    <span class="sr-only">Open sidebar</span>
  </button>
  <div class="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
</div>
