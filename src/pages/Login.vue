<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
    <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-purple-600 mb-8">Connexion</h2>

      <form @submit.prevent="loginUser" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="exemple@mail.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Se connecter
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">Pas encore de compte ?</p>
        <router-link to="/register" class="text-purple-600 hover:underline font-semibold">Créer un compte</router-link>
      </div>

      <div class="mt-8">
        <button
          @click="loginWithGoogle"
          class="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
          Connexion avec Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()

function loginUser() {
  if (email.value === "test@mail.com" && password.value === "123456") {
    alert("Connexion réussie !")
    router.push("/dashboard")
  } else {
    alert("Identifiants invalides")
  }
}

function loginWithGoogle() {
  alert("Connexion Google simulée (backend à venir)")
}
</script>
