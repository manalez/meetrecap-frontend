<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Uploader un audio 🎧</h2>

    <!-- Champ du titre -->
    <input
      v-model="title"
      type="text"
      placeholder="Titre de la réunion"
      class="input mb-3"
    />

    <!-- Sélecteur de fichier -->
    <input
      type="file"
      accept=".mp3,.wav,.m4a"
      @change="onFileChange"
      class="mb-3"
    />

    <!-- Bouton d’envoi -->
    <button @click="sendAudio" class="btn w-full">Envoyer</button>

    <!-- Messages -->
    <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadAudio } from "../api/api";

const file = ref(null);
const title = ref("");
const message = ref("");
const error = ref("");

/**
 * Détection du fichier sélectionné
 */
function onFileChange(e) {
  file.value = e.target.files[0];
}

/**
 * Envoi du fichier audio au backend
 */
async function sendAudio() {
  try {
    const token = localStorage.getItem("token");

    if (!file.value) {
      error.value = "Choisis un fichier avant d’envoyer.";
      return;
    }

    // Appel à l’API d’upload
    const res = await uploadAudio(file.value, title.value, token);

    // Message de succès
    message.value = "Fichier envoyé avec succès !";
    console.log("Résultat backend :", res.data);

    // Rafraîchit la liste des fichiers après 2 secondes
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (err) {
    console.error("Erreur pendant l’envoi du fichier :", err);

    // Gestion d’erreur lisible pour l’utilisateur
    if (err.response?.status === 401) {
      error.value = "Session expirée, reconnecte-toi.";
      localStorage.removeItem("token");
    } else if (err.response?.data?.detail) {
      error.value = `Erreur serveur : ${err.response.data.detail}`;
    } else {
      error.value = ` Une erreur est survenue : ${err.message}`;
    }
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.75rem;
  border-radius: 8px;
  width: 100%;
}
.btn {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out;
}
.btn:hover {
  background-color: #1d4ed8;
}
</style>
