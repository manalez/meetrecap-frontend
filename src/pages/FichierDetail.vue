<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-4">Détails du fichier</h1>

    <div v-if="file">
      <p><strong>Titre :</strong> {{ file.title }}</p>
      <p><strong>Date :</strong> {{ formatDate(file.date_upload) }}</p>

      <a :href="file.pdf_url" class="text-blue-600 block mt-4" target="_blank">
        Télécharger PDF
      </a>

      <a :href="file.word_url" class="text-blue-600 block mt-2" target="_blank">
        Télécharger Word
      </a>

      <button @click="downloadAudio(file.id_audio)" class="mt-4 bg-blue-600 text-white p-2 rounded">
        Télécharger l'audio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchFileDetail, downloadAudio } from "../api/api";

const file = ref(null);
const route = useRoute();

onMounted(async () => {
  const res = await fetchFileDetail(route.params.id);
  file.value = res.data;
});

function formatDate(d) {
  return new Date(d).toLocaleString();
}
</script>
