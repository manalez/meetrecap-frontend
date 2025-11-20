<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Barre supérieure -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">🎧 MeetRecap</h1>

        <div class="flex items-center space-x-6">
          <router-link
            to="/account"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Mon compte
          </router-link>

          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-6 py-10">
      <h2 class="text-3xl font-semibold mb-8 text-gray-800">Tableau de bord</h2>

      <!-- Options d’import -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <!-- Importer depuis Google Drive -->
        <div
          class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <h3 class="font-semibold text-lg mb-2 text-gray-800">
            Importer depuis Google Drive
          </h3>
          <p class="text-gray-600 mb-4 text-sm">
            Importez un enregistrement audio depuis votre Drive.
          </p>
          <button
            @click="importFromDrive"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Importer
          </button>
        </div>

        <!-- Importer localement -->
        <div
          class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <h3 class="font-semibold text-lg mb-2 text-gray-800">
            Importer un fichier local
          </h3>
          <p class="text-gray-600 mb-4 text-sm">
            Choisissez un fichier audio sur votre ordinateur.
          </p>
          <button
            @click="toggleUpload"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {{ showUpload ? "Fermer le formulaire" : "Importer localement" }}
          </button>

          <!-- Formulaire d’upload -->
          <div
            v-if="showUpload"
            class="mt-6 border-t pt-6 border-gray-200 animate-fade-in"
          >
            <h4 class="font-semibold text-gray-800 mb-3">Uploader un audio 🎧</h4>

            <input
              v-model="title"
              type="text"
              placeholder="Titre de la réunion"
              class="border border-gray-300 rounded-lg w-full px-3 py-2 mb-3"
            />

            <input
              type="file"
              accept=".mp3,.wav,.m4a"
              @change="onFileChange"
              class="mb-3"
            />

            <button
              @click="sendAudio"
              :disabled="isProcessing"
              class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-60"
            >
              <span v-if="!isProcessing">Envoyer</span>
              <span v-else>⏳ Envoi et traitement en cours...</span>
            </button>

            <!-- Barre de progression -->
            <div v-if="uploadProgress > 0" class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                Téléchargement : {{ uploadProgress.toFixed(0) }}%
              </p>
            </div>

            <!-- Message de traitement -->
            <div
              v-if="isProcessing"
              class="mt-4 flex items-center justify-center space-x-2 text-blue-600"
            >
              <svg
                class="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Traitement IA en cours...</span>
            </div>

            <!-- Messages -->
            <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
            <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Liste des fichiers -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">
          Derniers enregistrements
        </h2>

        <div v-if="loading" class="text-gray-500 text-center py-6">
          Chargement des fichiers...
        </div>

        <div
          v-else-if="fichiers.length === 0"
          class="text-gray-500 text-center py-6"
        >
          Aucun fichier trouvé.
        </div>

        <table
          v-else
          class="min-w-full border-collapse rounded-xl overflow-hidden"
        >
          <thead class="bg-gray-100">
            <tr>
              <th class="text-left p-3 font-medium text-gray-700">Nom</th>
              <th class="text-left p-3 font-medium text-gray-700">Date</th>
              <th class="text-left p-3 font-medium text-gray-700">Source</th>
              <th class="text-left p-3 font-medium text-gray-700">Statut</th>
              <th class="text-left p-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="f in fichiers"
              :key="f.id_audio"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="p-3 font-medium text-gray-800">{{ f.title }}</td>
              <td class="p-3 text-gray-600">
                {{ formatDate(f.date_upload) }}
              </td>
              <td class="p-3 text-gray-600">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"
                >
                  Upload
                </span>
              </td>
              <td class="p-3">
                <span
                  v-if="f.status === 'completed'"
                  class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                  >PDF prêt</span
                >
                <span
                  v-else-if="f.status === 'processing'"
                  class="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                  >En cours</span
                >
                <span
                  v-else
                  class="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full"
                  >Échec</span
                >
              </td>
              <td class="p-3 space-x-3">
                <template v-if="f.status === 'completed'">
                  <a
                    :href="`http://127.0.0.1:8000/outputs/audio_${f.id_audio}/transcription_finale.pdf`"
                    target="_blank"
                    class="text-blue-600 hover:underline font-medium"
                    >Consulter</a
                  >
                  <a
                    :href="`http://127.0.0.1:8000/outputs/audio_${f.id_audio}/transcription_finale.pdf`"
                    download
                    class="text-purple-600 hover:underline font-medium"
                    >Télécharger</a
                  >
                </template>
                <button
                  @click="deleteFile(f.id_audio)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const fichiers = ref([]);
const loading = ref(true);
const showUpload = ref(false);
const file = ref(null);
const title = ref("");
const message = ref("");
const error = ref("");
const isProcessing = ref(false);
const uploadProgress = ref(0);
const router = useRouter();

const importFromDrive = () => {
  alert("L’importation depuis Google Drive sera bientôt disponible !");
};

const toggleUpload = () => {
  showUpload.value = !showUpload.value;
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

function onFileChange(e) {
  file.value = e.target.files[0];
}

// 🔹 Formater la date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 🔹 Supprimer un fichier
async function deleteFile(id_audio) {
  if (!confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://127.0.0.1:8000/fichiers/${id_audio}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fichiers.value = fichiers.value.filter((f) => f.id_audio !== id_audio);
  } catch (err) {
    console.error("Erreur suppression :", err);
    alert("Erreur lors de la suppression du fichier.");
  }
}

async function sendAudio() {
  try {
    const token = localStorage.getItem("token");
    if (!file.value) {
      error.value = "Choisis un fichier avant d’envoyer.";
      return;
    }

    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("title", title.value);

    message.value = "";
    error.value = "";
    uploadProgress.value = 0;
    isProcessing.value = true;

    await axios.post("http://127.0.0.1:8000/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
      onUploadProgress: (e) => {
        uploadProgress.value = (e.loaded / e.total) * 100;
      },
    });

    message.value = "Fichier envoyé ! Traitement IA en cours...";
    setTimeout(async () => {
      await fetchFiles();
      message.value = "Traitement terminé ! Ton fichier est prêt.";
      isProcessing.value = false;
      uploadProgress.value = 0;
    }, 8000);
  } catch (err) {
    error.value = `❌ ${err.response?.data?.detail || err.message}`;
    isProcessing.value = false;
  }
}

// 🔹 Récupérer les fichiers
async function fetchFiles() {
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
}

onMounted(fetchFiles);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
