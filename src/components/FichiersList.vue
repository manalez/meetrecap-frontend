<template>
  <div class="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Mes fichiers audio</h2>

    <div v-if="loading" class="text-gray-500">Chargement...</div>

    <div v-if="!loading && fichiers.length === 0" class="text-gray-600">
      Aucun fichier pour le moment.
    </div>

    <div
      v-for="f in fichiers"
      :key="f.id_audio"
      class="border-b py-3 flex justify-between items-center"
    >
      <div>
        <p class="font-semibold">{{ f.title }}</p>
        <p class="text-sm text-gray-600">
          {{ f.status === 'completed'
            ? 'Terminé'
            : f.status === 'failed'
            ? 'Échec'
            : 'En cours...' }}
        </p>
      </div>

      <div v-if="f.status === 'completed'" class="flex gap-3">
        <router-link
          :to="`/fichier/${f.id_audio}`"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          📄 Consulter
        </router-link>
        <a
          :href="`http://localhost:8000/exports/compte_rendu_reunion.pdf`"
          target="_blank"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          📥 PDF
        </a>
        <a
          :href="`http://localhost:8000/exports/compte_rendu_reunion.docx`"
          download
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          📥 Word
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { API_URL } from "../api/config";

const fichiers = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const userId = localStorage.getItem("user_id");
    const res = await axios.get(`${API_URL}/fichiers?id_user=${userId}`);
    fichiers.value = res.data;
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
  } finally {
    loading.value = false;
  }
});
</script>
