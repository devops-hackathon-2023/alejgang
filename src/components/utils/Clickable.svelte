<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<span
  role="button"
  tabindex={0}
  on:click={(e) => dispatch('click', e)}
  on:keypress={(e) => dispatch('click', e)}><slot /></span
>

<style lang="scss">
  span {
    cursor: pointer;
  }
</style>
