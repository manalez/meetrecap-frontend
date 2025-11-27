<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow w-96">
      <h1 class="text-2xl font-bold text-center mb-4">Créer un compte</h1>

      <form @submit.prevent="register" class="flex flex-col gap-3">
        <input v-model="name" placeholder="Nom complet" class="border p-2 rounded" />
        <input v-model="email" placeholder="Email" class="border p-2 rounded" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="border p-2 rounded" />
        <button class="bg-blue-600 text-white p-2 rounded">Créer mon compte</button>
      </form>

      <p v-if="error" class="text-red-500 text-center mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "../api/api";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

async function register() {
  try {
    await registerUser({ name: name.value, email: email.value, password: password.value });
    router.push("/login");
  } catch {
    error.value = "Erreur lors de l'inscription";
  }
}
</script>
