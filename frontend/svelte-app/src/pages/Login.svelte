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
          <div class="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1>Tiempo Vital</h1>
        </div>

        <div class="form-header">
          <h2>{isLogin ? "Bienvenido" : "Crear Cuenta"}</h2>
          <p>{isLogin ? "Ingresa tus credenciales para continuar" : "Regístrate como doctor en el sistema"}</p>
        </div>

        {#if successMessage}
          <div class="alert success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        {/if}

        {#if error}
          <div class="alert error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        {/if}

        {#if isLogin}
          <form on:submit|preventDefault={handleLogin} class="auth-form">
            <div class="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                bind:value={loginEmail}
                placeholder="doctor@ejemplo.com"
                required
              />
            </div>

            <div class="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                bind:value={loginPassword}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" class="btn-submit" disabled={loading}>
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
            <div class="input-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                bind:value={registerName}
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>

            <div class="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                bind:value={registerEmail}
                placeholder="doctor@ejemplo.com"
                required
              />
            </div>

            <div class="input-row">
              <div class="input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  bind:value={registerPassword}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div class="input-group">
                <label>Confirmar</label>
                <input
                  type="password"
                  bind:value={registerConfirmPassword}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-submit" disabled={loading}>
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
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- Image Panel -->
    <div class="image-panel">
      <div class="image-overlay"></div>
      <img 
        src={isLogin ? "/login-image.png" : "/register-image.jpg"} 
        alt={isLogin ? "Login" : "Register"}
        class="panel-image"
      />
    </div>
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
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

  /* Swap layout for register mode */
  .auth-container.register-mode .form-panel {
    order: 2;
  }

  .auth-container.register-mode .image-panel {
    order: 1;
  }

  /* Form Panel */
  .form-panel {
    padding: 60px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
  }

  .form-content {
    max-width: 450px;
    margin: 0 auto;
    width: 100%;
  }

  .logo-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 48px;
  }

  .logo-circle {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
  }

  .logo-circle svg {
    width: 32px;
    height: 32px;
    stroke: white;
  }

  .logo-header h1 {
    font-size: 1.875rem;
    font-weight: 800;
    background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .form-header {
    margin-bottom: 36px;
  }

  .form-header h2 {
    font-size: 2.25rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 10px;
  }

  .form-header p {
    color: #64748b;
    font-size: 1rem;
    line-height: 1.5;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 12px;
    margin-bottom: 28px;
    font-size: 0.9375rem;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .alert svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .alert.success {
    background: #d1fae5;
    color: #065f46;
    border: 2px solid #6ee7b7;
  }

  .alert.error {
    background: #fee2e2;
    color: #991b1b;
    border: 2px solid #fca5a5;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input-group label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
  }

  .input-group input {
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .input-group input:focus {
    outline: none;
    border-color: #06b6d4;
    background: white;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
  }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .btn-submit {
    margin-top: 12px;
    padding: 16px;
    background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.0625rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4);
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(6, 182, 212, 0.5);
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .form-toggle {
    margin-top: 28px;
    text-align: center;
  }

  .form-toggle p {
    color: #64748b;
    font-size: 1rem;
  }

  .form-toggle button {
    background: none;
    border: none;
    color: #06b6d4;
    font-weight: 700;
    cursor: pointer;
    margin-left: 6px;
    transition: color 0.2s;
    font-size: 1rem;
  }

  .form-toggle button:hover {
    color: #0891b2;
    text-decoration: underline;
  }

  /* Image Panel */
  .image-panel {
    position: relative;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .panel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.4s ease;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
    z-index: 1;
    pointer-events: none;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .form-panel {
      padding: 50px 60px;
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
      padding: 60px 40px;
    }
  }

  @media (max-width: 640px) {
    .form-panel {
      padding: 40px 24px;
    }

    .form-header h2 {
      font-size: 1.875rem;
    }

    .input-row {
      grid-template-columns: 1fr;
    }

    .logo-header h1 {
      font-size: 1.5rem;
    }
  }
</style>
