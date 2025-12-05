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
    let userImage = "";
    let secondaryColor = "#1E3A8A"; // Default blue

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

    authStore.subscribe((state) => {
        token = state.token || "";
        user = state.user;
    });

    onMount(() => {
        if (user) {
            name = user.name;
            email = user.email;
            userImage = user.image || "";
        }

        // Load saved color
        const savedColor = localStorage.getItem("secondaryColor");
        if (savedColor) {
            secondaryColor = savedColor;
            updateColor(savedColor);
        }
    });

    function updateColor(color: string) {
        secondaryColor = color;
        const root = document.documentElement;
        root.style.setProperty("--color-secondary", color);
        // Also update primary color to match the selected theme
        root.style.setProperty("--color-primary", color);
        // We should ideally calculate dark/light variants, but for now let's use the same color
        // or a slightly modified version if we had a function.
        // For simplicity, we'll map the known colors to their dark/light variants or just use the main color
        // assuming the user wants the main action color to change.

        // Find the color object to get variants if we had them, or just set simple variants
        // Since we don't have a color manipulation lib, we'll set primary-dark to the same or let it be.
        // But to ensure visibility, let's set primary-dark to the same color for now,
        // or maybe we can define the palette in the array.

        const selectedColorObj = pastelColors.find((c) => c.value === color);
        if (selectedColorObj && selectedColorObj.dark) {
            root.style.setProperty(
                "--color-primary-dark",
                selectedColorObj.dark,
            );
            root.style.setProperty(
                "--color-primary-light",
                selectedColorObj.light,
            );
            root.style.setProperty("--color-primary-bg", selectedColorObj.bg);
        } else {
            // Fallback if we don't have variants defined yet
            root.style.setProperty("--color-primary-dark", color);
            root.style.setProperty("--color-primary-light", color);
        }

        localStorage.setItem("secondaryColor", color);
    }

    function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                userImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

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
            name,
            email,
            rol: user.rol, // Keep existing role
            office: user.office || [], // Keep existing offices
            image: userImage,
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
                {#if userImage}
                    <img src={userImage} alt={name} class="profile-img" />
                {:else}
                    {name ? name.charAt(0).toUpperCase() : "U"}
                {/if}
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

            <div class="customization-section">
                <h3>Personalización</h3>
                <p>Elige el color secundario de tu interfaz</p>
                <div class="color-picker">
                    {#each pastelColors as color}
                        <button
                            class="color-option {secondaryColor === color.value
                                ? 'active'
                                : ''}"
                            style="background-color: {color.value}"
                            on:click={() => updateColor(color.value)}
                            aria-label="Seleccionar color {color.name}"
                        ></button>
                    {/each}
                </div>
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
                    <label for="profileImage">Foto de Perfil</label>
                    <div class="image-upload-row">
                        <div class="current-image-preview">
                            {#if userImage}
                                <img src={userImage} alt="Preview" />
                            {:else}
                                <div class="placeholder-preview">
                                    <svg
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            {/if}
                        </div>
                        <div class="upload-controls">
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                on:change={handleImageUpload}
                                class="file-input-hidden"
                            />
                            <label for="profileImage" class="btn btn-secondary">
                                Cambiar Foto
                            </label>
                            {#if userImage}
                                <button
                                    type="button"
                                    class="btn btn-outline-danger"
                                    on:click={() => (userImage = "")}
                                >
                                    Eliminar
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>

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
        overflow: hidden;
    }

    .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

    /* Customization Styles */
    .customization-section {
        padding: var(--spacing-6);
        background-color: var(--color-gray-50);
        border-bottom: 1px solid var(--color-gray-200);
    }

    .customization-section h3 {
        font-size: 1rem;
        margin-bottom: var(--spacing-2);
    }

    .customization-section p {
        font-size: 0.875rem;
        margin-bottom: var(--spacing-4);
    }

    .color-picker {
        display: flex;
        gap: var(--spacing-3);
        flex-wrap: wrap;
    }

    .color-option {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 0 1px var(--color-gray-300);
        cursor: pointer;
        transition: transform 0.2s;
    }

    .color-option:hover {
        transform: scale(1.1);
    }

    .color-option.active {
        box-shadow:
            0 0 0 2px var(--color-primary),
            0 0 0 4px white;
    }

    /* Image Upload Styles */
    .image-upload-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
    }

    .current-image-preview {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid var(--color-gray-200);
    }

    .current-image-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder-preview {
        width: 100%;
        height: 100%;
        background-color: var(--color-gray-100);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-gray-400);
    }

    .file-input-hidden {
        display: none;
    }

    .upload-controls {
        display: flex;
        gap: var(--spacing-2);
    }
</style>
