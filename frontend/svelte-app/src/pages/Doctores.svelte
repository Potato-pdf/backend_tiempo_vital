<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import { api } from "../services/api";
  import Navbar from "../components/Navbar.svelte";

  let token = "";
  let offices = [];
  let loading = true;
  let showModal = false;
  let editingOffice = null;

  // Form fields
  let officeName = "";
  let officeAddress = "";
  let officeCity = "";
  let officeState = "";
  let officeZipCode = "";
  let userId = "";

  authStore.subscribe((state) => {
    token = state.token || "";
    userId = state.user?.id || "";
  });

  onMount(async () => {
    await loadOffices();
  });

  async function loadOffices() {
    loading = true;
    try {
      const response = await api.getOffices(token);
      const allOffices = response.data || [];
      // Filter offices to show only those belonging to the current user
      offices = allOffices.filter((office: any) => office.userId === userId);
    } catch (error) {
      console.error("Error cargando oficinas:", error);
    } finally {
      loading = false;
    }
  }

  function openCreateModal() {
    editingOffice = null;
    resetForm();
    showModal = true;
  }

  function openEditModal(office) {
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
      } else {
        await api.createOffice(token, data);
      }
      showModal = false;
      await loadOffices();
    } catch (error) {
      alert("Error al guardar oficina");
    }
  }

  async function handleDelete(id) {
    if (confirm("¿Estás seguro de eliminar esta oficina?")) {
      try {
        await api.deleteOffice(token, id);
        await loadOffices();
      } catch (error) {
        alert("Error al eliminar oficina");
      }
    }
  }
</script>

<Navbar />

<div class="container page-container">
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">Mis Consultorios</h1>
      <p class="page-subtitle">
        Administra la información de tus consultorios médicos
      </p>
      <button on:click={openCreateModal} class="btn btn-primary mt-4">
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
        Nuevo Consultorio
      </button>
    </div>
    <div class="header-decoration">
      <img src="/dashboard-bg.png" alt="Decoración" class="decoration-img" />
    </div>
  </div>

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
      <p>Comienza registrando tu primer consultorio médico</p>
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
            <div class="office-title">
              <h3>{office.name}</h3>
              <span class="badge badge-info">Activo</span>
            </div>
          </div>

          <div class="office-details">
            <div class="detail-item">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>{office.city}, {office.state}</span>
            </div>
            <div class="detail-item">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>CP: {office.zipCode}</span>
            </div>
          </div>

          <div class="office-actions">
            <button
              on:click={() => openEditModal(office)}
              class="btn btn-secondary w-full justify-center"
            >
              Editar
            </button>
            <button
              on:click={() => handleDelete(office.id)}
              class="btn btn-danger w-full justify-center"
            >
              Eliminar
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if showModal}
  <div class="modal-overlay" on:click={() => (showModal = false)}>
    <div class="modal" on:click|stopPropagation>
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
    font-size: 1rem;
    color: var(--color-gray-600);
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-12);
    gap: var(--spacing-4);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-12);
    text-align: center;
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px dashed var(--color-gray-300);
  }

  .empty-icon-container {
    width: 80px;
    height: 80px;
    background-color: var(--color-gray-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-4);
  }

  .empty-icon {
    width: 40px;
    height: 40px;
    color: var(--color-gray-400);
  }

  .offices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--spacing-6);
  }

  .office-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .office-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
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
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .office-title h3 {
    font-size: 1.125rem;
    margin-bottom: var(--spacing-1);
    line-height: 1.2;
  }

  .office-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-6);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: var(--color-gray-600);
    font-size: 0.9375rem;
  }

  .detail-item svg {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .office-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3);
    padding-top: var(--spacing-4);
    border-top: 1px solid var(--color-gray-100);
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
    max-width: 550px;
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
    margin-top: var(--spacing-8);
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-4);
      text-align: center;
    }

    .header-decoration {
      display: none;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
