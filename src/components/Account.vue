<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">⚙️ Compte</div>
      <nav class="flex-1 p-4 space-y-3">
        <router-link
          to="/dashboard"
          class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          active-class="bg-gray-800"
        >
          🏠 Tableau de bord
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
    <main class="flex-1 p-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Mon compte</h1>

      <form class="bg-white shadow rounded-xl p-8 w-full max-w-2xl space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2 font-semibold">Nom</label>
            <input v-model="lastname" class="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label class="block text-gray-700 mb-2 font-semibold">Prénom</label>
            <input v-model="firstname" class="w-full border rounded-lg px-4 py-2" />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 mb-2 font-semibold">Adresse e-mail</label>
          <input v-model="email" type="email" class="w-full border rounded-lg px-4 py-2" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-2 font-semibold">Mot de passe</label>
            <input type="password" v-model="password" class="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label class="block text-gray-700 mb-2 font-semibold">Numéro de téléphone</label>
            <input v-model="phone" class="w-full border rounded-lg px-4 py-2" />
          </div>
        </div>

        <button
          @click.prevent="saveAccount"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          💾 Enregistrer
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const lastname = ref("Zaher")
const firstname = ref("Manal")
const email = ref("manal.zaher@example.com")
const password = ref("123456")
const phone = ref("+33 1 234 56789")

function saveAccount() {
  alert("✅ Compte mis à jour avec succès !")
}

function logout() {
  alert("🔒 Déconnecté")
  router.push("/login")
}
</script>
