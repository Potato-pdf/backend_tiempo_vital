<script lang="ts">
  import { authStore } from "../stores/authStore";
  import { api } from "../services/api";
  import { navigate } from "../lib/router";

  let isLogin = true;
  let loading = false;
  let error = "";

  // Login form
  let loginEmail = "";
  let loginPassword = "";

  // Register form
  let registerName = "";
  let registerEmail = "";
  let registerPassword = "";
  let registerConfirmPassword = "";
  let registerRol = "doctor";

  async function handleLogin() {
    if (!loginEmail || !loginPassword) {
      error = "Por favor completa todos los campos";
      return;
    }

    loading = true;
    error = "";

    try {
      const response = await api.login(loginEmail, loginPassword);

      if (response.success) {
        authStore.login(response.user, response.token);
        
        // Redirigir según el rol del usuario
        if (response.user.rol === "admin") {
          navigate("/administracion");
        } else {
          navigate("/doctores");
        }
      } else {
        error = response.message || "Error en el login";
      }
    } catch (err: any) {
      error = err.message || "Error al iniciar sesión";
    } finally {
      loading = false;
    }
  }

  async function handleRegister() {
    if (!registerName || !registerEmail || !registerPassword) {
      error = "Por favor completa todos los campos";
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      error = "Las contraseñas no coinciden";
      return;
    }

    loading = true;
    error = "";

    try {
      const response = await api.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        rol: registerRol,
        office: [],
      });

      if (response.success) {
        authStore.login(response.user, response.token);
        
        // Redirigir según el rol del usuario
        if (response.user.rol === "admin") {
          navigate("/administracion");
        } else {
          navigate("/doctores");
        }
      } else {
        error = response.message || "Error en el registro";
      }
    } catch (err: any) {
      error = err.message || "Error al registrarse";
    } finally {
      loading = false;
    }
  }

  function toggleForm() {
    isLogin = !isLogin;
    error = "";
  }
</script>

<div class="login-container">
  <!-- Left side - Illustration -->
  <div class="illustration-side">
    <div class="logo-container">
      <img src="/logo.png" alt="Tiempo Vital Logo" class="logo" />
      <h1 class="brand-name">Tiempo Vital</h1>
    </div>

    <div class="illustration-content">
      <img
        src="/login-illustration.png"
        alt="Healthcare"
        class="illustration-image"
      />
      <h2 class="tagline">Gestión médica simplificada</h2>
      <p class="description">
        Administra consultorios, doctores y pacientes de manera eficiente y
        profesional.
      </p>
    </div>

    <div class="decoration-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>

  <!-- Right side - Form -->
  <div class="form-side">
    <div class="form-container">
      <div class="form-header">
        <h2 class="form-title">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>
        <p class="form-subtitle">
          {isLogin
            ? "Ingresa tus credenciales para continuar"
            : "Completa tus datos para registrarte"}
        </p>
      </div>

      {#if error}
        <div class="alert alert-error">
          <svg
            class="alert-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      {/if}

      {#if isLogin}
        <!-- Login Form -->
        <form on:submit|preventDefault={handleLogin} class="form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              bind:value={loginEmail}
              placeholder="tu@ejemplo.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              bind:value={loginPassword}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            disabled={loading}
          >
            {#if loading}
              <div class="spinner-small"></div>
              <span>Iniciando sesión...</span>
            {:else}
              Iniciar Sesión
            {/if}
          </button>
        </form>
      {:else}
        <!-- Register Form -->
        <form on:submit|preventDefault={handleRegister} class="form">
          <div class="form-group">
            <label for="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              bind:value={registerName}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div class="form-group">
            <label for="reg-email">Correo Electrónico</label>
            <input
              type="email"
              id="reg-email"
              bind:value={registerEmail}
              placeholder="tu@ejemplo.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="rol">Rol</label>
            <select id="rol" bind:value={registerRol} required>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="reg-password">Contraseña</label>
              <input
                type="password"
                id="reg-password"
                bind:value={registerPassword}
                placeholder="••••••••"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirm-password"
                bind:value={registerConfirmPassword}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            disabled={loading}
          >
            {#if loading}
              <div class="spinner-small"></div>
              <span>Registrando...</span>
            {:else}
              Crear Cuenta
            {/if}
          </button>
        </form>
      {/if}

      <div class="form-footer">
        <p>
          {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          <button type="button" on:click={toggleForm} class="link-button">
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  /* Illustration Side */
  .illustration-side {
    flex: 1;
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: var(--spacing-8);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    z-index: 2;
  }

  .logo {
    width: 50px;
    height: 50px;
    filter: brightness(0) invert(1);
  }

  .brand-name {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-white);
    margin: 0;
  }

  .illustration-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 2;
    padding: var(--spacing-12) 0;
  }

  .illustration-image {
    width: 100%;
    max-width: 500px;
    height: auto;
    margin-bottom: var(--spacing-6);
    animation: fadeIn 1s ease-out;
  }

  .tagline {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: var(--spacing-4);
    color: var(--color-white);
  }

  .description {
    font-size: 1.125rem;
    max-width: 400px;
    opacity: 0.95;
    line-height: 1.6;
  }

  /* Decoration Circles */
  .decoration-circles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .circle {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.05);
    animation: float 20s infinite ease-in-out;
  }

  .circle-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -100px;
    animation-delay: 0s;
  }

  .circle-2 {
    width: 250px;
    height: 250px;
    bottom: -100px;
    left: -80px;
    animation-delay: 5s;
  }

  .circle-3 {
    width: 180px;
    height: 180px;
    top: 50%;
    left: 10%;
    animation-delay: 10s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-30px) scale(1.05);
    }
  }

  /* Form Side */
  .form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-6);
    background-color: var(--color-white);
  }

  .form-container {
    width: 100%;
    max-width: 480px;
    animation: slideInRight 0.6s ease-out;
  }

  .form-header {
    margin-bottom: var(--spacing-8);
  }

  .form-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-2);
  }

  .form-subtitle {
    color: var(--color-gray-600);
    font-size: 1rem;
    margin: 0;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-6);
    font-size: 0.875rem;
  }

  .alert-error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .alert-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }

  .btn-full {
    width: 100%;
    padding: var(--spacing-4);
    font-size: 1.0625rem;
    font-weight: 700;
  }

  .spinner-small {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .form-footer {
    margin-top: var(--spacing-6);
    text-align: center;
  }

  .form-footer p {
    color: var(--color-gray-600);
    font-size: 0.9375rem;
    margin: 0;
  }

  .link-button {
    background: none;
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
    border: none;
    padding: 0;
    margin-left: var(--spacing-1);
    cursor: pointer;
    transition: color 0.2s;
  }

  .link-button:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  /* Responsive */
  @media (max-width: 968px) {
    .login-container {
      flex-direction: column;
    }

    .illustration-side {
      min-height: 40vh;
      padding: var(--spacing-6);
    }

    .illustration-image {
      max-width: 300px;
    }

    .tagline {
      font-size: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
