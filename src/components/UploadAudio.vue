<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
    <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-purple-600 mb-6">
        🎧 Importer un enregistrement
      </h1>

      <!-- Input file -->
      <input
        type="file"
        accept="audio/mp3,audio/mpeg"
        @change="handleFileUpload"
        class="mb-4 w-full border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:border-purple-500"
      />

      <!-- Progress bar -->
      <div v-if="uploadProgress > 0" class="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          class="bg-purple-600 h-4 rounded-full transition-all"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>

      <!-- Status -->
      <p v-if="statusMessage" class="text-center text-sm mb-4">{{ statusMessage }}</p>

      <!-- Bouton upload -->
      <button
        @click="submitFile"
        :disabled="!selectedFile || isUploading"
        class="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ isUploading ? "Envoi en cours..." : "📤 Envoyer le fichier" }}
      </button>

      <!-- Résumé -->
      <div v-if="result" class="mt-6 border-t pt-4 text-left text-sm">
        <h2 class="font-semibold text-purple-700 mb-2">Résumé général :</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ result.summary }}</p>

        <h3 class="font-semibold text-purple-700 mt-4 mb-2">Par locuteur :</h3>
        <ul>
          <li v-for="(text, speaker) in result.speakers" :key="speaker" class="mb-2">
            <strong>{{ speaker }} :</strong> {{ text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref } from "vue"

const selectedFile = ref(null)
const uploadProgress = ref(0)
const statusMessage = ref("")
const result = ref(null)
const isUploading = ref(false)

function handleFileUpload(event) {
  selectedFile.value = event.target.files[0]
  statusMessage.value = selectedFile.value
    ? `Fichier sélectionné : ${selectedFile.value.name}`
    : ""
}

async function submitFile() {
  if (!selectedFile.value) {
    statusMessage.value = "❌ Aucun fichier sélectionné."
    return
  }

  isUploading.value = true
  uploadProgress.value = 0
  statusMessage.value = "📡 Envoi du fichier en cours..."

  const formData = new FormData()
  formData.append("file", selectedFile.value)

  try {
    const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      },
    })

    result.value = response.data.result
    statusMessage.value = "✅ Transcription terminée avec succès 🎉"
  } catch (error) {
    console.error(error)
    statusMessage.value =
      "⚠️ Une erreur est survenue lors de l'envoi ou du traitement du fichier."
  } finally {
    isUploading.value = false
  }
}
</script>
