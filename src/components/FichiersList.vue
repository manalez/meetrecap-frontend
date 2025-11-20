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

      <div v-if="f.status === 'completed'" class="space-x-3">
        <a
          :href="`http://127.0.0.1:8000/outputs/audio_${f.id_audio}/transcription_finale.pdf`"
          target="_blank"
          class="text-blue-600 font-semibold hover:underline"
        >
          Voir
        </a>
        <a
          :href="`http://127.0.0.1:8000/outputs/audio_${f.id_audio}/transcription_finale.pdf`"
          download
          class="text-green-600 font-semibold hover:underline"
        >
          Télécharger
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const fichiers = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://127.0.0.1:8000/fichiers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    fichiers.value = res.data;
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
