<script lang="ts">
    import { onMount } from "svelte";
    import { authStore } from "../stores/authStore";
    import { api } from "../services/api";
    import Navbar from "../components/Navbar.svelte";

    let token = "";
    let user: any = null;
    let loading = false;
    let successMessage = "";
    let errorMessage = "";

    // Form fields
    let name = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

    authStore.subscribe((state) => {
        token = state.token || "";
        user = state.user;
    });

    onMount(() => {
        if (user) {
            name = user.name;
            email = user.email;
        }
    });

    async function handleUpdateProfile() {
        if (password && password !== confirmPassword) {
            errorMessage = "Las contraseñas no coinciden";
            return;
        }

        loading = true;
        errorMessage = "";
        successMessage = "";

        const data: any = {
            name,
            email,
            rol: user.rol, // Keep existing role
            office: user.office || [], // Keep existing offices
        };

        if (password) {
            data.password = password;
        }

        try {
            const response = await api.updateUser(token, user.id, data);

            // Update local store
            authStore.login(response.data, token);

            successMessage = "Perfil actualizado correctamente";
            password = "";
            confirmPassword = "";

            setTimeout(() => {
                successMessage = "";
            }, 3000);
        } catch (error: any) {
            errorMessage = error.message || "Error al actualizar perfil";
        } finally {
            loading = false;
        }
    }
</script>

<Navbar />

<div class="container page-container">
    <div class="profile-layout">
        <div class="profile-header">
            <div class="avatar-large">
                {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
            <div class="header-info">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu información personal y de acceso</p>
            </div>
        </div>

        <div class="card profile-card">
            <div class="card-header">
                <h2>Información Personal</h2>
            </div>

            {#if successMessage}
                <div class="alert success">
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    {successMessage}
                </div>
            {/if}

            {#if errorMessage}
                <div class="alert error">
                    <svg
                        width="20"
                        height="20"
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
                    {errorMessage}
                </div>
            {/if}

            <form
                on:submit|preventDefault={handleUpdateProfile}
                class="profile-form"
            >
                <div class="form-group">
                    <label for="name">Nombre Completo</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={name}
                        placeholder="Tu nombre completo"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        placeholder="tu@email.com"
                        required
                    />
                </div>

                <div class="divider"></div>

                <div class="form-section-title">
                    <h3>Cambiar Contraseña</h3>
                    <p>
                        Deja estos campos vacíos si no deseas cambiar tu
                        contraseña
                    </p>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="password">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            bind:value={password}
                            placeholder="••••••••"
                        />
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirmar Contraseña</label
                        >
                        <input
                            type="password"
                            id="confirmPassword"
                            bind:value={confirmPassword}
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div class="form-actions">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        disabled={loading}
                    >
                        {#if loading}
                            <div class="spinner-small"></div>
                            Guardando...
                        {:else}
                            Guardar Cambios
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    .page-container {
        padding-top: var(--spacing-8);
        padding-bottom: var(--spacing-12);
        display: flex;
        justify-content: center;
    }

    .profile-layout {
        width: 100%;
        max-width: 800px;
    }

    .profile-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-6);
        margin-bottom: var(--spacing-8);
    }

    .avatar-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-white);
        font-size: 2.5rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-lg);
    }

    .header-info h1 {
        font-size: 2rem;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-1);
    }

    .header-info p {
        color: var(--color-gray-600);
        font-size: 1.125rem;
        margin: 0;
    }

    .profile-card {
        padding: 0;
        overflow: hidden;
    }

    .card-header {
        padding: var(--spacing-6);
        border-bottom: 1px solid var(--color-gray-200);
        background-color: var(--color-gray-50);
    }

    .card-header h2 {
        font-size: 1.25rem;
        margin: 0;
        color: var(--color-gray-800);
    }

    .profile-form {
        padding: var(--spacing-8);
    }

    .divider {
        height: 1px;
        background-color: var(--color-gray-200);
        margin: var(--spacing-8) 0;
    }

    .form-section-title {
        margin-bottom: var(--spacing-6);
    }

    .form-section-title h3 {
        font-size: 1.125rem;
        margin-bottom: var(--spacing-1);
    }

    .form-section-title p {
        font-size: 0.875rem;
        color: var(--color-gray-500);
        margin: 0;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-6);
    }

    .form-actions {
        margin-top: var(--spacing-8);
        display: flex;
        justify-content: flex-end;
    }

    .alert {
        margin: var(--spacing-6);
        margin-bottom: 0;
        padding: var(--spacing-4);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        font-weight: 500;
    }

    .alert.success {
        background-color: var(--color-success-bg);
        color: #065f46;
    }

    .alert.error {
        background-color: var(--color-error-bg);
        color: #991b1b;
    }

    .spinner-small {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @media (max-width: 640px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
        }

        .form-row {
            grid-template-columns: 1fr;
        }
    }
</style>
