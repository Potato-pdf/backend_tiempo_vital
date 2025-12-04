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
        <div>
            <h1 class="page-title">Administración</h1>
            <p class="page-subtitle">
                Gestiona usuarios y consultorios del sistema
            </p>
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
                    <h2>Usuarios</h2>
                    <button
                        on:click={openCreateUser}
                        class="btn btn-primary btn-sm"
                    >
                        <svg
                            class="btn-icon"
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

                <div class="users-list">
                    {#each users as user}
                        <div class="user-item card">
                            <div class="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div class="user-info-flex">
                                <div>
                                    <h3 class="user-name-item">{user.name}</h3>
                                    <p class="user-email">{user.email}</p>
                                    <span class="badge badge-{user.rol}"
                                        >{user.rol}</span
                                    >
                                </div>
                                <div class="user-stats">
                                    <div class="stat">
                                        <span class="stat-label"
                                            >Consultorios</span
                                        >
                                        <span class="stat-value"
                                            >{getUserOffices(user.id)
                                                .length}</span
                                        >
                                    </div>
                                </div>
                            </div>
                            <button
                                on:click={() => handleDeleteUser(user.id)}
                                class="btn-delete-small"
                            >
                                <svg
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
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Offices Section -->
            <div class="admin-section">
                <div class="section-header">
                    <h2>Todos los Consultorios</h2>
                    <span class="count-badge">{offices.length}</span>
                </div>

                <div class="offices-list">
                    {#each offices as office}
                        <div class="office-item-small card">
                            <div class="office-icon-small">
                                <svg
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
                            <div>
                                <h4 class="office-name-small">{office.name}</h4>
                                <p class="office-location">
                                    {office.city}, {office.state}
                                </p>
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
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={userEmail}
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        bind:value={userPassword}
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="rol">Rol</label>
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
                        {editingUser ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .page-container {
        padding: var(--spacing-8) var(--spacing-6);
        min-height: calc(100vh - 70px);
    }

    .page-header {
        margin-bottom: var(--spacing-8);
    }

    .page-title {
        font-size: 2rem;
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-2);
    }

    .page-subtitle {
        color: var(--color-gray-600);
        font-size: 1.125rem;
    }

    .admin-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: var(--spacing-6);
    }

    .admin-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: var(--spacing-4);
        border-bottom: 2px solid var(--color-gray-200);
    }

    .section-header h2 {
        font-size: 1.5rem;
        margin: 0;
    }

    .count-badge {
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: var(--spacing-2) var(--spacing-3);
        border-radius: var(--radius-md);
        font-weight: 700;
    }

    .btn-sm {
        padding: var(--spacing-2) var(--spacing-4);
        font-size: 0.875rem;
    }

    .btn-icon {
        width: 16px;
        height: 16px;
        margin-right: var(--spacing-2);
    }

    .users-list,
    .offices-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }

    .user-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        padding: var(--spacing-4);
    }

    .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .user-info-flex {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .user-name-item {
        font-size: 1.125rem;
        font-weight: 700;
        margin-bottom: var(--spacing-1);
    }

    .user-email {
        font-size: 0.875rem;
        color: var(--color-gray-600);
        margin-bottom: var(--spacing-2);
    }

    .badge {
        display: inline-block;
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
    }

    .badge-doctor {
        background-color: #dbeafe;
        color: #1e40af;
    }

    .badge-admin {
        background-color: #fee2e2;
        color: #991b1b;
    }

    .user-stats {
        display: flex;
        gap: var(--spacing-4);
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .stat-label {
        font-size: 0.75rem;
        color: var(--color-gray-600);
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary);
    }

    .btn-delete-small {
        padding: var(--spacing-3);
        background-color: var(--color-gray-100);
        color: var(--color-gray-700);
        border-radius: var(--radius-md);
        transition: all 0.2s;
    }

    .btn-delete-small:hover {
        background-color: var(--color-error);
        color: var(--color-white);
    }

    .btn-delete-small svg {
        width: 20px;
        height: 20px;
    }

    .office-item-small {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
    }

    .office-icon-small {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-100);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .office-icon-small svg {
        width: 22px;
        height: 22px;
    }

    .office-name-small {
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: var(--spacing-1);
    }

    .office-location {
        font-size: 0.875rem;
        color: var(--color-gray-600);
        margin: 0;
    }

    /* Modal styles (reused from Doctores) */
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
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }

    .modal {
        background-color: var(--color-white);
        border-radius: var(--radius-xl);
        max-width: 500px;
        width: 90%;
        box-shadow: var(--shadow-xl);
        animation: slideInRight 0.3s ease;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-6);
        border-bottom: 1px solid var(--color-gray-200);
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .btn-close {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-100);
        color: var(--color-gray-700);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .btn-close:hover {
        background-color: var(--color-error);
        color: var(--color-white);
    }

    .btn-close svg {
        width: 20px;
        height: 20px;
    }

    .modal-form {
        padding: var(--spacing-6);
    }

    .modal-actions {
        display: flex;
        gap: var(--spacing-3);
        justify-content: flex-end;
        margin-top: var(--spacing-6);
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-12);
        gap: var(--spacing-4);
    }

    @media (max-width: 968px) {
        .admin-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
