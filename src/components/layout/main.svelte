<main>
  <slot />
</main>

<style lang="scss">
  main {
    display: grid;
    grid-template-columns: min(40ch, 280px) auto;

    height: 100vh;
  }
</style>
