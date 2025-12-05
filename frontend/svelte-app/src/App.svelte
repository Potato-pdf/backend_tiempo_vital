<script lang="ts">
  import "./app.css";
  import { onMount } from "svelte";
  import { currentPath } from "./lib/router";
  import { authStore } from "./stores/authStore";
  import Login from "./pages/Login.svelte";
  import Doctores from "./pages/Doctores.svelte";
  import Administracion from "./pages/Administracion.svelte";
  import Perfil from "./pages/Perfil.svelte";

  let path = "/";
  let isAuthenticated = false;

  currentPath.subscribe((value) => {
    path = value;
  });

  authStore.subscribe((state) => {
    isAuthenticated = state.isAuthenticated;
  });

  const pastelColors = [
    {
      name: "Azul",
      value: "#1E3A8A",
      dark: "#172554",
      light: "#60A5FA",
      bg: "#EFF6FF",
    },
    {
      name: "Verde",
      value: "#10B981",
      dark: "#047857",
      light: "#34D399",
      bg: "#ECFDF5",
    },
    {
      name: "Rosa",
      value: "#F472B6",
      dark: "#BE185D",
      light: "#FBCFE8",
      bg: "#FDF2F8",
    },
    {
      name: "Morado",
      value: "#A78BFA",
      dark: "#7C3AED",
      light: "#C4B5FD",
      bg: "#F5F3FF",
    },
    {
      name: "Naranja",
      value: "#FB923C",
      dark: "#C2410C",
      light: "#FDBA74",
      bg: "#FFF7ED",
    },
    {
      name: "Celeste",
      value: "#38BDF8",
      dark: "#0369A1",
      light: "#7DD3FC",
      bg: "#F0F9FF",
    },
  ];

  onMount(() => {
    const savedColor = localStorage.getItem("secondaryColor");
    if (savedColor) {
      const root = document.documentElement;
      root.style.setProperty("--color-secondary", savedColor);
      root.style.setProperty("--color-primary", savedColor);

      const selectedColorObj = pastelColors.find((c) => c.value === savedColor);
      if (selectedColorObj && selectedColorObj.dark) {
        root.style.setProperty("--color-primary-dark", selectedColorObj.dark);
        root.style.setProperty("--color-primary-light", selectedColorObj.light);
        root.style.setProperty("--color-primary-bg", selectedColorObj.bg);
      } else {
        root.style.setProperty("--color-primary-dark", savedColor);
        root.style.setProperty("--color-primary-light", savedColor);
      }
    }
  });
</script>

<main>
  {#if path === "/"}
    <Login />
  {:else if path === "/doctores"}
    <Doctores />
  {:else if path === "/administracion"}
    <Administracion />
  {:else if path === "/perfil"}
    <Perfil />
  {:else}
    <Login />
  {/if}
</main>
