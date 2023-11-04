<script lang="ts">
  import { page } from '$app/stores';
  import { SaSesService } from '$lib/client';
  import { either } from 'fp-ts';

  const sas = SaSesService.detail({ sasId: $page.params['id'] });
</script>

{#await sas}
  Loading...
{:then data}
  {#if either.isLeft(data)}
    Error: {data.left.message}
  {:else}
    ID: {data.right.id}
    Name: {data.right.name}
  {/if}
{/await}
