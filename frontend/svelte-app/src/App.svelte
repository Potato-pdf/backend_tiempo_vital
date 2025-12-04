<script lang="ts">
  import "./app.css";
  import { currentPath } from "./lib/router";
  import { authStore } from "./stores/authStore";
  import Login from "./pages/Login.svelte";
  import Doctores from "./pages/Doctores.svelte";
  import Administracion from "./pages/Administracion.svelte";

  let path = "/";
  let isAuthenticated = false;

  currentPath.subscribe((value) => {
    path = value;
  });

  authStore.subscribe((state) => {
    isAuthenticated = state.isAuthenticated;
  });
</script>

<main>
  {#if path === "/"}
    <Login />
  {:else if path === "/doctores"}
    <Doctores />
  {:else if path === "/administracion"}
    <Administracion />
  {:else}
    <Login />
  {/if}
</main>
