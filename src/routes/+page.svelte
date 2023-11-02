<script lang="ts">
  import { base } from '$app/paths';
  import { getUnits } from '$lib';
  import { onMount } from 'svelte';

  onMount(() => console.log(base));
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={getUnits}>Run example (check networks tab)</button>
