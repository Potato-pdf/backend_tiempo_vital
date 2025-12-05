<script lang="ts">
  import { authStore } from "../stores/authStore";
  import { navigate, currentPath } from "../lib/router";

  let user: any = null;
  let path = "/";

  authStore.subscribe((state) => {
    user = state.user;
  });

  currentPath.subscribe((value) => {
    path = value;
  });

  function handleLogout() {
    authStore.logout();
    navigate("/");
  }
</script>

<nav class="navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <img src="icono.png" alt="Logo" class="nav-logo" />
      <span class="nav-title">Tiempo Vital</span>
    </div>

    <div class="nav-links">
      {#if user}
        {#if user.rol === "admin"}
          <button
            on:click={() => navigate("/administracion")}
            class="nav-link"
            class:active={path === "/administracion"}
          >
            <svg
              class="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Administración</span>
          </button>
        {/if}

        <button
          on:click={() => navigate("/doctores")}
          class="nav-link"
          class:active={path === "/doctores"}
        >
          <svg
            class="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span>Consultorios</span>
        </button>

        <button
          on:click={() => navigate("/perfil")}
          class="nav-link"
          class:active={path === "/perfil"}
        >
          <svg
            class="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Mi Perfil</span>
        </button>
      {/if}
    </div>

    {#if user}
      <div class="nav-user">
        <div class="user-info">
          <span class="user-name">{user.name}</span>
          <span class="user-role">{user.rol}</span>
        </div>
        <button
          on:click={handleLogout}
          class="btn-logout"
          title="Cerrar Sesión"
        >
          <svg
            class="logout-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-gray-200);
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    text-decoration: none;
  }

  .nav-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .nav-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.025em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--radius-md);
    color: var(--color-gray-600);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    transition: all 0.2s;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-link:hover {
    background-color: var(--color-gray-50);
    color: var(--color-primary);
  }

  .nav-link.active {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    padding-left: var(--spacing-4);
    border-left: 1px solid var(--color-gray-200);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .user-name {
    font-weight: 600;
    color: var(--color-gray-900);
    font-size: 0.875rem;
  }

  .user-role {
    font-size: 0.75rem;
    color: var(--color-gray-500);
    text-transform: capitalize;
  }

  .btn-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: var(--color-gray-50);
    color: var(--color-gray-600);
    border-radius: var(--radius-md);
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background-color: var(--color-error-bg);
    color: var(--color-error);
  }

  .logout-icon {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    .user-info {
      display: none;
    }

    .nav-links {
      gap: var(--spacing-1);
    }

    .nav-link span {
      display: none;
    }

    .nav-title {
      display: none;
    }
  }
</style>
