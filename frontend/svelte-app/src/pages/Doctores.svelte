<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import { api } from "../services/api";
  import Navbar from "../components/Navbar.svelte";

  let token = "";
  let offices: any[] = [];
  let loading = true;
  let showModal = false;
  let showWelcomeModal = false;
  let showDeleteModal = false;
  let editingOffice: any = null;
  let officeToDelete: string | null = null;
  let userId = "";

  // Alerts
  let successMessage = "";
  let errorMessage = "";

  // Form fields
  let officeName = "";
  let officeAddress = "";
  let officeCity = "";
  let officeState = "";
  let officeZipCode = "";

  authStore.subscribe((state) => {
    token = state.token || "";
    userId = state.user?.id || "";
  });

  onMount(async () => {
    await loadOffices();
    // Check session storage for welcome modal
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      showWelcomeModal = true;
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  });

  async function loadOffices() {
    loading = true;
    try {
      const response = await api.getOffices(token);
      const allOffices = response.data || [];
      offices = allOffices.filter((office: any) => office.userId === userId);
    } catch (error) {
      console.error("Error cargando oficinas:", error);
    } finally {
      loading = false;
    }
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

  function openCreateModal() {
    editingOffice = null;
    resetForm();
    showModal = true;
  }

  function openEditModal(office: any) {
    editingOffice = office;
    officeName = office.name;
    officeAddress = office.address;
    officeCity = office.city;
    officeState = office.state;
    officeZipCode = office.zipCode;
    showModal = true;
  }

  function resetForm() {
    officeName = "";
    officeAddress = "";
    officeCity = "";
    officeState = "";
    officeZipCode = "";
  }

  async function handleSubmit() {
    const data = {
      name: officeName,
      address: officeAddress,
      city: officeCity,
      state: officeState,
      zipCode: officeZipCode,
      userId,
    };

    try {
      if (editingOffice) {
        await api.updateOffice(token, editingOffice.id, data);
        showSuccess("Consultorio actualizado correctamente");
      } else {
        await api.createOffice(token, data);
        showSuccess("Consultorio creado correctamente");
      }
      showModal = false;
      await loadOffices();
    } catch (error) {
      showError("Error al guardar consultorio");
    }
  }

  function confirmDelete(id: string) {
    officeToDelete = id;
    showDeleteModal = true;
  }

  async function handleDelete() {
    if (officeToDelete) {
      try {
        await api.deleteOffice(token, officeToDelete);
        await loadOffices();
        showSuccess("Consultorio eliminado correctamente");
      } catch (error) {
        showError("Error al eliminar consultorio");
      } finally {
        showDeleteModal = false;
        officeToDelete = null;
      }
    }
  }
</script>

<Navbar />

<div class="container-fluid page-container">
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">Gestión de Consultorios</h1>
      <p class="page-subtitle">
        Administra tu red de consultorios médicos de manera eficiente
      </p>
    </div>
    <button on:click={openCreateModal} class="btn btn-primary btn-lg">
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      Nuevo Consultorio
    </button>
  </div>

  {#if successMessage}
    <div class="alert success fade-in">
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {successMessage}
    </div>
  {/if}

  {#if errorMessage}
    <div class="alert error fade-in">
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
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {errorMessage}
    </div>
  {/if}

  {#if loading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Cargando consultorios...</p>
    </div>
  {:else if offices.length === 0}
    <div class="empty-state">
      <div class="empty-icon-container">
        <svg
          class="empty-icon"
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
      <h3>No tienes consultorios registrados</h3>
      <p>
        Comienza registrando tu primer consultorio médico para gestionar tus
        citas.
      </p>
      <button on:click={openCreateModal} class="btn btn-primary mt-4">
        Crear Consultorio
      </button>
    </div>
  {:else}
    <div class="offices-grid">
      {#each offices as office}
        <div class="card office-card">
          <div class="office-header">
            <div class="office-icon">
              <svg
                width="32"
                height="32"
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
            <div class="office-title">
              <h3>{office.name}</h3>
              <span class="badge badge-success">Activo</span>
            </div>
          </div>

          <div class="office-details">
            <div class="detail-item">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{office.address}</span>
            </div>
            <div class="detail-item">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>{office.city}, {office.state}</span>
            </div>
            <div class="detail-item">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>CP: {office.zipCode}</span>
            </div>
          </div>

          <div class="office-actions">
            <button
              on:click={() => openEditModal(office)}
              class="btn btn-outline-primary"
            >
              <svg
                width="18"
                height="18"
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
              Editar
            </button>
            <button
              on:click={() => confirmDelete(office.id)}
              class="btn btn-outline-danger"
            >
              <svg
                width="18"
                height="18"
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
              Eliminar
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Welcome Modal -->
{#if showWelcomeModal}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    on:click={() => (showWelcomeModal = false)}
    on:keydown={(e) => e.key === "Escape" && (showWelcomeModal = false)}
  >
    <div
      class="modal welcome-modal"
      role="document"
      on:click|stopPropagation
      on:keydown|stopPropagation
    >
      <div class="welcome-image">
        <img src="/crud.jpg" alt="Bienvenido" />
      </div>
      <div class="welcome-content">
        <h2>¡Bienvenido a tu Panel!</h2>
        <p>
          Desde aquí podrás gestionar todos tus consultorios médicos. Puedes
          agregar nuevos consultorios, editar su información o eliminarlos si es
          necesario.
        </p>
        <div class="welcome-features">
          <div class="feature">
            <div class="feature-icon bg-blue">
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
            </div>
            <span>Crear nuevos registros</span>
          </div>
          <div class="feature">
            <div class="feature-icon bg-green">
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
            </div>
            <span>Actualizar información</span>
          </div>
          <div class="feature">
            <div class="feature-icon bg-red">
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
            </div>
            <span>Eliminar registros</span>
          </div>
        </div>
        <button
          on:click={() => (showWelcomeModal = false)}
          class="btn btn-primary w-full"
        >
          Comenzar
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Create/Edit Modal -->
{#if showModal}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    on:click={() => (showModal = false)}
    on:keydown={(e) => e.key === "Escape" && (showModal = false)}
  >
    <div
      class="modal form-modal"
      role="document"
      on:click|stopPropagation
      on:keydown|stopPropagation
    >
      <div class="modal-form-container">
        <div class="modal-header">
          <h2>{editingOffice ? "Editar" : "Nuevo"} Consultorio</h2>
          <button on:click={() => (showModal = false)} class="btn-close">
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

        <form on:submit|preventDefault={handleSubmit} class="modal-form">
          <div class="form-group">
            <label for="name">Nombre del Consultorio</label>
            <input
              type="text"
              id="name"
              bind:value={officeName}
              placeholder="Ej. Consultorio Central"
              required
            />
          </div>

          <div class="form-group">
            <label for="address">Dirección</label>
            <input
              type="text"
              id="address"
              bind:value={officeAddress}
              placeholder="Calle Principal #123"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">Ciudad</label>
              <input
                type="text"
                id="city"
                bind:value={officeCity}
                placeholder="Ciudad"
                required
              />
            </div>

            <div class="form-group">
              <label for="state">Estado</label>
              <input
                type="text"
                id="state"
                bind:value={officeState}
                placeholder="Estado"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="zipCode">Código Postal</label>
            <input
              type="text"
              id="zipCode"
              bind:value={officeZipCode}
              placeholder="00000"
              required
            />
          </div>

          <div class="modal-actions">
            <button
              type="button"
              on:click={() => (showModal = false)}
              class="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {editingOffice ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-image-side">
        <img src="/rosa.jpg" alt="Decoración" />
        <div class="image-overlay">
          <h3>Tiempo Vital</h3>
          <p>Cuidando tu salud y la de tus pacientes</p>
        </div>
      </div>
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
        <button on:click={() => (showDeleteModal = false)} class="btn-close">
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
          ¿Estás seguro de que deseas eliminar este consultorio? Esta acción no
          se puede deshacer.
        </p>
      </div>
      <div class="modal-actions">
        <button
          on:click={() => (showDeleteModal = false)}
          class="btn btn-secondary"
        >
          Cancelar
        </button>
        <button on:click={handleDelete} class="btn btn-danger">
          Eliminar
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container-fluid {
    width: 100%;
    padding-left: var(--spacing-8);
    padding-right: var(--spacing-8);
    max-width: 1800px;
    margin: 0 auto;
  }

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

  .page-title {
    color: var(--color-primary);
    margin-bottom: var(--spacing-2);
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 1.125rem;
    color: var(--color-gray-600);
  }

  .btn-lg {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: 1.125rem;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-6);
    font-weight: 500;
    font-size: 1.125rem;
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

  .offices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: var(--spacing-8);
  }

  .office-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: all 0.3s ease;
    border: 1px solid var(--color-gray-200);
  }

  .office-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-light);
  }

  .office-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-6);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-gray-100);
  }

  .office-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      135deg,
      var(--color-primary-bg) 0%,
      #e0f2fe 100%
    );
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }

  .office-title h3 {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-1);
    line-height: 1.2;
    color: var(--color-gray-900);
  }

  .office-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-8);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: var(--color-gray-600);
    font-size: 1rem;
  }

  .detail-item svg {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .office-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3);
  }

  .btn-outline-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-4);
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    background: white;
    border-radius: var(--radius-md);
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-outline-primary:hover {
    background-color: var(--color-primary);
    color: white;
  }

  .btn-outline-danger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-4);
    border: 1px solid var(--color-error);
    color: var(--color-error);
    background: white;
    border-radius: var(--radius-md);
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-outline-danger:hover {
    background-color: var(--color-error);
    color: white;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    backdrop-filter: blur(5px);
  }

  .modal {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-2xl);
    animation: zoomIn 0.3s ease-out;
    overflow: hidden;
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Welcome Modal */
  .welcome-modal {
    width: 100%;
    max-width: 450px;
    text-align: center;
  }

  .welcome-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .welcome-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .welcome-content {
    padding: var(--spacing-8);
  }

  .welcome-content h2 {
    font-size: 1.5rem;
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-4);
  }

  .welcome-content p {
    color: var(--color-gray-600);
    margin-bottom: var(--spacing-6);
    line-height: 1.6;
  }

  .welcome-features {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-8);
    text-align: left;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    padding: var(--spacing-3);
    background-color: var(--color-gray-50);
    border-radius: var(--radius-lg);
  }

  .feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .bg-blue {
    background-color: var(--color-primary);
  }
  .bg-green {
    background-color: #10b981;
  }
  .bg-red {
    background-color: #ef4444;
  }

  /* Form Modal */
  .form-modal {
    width: 100%;
    max-width: 900px;
    display: flex;
    min-height: 500px;
  }

  .modal-form-container {
    flex: 1;
    padding: var(--spacing-8);
  }

  .modal-image-side {
    width: 350px;
    position: relative;
    display: none;
  }

  @media (min-width: 768px) {
    .modal-image-side {
      display: block;
    }
  }

  .modal-image-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-8);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
  }

  .image-overlay h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-6);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
    margin-top: var(--spacing-8);
  }

  .btn-close {
    background: transparent;
    color: var(--color-gray-400);
    padding: var(--spacing-1);
    transition: color 0.2s;
  }

  .btn-close:hover {
    color: var(--color-gray-600);
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

  @media (max-width: 768px) {
    .container-fluid {
      padding-left: var(--spacing-4);
      padding-right: var(--spacing-4);
    }

    .page-header {
      flex-direction: column;
      gap: var(--spacing-4);
      text-align: center;
    }

    .offices-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
