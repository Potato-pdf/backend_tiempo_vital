<script lang="ts">
  import { authStore } from "../stores/authStore";
  import { api } from "../services/api";
  import { navigate } from "../lib/router";

  let isLogin = true;
  let loading = false;
  let error = "";
  let successMessage = "";

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
    successMessage = "";

    try {
      const response = await api.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        rol: registerRol,
        office: [],
      });

      if (response.success) {
        successMessage = "¡Registro exitoso! Por favor inicia sesión.";
        isLogin = true;
        loginEmail = registerEmail;

        registerName = "";
        registerEmail = "";
        registerPassword = "";
        registerConfirmPassword = "";

        setTimeout(() => {
          successMessage = "";
        }, 5000);
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
    successMessage = "";
  }
</script>

<div class="auth-page">
  <div class="auth-container" class:register-mode={!isLogin}>
    <!-- Form Panel -->
    <div class="form-panel">
      <div class="form-content">
        <div class="logo-header">
          <img src="/icono.png" alt="Tiempo Vital" class="logo-img" />
          <h1>Tiempo Vital</h1>
        </div>

        <div class="form-header">
          <h2>{isLogin ? "Bienvenido" : "Crear Cuenta"}</h2>
          <p>
            {isLogin
              ? "Ingresa tus credenciales para acceder al sistema"
              : "Regístrate como doctor para gestionar tu consultorio"}
          </p>
        </div>

        {#if successMessage}
          <div class="alert success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        {/if}

        {#if error}
          <div class="alert error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
          <form on:submit|preventDefault={handleLogin} class="auth-form">
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                bind:value={loginEmail}
                placeholder="doctor@ejemplo.com"
                required
              />
            </div>

            <div class="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                bind:value={loginPassword}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              disabled={loading}
            >
              {#if loading}
                <div class="spinner"></div>
                Iniciando sesión...
              {:else}
                Iniciar Sesión
              {/if}
            </button>
          </form>
        {:else}
          <form on:submit|preventDefault={handleRegister} class="auth-form">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                bind:value={registerName}
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>

            <div class="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                bind:value={registerEmail}
                placeholder="doctor@ejemplo.com"
                required
              />
            </div>

            <div class="input-row">
              <div class="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  bind:value={registerPassword}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div class="form-group">
                <label>Confirmar</label>
                <input
                  type="password"
                  bind:value={registerConfirmPassword}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              disabled={loading}
            >
              {#if loading}
                <div class="spinner"></div>
                Registrando...
              {:else}
                Crear Cuenta
              {/if}
            </button>
          </form>
        {/if}

        <div class="form-toggle">
          <p>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button type="button" on:click={toggleForm}>
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Image Panel -->
    <div class="image-panel">
      <img
        src={isLogin ? "/register-image.jpg" : "/operando.jpg"}
        alt={isLogin ? "Login" : "Register"}
        class="panel-image"
      />
    </div>
  </div>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-gray-50);
    padding: 0;
  }

  .auth-container {
    width: 100%;
    height: 100vh;
    background: white;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    position: relative;
  }

  /* Layout remains fixed */
  .auth-container.register-mode .form-panel {
    order: initial;
  }

  .auth-container.register-mode .image-panel {
    order: initial;
  }

  /* Form Panel */
  .form-panel {
    padding: 60px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    transition: all 0.5s ease;
    position: relative;
    z-index: 2;
  }

  .form-content {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }

  .logo-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;
  }

  .logo-img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }

  .logo-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  .form-header {
    margin-bottom: 32px;
  }

  .form-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }

  .form-header p {
    color: var(--color-gray-500);
    font-size: 1rem;
    line-height: 1.5;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: var(--radius-md);
    margin-bottom: 24px;
    font-size: 0.9375rem;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
  }

  .alert svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .alert.success {
    background: var(--color-success-bg);
    color: #065f46;
    border: 1px solid #6ee7b7;
  }

  .alert.error {
    background: var(--color-error-bg);
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .btn-primary {
    padding: 14px;
    font-size: 1rem;
    margin-top: 8px;
  }

  .form-toggle {
    margin-top: 32px;
    text-align: center;
  }

  .form-toggle p {
    color: var(--color-gray-600);
    font-size: 0.9375rem;
  }

  .form-toggle button {
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
    transition: color 0.2s;
    font-size: 0.9375rem;
  }

  .form-toggle button:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  /* Image Panel */
  .image-panel {
    position: relative;
    overflow: hidden;
    background-color: var(--color-gray-100);
  }

  .panel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .form-panel {
      padding: 50px 40px;
    }
  }

  @media (max-width: 968px) {
    .auth-container {
      grid-template-columns: 1fr !important;
      height: auto;
      min-height: 100vh;
    }

    .auth-container.register-mode .form-panel,
    .auth-container.register-mode .image-panel {
      order: initial;
    }

    .image-panel {
      display: none;
    }

    .form-panel {
      padding: 60px 24px;
    }
  }
</style>
