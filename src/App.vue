<script setup>
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';

</script>

<template>
  <header>
  
    <div class="wrapper">

      <nav>
        <RouterLink to="/profissionais">Profissionais</RouterLink>
        <RouterLink to="/times">Times</RouterLink>
        <RouterLink to="/projetos">Projetos</RouterLink>
      </nav>

    </div>
    
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 0vh;
}

nav {
  width: 30%;
  font-size: 10px;
  text-align: center;
  position: fixed;
  top: 15px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  padding: 0 1rem;
  border-left: 2px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: flex-start;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -10rem;
    font-size: 1rem;
  }
}

</style>
