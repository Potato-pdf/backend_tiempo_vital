<script lang="ts">
  import { authStore } from "../stores/authStore";
  import { navigate, currentPath } from "../lib/router";

  let user: any = null;
  let path = "/";
  let isMenuOpen = false;

  authStore.subscribe((state) => {
    user = state.user;
  });

  currentPath.subscribe((value) => {
    path = value;
    isMenuOpen = false; // Close menu on navigation
  });

  function handleLogout() {
    authStore.logout();
    navigate("/");
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav class="navbar">
  <div class="nav-container">
    <div class="nav-brand" on:click={() => navigate("/")}>
      <img src="/icono.png" alt="Logo" class="nav-logo" />
      <span class="nav-title">Tiempo Vital</span>
    </div>

    {#if user}
      <!-- Desktop Menu -->
      <div class="nav-links desktop-only">
        {#if user.rol === "admin"}
          <button
            on:click={() => navigate("/administracion")}
            class="nav-link"
            class:active={path === "/administracion"}
          >
            Administración
          </button>
        {/if}

        <button
          on:click={() => navigate("/doctores")}
          class="nav-link"
          class:active={path === "/doctores"}
        >
          Consultorios
        </button>

        <button
          on:click={() => navigate("/perfil")}
          class="nav-link"
          class:active={path === "/perfil"}
        >
          Mi Perfil
        </button>
      </div>

      <div class="nav-user desktop-only">
        <div class="user-info">
          <span class="user-name">{user.name}</span>
          <span class="user-role"
            >{user.rol === "admin" ? "Administrador" : "Doctor"}</span
          >
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

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" on:click={toggleMenu}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if isMenuOpen}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          {/if}
        </svg>
      </button>
    {/if}
  </div>

  <!-- Mobile Menu -->
  {#if user && isMenuOpen}
    <div class="mobile-menu">
      {#if user.rol === "admin"}
        <button
          on:click={() => navigate("/administracion")}
          class="mobile-link"
          class:active={path === "/administracion"}
        >
          Administración
        </button>
      {/if}

      <button
        on:click={() => navigate("/doctores")}
        class="mobile-link"
        class:active={path === "/doctores"}
      >
        Consultorios
      </button>

      <button
        on:click={() => navigate("/perfil")}
        class="mobile-link"
        class:active={path === "/perfil"}
      >
        Mi Perfil
      </button>

      <div class="mobile-user-info">
        <div class="user-details">
          <span class="name">{user.name}</span>
          <span class="role">{user.rol}</span>
        </div>
        <button on:click={handleLogout} class="mobile-logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  {/if}
</nav>

<style>
  .navbar {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--color-gray-200);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all 0.3s ease;
  }

  .nav-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .nav-brand:hover {
    transform: scale(1.02);
  }

  .nav-logo {
    width: 42px;
    height: 42px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .nav-title {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-dark) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.03em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    background-color: var(--color-gray-50);
    padding: 4px;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-gray-200);
  }

  .nav-link {
    padding: 8px 16px;
    border-radius: var(--radius-full);
    color: var(--color-gray-600);
    font-weight: 600;
    font-size: 0.9375rem;
    transition: all 0.2s;
    background: transparent;
  }

  .nav-link:hover {
    color: var(--color-primary);
  }

  .nav-link.active {
    background-color: var(--color-white);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    padding-left: var(--spacing-6);
    border-left: 1px solid var(--color-gray-200);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
  }

  .user-name {
    font-weight: 700;
    color: var(--color-gray-900);
    font-size: 0.9375rem;
  }

  .user-role {
    font-size: 0.75rem;
    color: var(--color-gray-500);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .btn-logout {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    color: var(--color-gray-500);
    background-color: var(--color-gray-50);
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background-color: var(--color-error-bg);
    color: var(--color-error);
    transform: rotate(90deg);
  }

  .logout-icon {
    width: 20px;
    height: 20px;
  }

  /* Mobile Styles */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--color-gray-700);
    cursor: pointer;
  }

  .mobile-menu-btn svg {
    width: 28px;
    height: 28px;
  }

  .mobile-menu {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid var(--color-gray-200);
    padding: var(--spacing-4);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mobile-link {
    padding: var(--spacing-3) var(--spacing-4);
    text-align: left;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-gray-600);
    border-radius: var(--radius-md);
  }

  .mobile-link.active {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }

  .mobile-user-info {
    margin-top: var(--spacing-4);
    padding-top: var(--spacing-4);
    border-top: 1px solid var(--color-gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-details .name {
    font-weight: 700;
    color: var(--color-gray-900);
  }

  .user-details .role {
    font-size: 0.875rem;
    color: var(--color-gray-500);
  }

  .mobile-logout {
    padding: var(--spacing-2) var(--spacing-4);
    background-color: var(--color-error-bg);
    color: var(--color-error);
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .desktop-only {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }
  }
</style>
