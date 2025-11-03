<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">
        🎧 MeetRecap
      </div>
      <nav class="flex-1 p-4 space-y-3">
        <router-link
          to="/dashboard"
          class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          active-class="bg-gray-800"
        >
          🏠 Tableau de bord
        </router-link>
        <router-link
          to="/upload"
          class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          active-class="bg-gray-800"
        >
          ⬆️ Importer un enregistrement
        </router-link>
        <router-link
          to="/account"
          class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          active-class="bg-gray-800"
        >
          👤 Mon compte
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-700">
        <button
          @click="logout"
          class="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white font-semibold transition"
        >
          🚪 Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-100 p-10 overflow-y-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

      <div class="grid grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-semibold mb-3">Importer depuis Google Drive</h2>
          <p class="text-gray-500 mb-4">Importez un enregistrement audio depuis votre Drive.</p>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            📂 Importer
          </button>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-semibold mb-3">Importer un fichier local</h2>
          <p class="text-gray-500 mb-4">Choisissez un fichier audio sur votre ordinateur.</p>
          <router-link
            to="/upload"
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
          >
            ⬆️ Importer localement
          </router-link>
        </div>
      </div>

      <h2 class="text-2xl font-bold mt-10 mb-4">📋 Derniers enregistrements</h2>

      <table class="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="text-left p-3">Nom</th>
            <th class="text-left p-3">Source</th>
            <th class="text-left p-3">Statut</th>
            <th class="text-center p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in recordings" :key="rec.name" class="border-b">
            <td class="p-3">{{ rec.name }}</td>
            <td class="p-3">{{ rec.source }}</td>
            <td class="p-3">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-700': rec.status === 'PDF prêt',
                  'bg-yellow-100 text-yellow-700': rec.status === 'En cours',
                  'bg-red-100 text-red-700': rec.status === 'Échec'
                }"
              >
                {{ rec.status }}
              </span>
            </td>
            <td class="text-center space-x-2">
              <button class="text-blue-600 hover:underline">Consulter</button>
              <button class="text-purple-600 hover:underline">Télécharger</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const recordings = ref([
  { name: "Réunion 1", source: "Drive", status: "PDF prêt" },
  { name: "Réunion projet", source: "Upload", status: "En cours" },
  { name: "Réunion 4", source: "Drive", status: "Échec" }
])

function logout() {
  alert("🔒 Déconnecté")
  router.push("/login")
}
</script>
