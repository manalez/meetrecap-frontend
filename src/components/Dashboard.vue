<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Notification -->
  <div
  v-if="notification"
  class="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in"
>
  {{ notification }}
  </div>

    <!-- Navbar -->
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

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-6 py-10">
      <h2 class="text-3xl font-semibold mb-8 text-gray-800">Tableau de bord</h2>

      <!-- Upload options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        <!-- Import Google Drive -->
        <div class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 class="font-semibold text-lg mb-2 text-gray-800">Importer depuis Google Drive</h3>
          <p class="text-gray-600 mb-4 text-sm">Importez un enregistrement audio depuis votre Drive.</p>

          <button
            @click="importFromDrive"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Importer
          </button>
        </div>

        <!-- Import local -->
        <div class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 class="font-semibold text-lg mb-2 text-gray-800">Importer un fichier local</h3>
          <p class="text-gray-600 mb-4 text-sm">Choisissez un fichier audio sur votre ordinateur.</p>

          <button
            @click="toggleUpload"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {{ showUpload ? "Fermer" : "Importer localement" }}
          </button>

          <!-- Upload form -->
          <div v-if="showUpload" class="mt-6 border-t pt-6 border-gray-200 animate-fade-in">
            <h4 class="font-semibold text-gray-800 mb-3">Uploader un audio 🎧</h4>

            <input
              v-model="title"
              type="text"
              placeholder="Titre de la réunion"
              class="border border-gray-300 rounded-lg w-full px-3 py-2 mb-3"
            />

            <input type="file" accept=".mp3,.wav,.m4a" @change="onFileChange" class="mb-3" />

            <button
              @click="sendAudio"
              :disabled="isProcessing"
              class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-60"
            >
              <span v-if="!isProcessing">Envoyer</span>
              <span v-else>⏳ Traitement en cours...</span>
            </button>

            <!-- Progress bar -->
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

            <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
            <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- File list -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">Derniers enregistrements</h2>

        <div v-if="loading" class="text-gray-500 text-center py-6">
          Chargement des fichiers...
        </div>

        <div v-else-if="fichiers.length === 0" class="text-gray-500 text-center py-6">
          Aucun fichier trouvé.
        </div>

        <table v-else class="min-w-full border-collapse rounded-xl overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="text-left p-3 font-medium text-gray-700">Nom</th>
              <th class="text-left p-3 font-medium text-gray-700">Date</th>
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

              <!-- STATUS -->
              <td class="p-3">
                <span
                  v-if="f.status === 'completed'"
                  class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                >
                  PDF prêt
                </span>
                <span
                  v-else
                  class="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                >
                  En cours
                </span>
              </td>

              <!-- ACTIONS -->
              <td class="p-3 space-x-3">
                <router-link
                  v-if="f.status === 'completed'"
                  :to="`/fichier/${f.id_audio}`"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-block"
                >
                  📄 Consulter
                </router-link>

                <a
                  v-if="f.status === 'completed'"
                  :href="`http://localhost:8000/download/pdf/${f.id_audio}`"
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium inline-block"
                >
                  📥 PDF
                </a>

                <button
                  @click="deleteFile(f.id_audio)"
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  🗑️ Supprimer
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

const notification = ref("");
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

const user_id = localStorage.getItem("user_id");

const importFromDrive = () => {
  alert("L’importation depuis Google Drive sera bientôt disponible !");
};

const toggleUpload = () => {
  showUpload.value = !showUpload.value;
};

const logout = () => {
  localStorage.removeItem("user_id");
  router.push("/login");
};

function onFileChange(e) {
  file.value = e.target.files[0];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR");
}

function showNotification(text) {
  notification.value = text;
  setTimeout(() => (notification.value = ""), 4000);
}


async function deleteFile(id_audio) {
  if (!confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;
  try {
    await axios.delete(`http://127.0.0.1:8000/fichiers/${id_audio}`);
    fichiers.value = fichiers.value.filter((f) => f.id_audio !== id_audio);
  } catch (err) {
    alert("Erreur lors de la suppression.");
  }
}

async function sendAudio() {
  try {
    if (!file.value) {
      error.value = "Choisis un fichier avant d’envoyer.";
      return;
    }

    const formData = new FormData();
    formData.append("file", file.value);
    formData.append("title", title.value);
    formData.append("id_user", user_id);   // IMPORTANT

    error.value = "";
    message.value = "";
    uploadProgress.value = 0;
    isProcessing.value = true;

    await axios.post("http://127.0.0.1:8000/upload", formData, {
      onUploadProgress: (e) => {
        uploadProgress.value = (e.loaded / e.total) * 100;
      },
    });

    message.value = "Traitement IA en cours…";

const interval = setInterval(async () => {
  await fetchFiles();

  const finished = fichiers.value.some(f => f.status === "completed");

  if (finished) {
    clearInterval(interval);
    message.value = "";
    showNotification("✨ Le PDF est prêt !");
  }
}, 2000);

  } catch (err) {
    error.value = "Erreur : " + (err.response?.data?.detail || err.message);
  } finally {
    isProcessing.value = false;
  }
}

async function fetchFiles() {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/fichiers?id_user=${user_id}`);
    fichiers.value = res.data;
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
