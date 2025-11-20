<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>

      <form @submit.prevent="login" class="flex flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          class="border border-gray-300 rounded-lg p-2"
          required
        />
        <button type="submit" class="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Se connecter
        </button>
      </form>

      <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>

      <p class="text-center mt-4">
        Pas encore de compte ?
        <router-link to="/register" class="text-blue-600 hover:underline">
          Créer un compte
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/api/api"; 

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

async function login() {
  error.value = "";
  try {
    const response = await loginUser({
      email: email.value,
      password: password.value,
    });

    const token = response.data.access_token;
    localStorage.setItem("token", token);
    router.push("/dashboard");
  } catch (err) {
    error.value = "Email ou mot de passe incorrect";
  }
}
</script>
