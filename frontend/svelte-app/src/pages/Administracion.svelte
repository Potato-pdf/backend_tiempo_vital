<script lang="ts">
    import { onMount } from "svelte";
    import { authStore } from "../stores/authStore";
    import { api } from "../services/api";
    import Navbar from "../components/Navbar.svelte";

    let token = "";
    let users = [];
    let offices = [];
    let loading = true;
    let showUserModal = false;
    let editingUser = null;

    // Form fields
    let userName = "";
    let userEmail = "";
    let userPassword = "";
    let userRol = "doctor";

    authStore.subscribe((state) => {
        token = state.token || "";
    });

    onMount(async () => {
        await Promise.all([loadUsers(), loadOffices()]);
    });

    async function loadUsers() {
        try {
            const response = await api.getUsers(token);
            users = response.data || [];
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    }

    async function loadOffices() {
        try {
            const response = await api.getOffices(token);
            offices = response.data || [];
        } catch (error) {
            console.error("Error cargando oficinas:", error);
        } finally {
            loading = false;
        }
    }

    function openCreateUser() {
        editingUser = null;
        resetUserForm();
        showUserModal = true;
    }

    function resetUserForm() {
        userName = "";
        userEmail = "";
        userPassword = "";
        userRol = "doctor";
    }

    async function handleUserSubmit() {
        const data = {
            name: userName,
            email: userEmail,
            password: userPassword,
            rol: userRol,
            office: [],
        };

        try {
            if (editingUser) {
                await api.updateUser(token, editingUser.id, data);
            } else {
                await api.createUser(token, data);
            }
            showUserModal = false;
            await loadUsers();
        } catch (error) {
            alert("Error al guardar usuario");
        }
    }

    async function handleDeleteUser(id) {
        if (confirm("¿Eliminar este usuario?")) {
            try {
                await api.deleteUser(token, id);
                await loadUsers();
            } catch (error) {
                alert("Error al eliminar usuario");
            }
        }
    }

    function getUserOffices(userId) {
        return offices.filter((o) => o.userId === userId);
    }
</script>

<Navbar />

<div class="container page-container">
    <div class="page-header">
        <div class="header-content">
            <h1 class="page-title">Panel de Administración</h1>
            <p class="page-subtitle">
                Gestiona usuarios y supervisa los consultorios registrados
            </p>
        </div>
        <div class="header-decoration">
            <img src="/imagen.jpg" alt="Decoración" class="decoration-img" />
        </div>
    </div>

    {#if loading}
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Cargando datos...</p>
        </div>
    {:else}
        <div class="admin-grid">
            <!-- Users Section -->
            <div class="admin-section">
                <div class="section-header">
                    <h2>Usuarios Registrados</h2>
                    <button on:click={openCreateUser} class="btn btn-primary">
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Nuevo Usuario
                    </button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Consultorios</th>
                                <th class="text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each users as user}
                                <tr>
                                    <td>
                                        <div class="user-cell">
                                            <div class="user-avatar">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <div class="font-bold">
                                                    {user.name}
                                                </div>
                                                <div
                                                    class="text-sm text-gray-500"
                                                >
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            class="badge {user.rol === 'admin'
                                                ? 'badge-error'
                                                : 'badge-info'}"
                                        >
                                            {user.rol === "admin"
                                                ? "Administrador"
                                                : "Doctor"}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="font-medium">
                                            {getUserOffices(user.id).length}
                                        </span>
                                    </td>
                                    <td class="text-right">
                                        <button
                                            on:click={() =>
                                                handleDeleteUser(user.id)}
                                            class="btn-icon-only text-red-600 hover:bg-red-50"
                                            title="Eliminar usuario"
                                        >
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
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Offices Section -->
            <div class="admin-section">
                <div class="section-header">
                    <h2>Resumen de Consultorios</h2>
                    <span class="badge badge-success"
                        >{offices.length} Total</span
                    >
                </div>

                <div class="offices-grid">
                    {#each offices as office}
                        <div class="card office-card">
                            <div class="office-icon">
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
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <div class="office-info">
                                <h4>{office.name}</h4>
                                <p>{office.city}, {office.state}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

{#if showUserModal}
    <div class="modal-overlay" on:click={() => (showUserModal = false)}>
        <div class="modal" on:click|stopPropagation>
            <div class="modal-header">
                <h2>{editingUser ? "Editar" : "Nuevo"} Usuario</h2>
                <button
                    on:click={() => (showUserModal = false)}
                    class="btn-close"
                >
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <form
                on:submit|preventDefault={handleUserSubmit}
                class="modal-form"
            >
                <div class="form-group">
                    <label for="name">Nombre Completo</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={userName}
                        placeholder="Ej. Dr. Juan Pérez"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={userEmail}
                        placeholder="correo@ejemplo.com"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        bind:value={userPassword}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="rol">Rol de Usuario</label>
                    <select id="rol" bind:value={userRol} required>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <div class="modal-actions">
                    <button
                        type="button"
                        on:click={() => (showUserModal = false)}
                        class="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .page-container {
        padding-top: var(--spacing-8);
        padding-bottom: var(--spacing-12);
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-8);
        background-color: var(--color-white);
        padding: var(--spacing-8);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--color-gray-200);
    }

    .header-content {
        flex: 1;
    }

    .header-decoration {
        width: 200px;
        height: 120px;
        border-radius: var(--radius-lg);
        overflow: hidden;
        margin-left: var(--spacing-6);
    }

    .decoration-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .page-title {
        color: var(--color-primary);
        margin-bottom: var(--spacing-2);
    }

    .page-subtitle {
        font-size: 1.125rem;
        color: var(--color-gray-600);
        max-width: 600px;
    }

    .admin-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--spacing-8);
    }

    .admin-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .section-header h2 {
        font-size: 1.5rem;
        color: var(--color-gray-800);
        margin: 0;
    }

    /* User Table Styles */
    .user-cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.125rem;
    }

    .btn-icon-only {
        padding: var(--spacing-2);
        border-radius: var(--radius-md);
        background: transparent;
        color: var(--color-gray-500);
        transition: all 0.2s;
    }

    .btn-icon-only:hover {
        background-color: var(--color-error-bg);
        color: var(--color-error);
    }

    /* Offices Grid */
    .offices-grid {
        display: grid;
        gap: var(--spacing-4);
    }

    .office-card {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        padding: var(--spacing-4);
        transition: transform 0.2s;
    }

    .office-card:hover {
        transform: translateY(-2px);
    }

    .office-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background-color: var(--color-info-bg);
        color: var(--color-info);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .office-info h4 {
        font-size: 1rem;
        margin-bottom: var(--spacing-1);
    }

    .office-info p {
        font-size: 0.875rem;
        color: var(--color-gray-500);
        margin: 0;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        backdrop-filter: blur(4px);
    }

    .modal {
        background: white;
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 500px;
        box-shadow: var(--shadow-xl);
        animation: slideInRight 0.3s ease-out;
    }

    .modal-header {
        padding: var(--spacing-6);
        border-bottom: 1px solid var(--color-gray-200);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h2 {
        font-size: 1.25rem;
        margin: 0;
    }

    .btn-close {
        background: transparent;
        color: var(--color-gray-400);
        padding: var(--spacing-1);
    }

    .btn-close:hover {
        color: var(--color-gray-600);
    }

    .modal-form {
        padding: var(--spacing-6);
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-3);
        margin-top: var(--spacing-8);
    }

    @media (max-width: 1024px) {
        .admin-grid {
            grid-template-columns: 1fr;
        }

        .header-decoration {
            display: none;
        }
    }
</style>
