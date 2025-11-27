<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Uploader un audio 🎧</h2>

    <input v-model="title" type="text" placeholder="Titre" class="input mb-3" />

    <input type="file" accept=".mp3,.wav,.m4a" @change="onFileChange" class="mb-3" />

    <button @click="sendAudio" class="btn w-full">Envoyer</button>

    <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadAudio } from "@/api/api";

const file = ref(null);
const title = ref("");
const message = ref("");
const error = ref("");

function onFileChange(e) {
  file.value = e.target.files[0];
}

async function sendAudio() {
  try {
    if (!file.value) {
      error.value = "Choisis un fichier avant d’envoyer.";
      return;
    }

    await uploadAudio(file.value);

    message.value = "Fichier envoyé avec succès !";
    setTimeout(() => window.location.reload(), 2000);
  } catch (err) {
    error.value = "Erreur lors de l’envoi.";
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
}
</style>
