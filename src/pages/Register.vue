<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-8">📝 Créer un compte</h2>

      <form @submit.prevent="registerUser" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Nom</label>
          <input
            v-model="lastname"
            type="text"
            placeholder="Votre nom"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">Prénom</label>
          <input
            v-model="firstname"
            type="text"
            placeholder="Votre prénom"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="exemple@mail.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">Confirmer le mot de passe</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Créer mon compte
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">Déjà inscrit ?</p>
        <router-link to="/login" class="text-blue-600 hover:underline font-semibold">Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const lastname = ref("")
const firstname = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")

const router = useRouter()

function registerUser() {
  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas.")
    return
  }

  alert(`Compte créé pour ${firstname.value} ${lastname.value}`)
  router.push("/login")
}
</script>
