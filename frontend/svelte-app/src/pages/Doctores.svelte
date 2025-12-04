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
      offices = response.data || [];
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
    <div>
      <h1 class="page-title">Mis Consultorios</h1>
      <p class="page-subtitle">Administra tus consultorios médicos</p>
    </div>
    <button on:click={openCreateModal} class="btn btn-primary">
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
      Nuevo Consultorio
    </button>
  </div>

  {#if loading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Cargando consultorios...</p>
    </div>
  {:else if offices.length === 0}
    <div class="empty-state">
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
      <h3>No tienes consultorios registrados</h3>
      <p>Comienza creando tu primer consultorio</p>
      <button on:click={openCreateModal} class="btn btn-primary">
        Crear Consultorio
      </button>
    </div>
  {:else}
    <div class="offices-grid">
      {#each offices as office}
        <div class="office-card card">
          <div class="office-header">
            <div class="office-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 class="office-name">{office.name}</h3>
          </div>

          <div class="office-details">
            <div class="detail-item">
              <svg
                class="detail-icon"
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
                class="detail-icon"
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
                class="detail-icon"
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
              class="btn-icon-action"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              on:click={() => handleDelete(office.id)}
              class="btn-icon-action btn-delete"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
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

      <form on:submit|preventDefault={handleSubmit} class="modal-form">
        <div class="form-group">
          <label for="name">Nombre del Consultorio</label>
          <input type="text" id="name" bind:value={officeName} required />
        </div>

        <div class="form-group">
          <label for="address">Dirección</label>
          <input type="text" id="address" bind:value={officeAddress} required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="city">Ciudad</label>
            <input type="text" id="city" bind:value={officeCity} required />
          </div>

          <div class="form-group">
            <label for="state">Estado</label>
            <input type="text" id="state" bind:value={officeState} required />
          </div>
        </div>

        <div class="form-group">
          <label for="zipCode">Código Postal</label>
          <input type="text" id="zipCode" bind:value={officeZipCode} required />
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
    padding: var(--spacing-8) var(--spacing-6);
    min-height: calc(100vh - 70px);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .btn-icon {
    width: 20px;
    height: 20px;
    margin-right: var(--spacing-2);
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
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    color: var(--color-gray-300);
    margin-bottom: var(--spacing-4);
  }

  .offices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-6);
  }

  .office-card {
    position: relative;
  }

  .office-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-6);
  }

  .office-icon {
    width: 50px;
    height: 50px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary);
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .office-icon svg {
    width: 28px;
    height: 28px;
  }

  .office-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-gray-900);
  }

  .office-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-6);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    color: var(--color-gray-700);
  }

  .detail-icon {
    width: 18px;
    height: 18px;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .office-actions {
    display: flex;
    gap: var(--spacing-2);
    padding-top: var(--spacing-4);
    border-top: 1px solid var(--color-gray-200);
  }

  .btn-icon-action {
    flex: 1;
    padding: var(--spacing-3);
    background-color: var(--color-gray-100);
    color: var(--color-gray-700);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .btn-icon-action svg {
    width: 20px;
    height: 20px;
  }

  .btn-icon-action:hover {
    background-color: var(--color-primary);
    color: var(--color-white);
  }

  .btn-delete:hover {
    background-color: var(--color-error);
  }

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
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-4);
  }

  .modal-actions {
    display: flex;
    gap: var(--spacing-3);
    justify-content: flex-end;
    margin-top: var(--spacing-6);
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-4);
    }

    .offices-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
