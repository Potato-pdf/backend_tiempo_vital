<script lang="ts">
    import { onMount } from "svelte";
    import { authStore } from "../stores/authStore";
    import { api } from "../services/api";
    import Navbar from "../components/Navbar.svelte";

    let token = "";
    let users: any[] = [];
    let offices: any[] = [];
    let loading = true;
    let showUserModal = false;
    let showDeleteModal = false;
    let editingUser: any = null;
    let userToDelete: string | null = null;
    let successMessage = "";
    let errorMessage = "";

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

    function showSuccess(msg: string) {
        successMessage = msg;
        errorMessage = "";
        setTimeout(() => {
            successMessage = "";
        }, 3000);
    }

    function showError(msg: string) {
        errorMessage = msg;
        successMessage = "";
        setTimeout(() => {
            errorMessage = "";
        }, 3000);
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
                showSuccess("Usuario actualizado correctamente");
            } else {
                await api.createUser(token, data);
                showSuccess("Usuario creado correctamente");
            }
            showUserModal = false;
            await loadUsers();
        } catch (error) {
            showError("Error al guardar usuario");
        }
    }

    function confirmDeleteUser(id: string) {
        userToDelete = id;
        showDeleteModal = true;
    }

    async function handleDeleteUser() {
        if (userToDelete) {
            try {
                await api.deleteUser(token, userToDelete);
                await loadUsers();
                showSuccess("Usuario eliminado correctamente");
            } catch (error) {
                showError("Error al eliminar usuario");
            } finally {
                showDeleteModal = false;
                userToDelete = null;
            }
        }
    }

    function getUserOffices(userId: string) {
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

    {#if successMessage}
        <div class="alert success fade-in">
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
        <div class="alert error fade-in">
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
                                            on:click={() => {
                                                editingUser = user;
                                                userName = user.name;
                                                userEmail = user.email;
                                                userRol = user.rol;
                                                showUserModal = true;
                                            }}
                                            class="btn-icon-only text-blue-600 hover:bg-blue-50"
                                            title="Editar usuario"
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
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            on:click={() =>
                                                confirmDeleteUser(user.id)}
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
    <div
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        on:click={() => (showUserModal = false)}
        on:keydown={(e) => e.key === "Escape" && (showUserModal = false)}
    >
        <div
            class="modal"
            role="document"
            on:click|stopPropagation
            on:keydown|stopPropagation
        >
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
                        required={!editingUser}
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

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
    <div
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        on:click={() => (showDeleteModal = false)}
        on:keydown={(e) => e.key === "Escape" && (showDeleteModal = false)}
    >
        <div
            class="modal delete-modal"
            role="document"
            on:click|stopPropagation
            on:keydown|stopPropagation
        >
            <div class="modal-header">
                <h2>Confirmar Eliminación</h2>
                <button
                    on:click={() => (showDeleteModal = false)}
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
            <div class="modal-content">
                <div class="delete-icon">
                    <svg
                        width="48"
                        height="48"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <p>
                    ¿Estás seguro de que deseas eliminar este usuario? Esta
                    acción no se puede deshacer.
                </p>
            </div>
            <div class="modal-actions">
                <button
                    on:click={() => (showDeleteModal = false)}
                    class="btn btn-secondary"
                >
                    Cancelar
                </button>
                <button on:click={handleDeleteUser} class="btn btn-danger">
                    Eliminar
                </button>
            </div>
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

    .alert {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-6);
        font-weight: 500;
    }

    .alert.success {
        background-color: var(--color-success-bg);
        color: #065f46;
        border: 1px solid #6ee7b7;
    }

    .alert.error {
        background-color: var(--color-error-bg);
        color: #991b1b;
        border: 1px solid #fca5a5;
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
        background-color: var(--color-gray-100);
    }

    .btn-icon-only.text-red-600:hover {
        background-color: var(--color-error-bg);
        color: var(--color-error);
    }

    .btn-icon-only.text-blue-600:hover {
        background-color: var(--color-info-bg);
        color: var(--color-info);
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

    /* Delete Modal */
    .delete-modal {
        width: 100%;
        max-width: 400px;
        padding: var(--spacing-6);
    }

    .delete-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--color-error-bg);
        color: var(--color-error);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-4);
    }

    .modal-content {
        text-align: center;
        margin-bottom: var(--spacing-6);
    }

    .modal-content p {
        color: var(--color-gray-600);
        margin: 0;
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
