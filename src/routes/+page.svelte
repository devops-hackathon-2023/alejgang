<script lang="ts">
  import { getUnits } from '$lib';
  import { either } from 'fp-ts';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={getUnits}>Run example (check networks tab)</button>

{#await getUnits()}
  Loading...
{:then units}
  {#if either.isLeft(units)}
    Error: {units.left.message}
  {:else}
    {#each units.right as unit}
      <p>{unit.id}: {unit.name}</p>
    {/each}
  {/if}
{/await}
