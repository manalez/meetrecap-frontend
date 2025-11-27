<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>

      <form @submit.prevent="login" class="flex flex-col gap-4">
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="input" />

        <button type="submit" class="btn">Se connecter</button>
      </form>

      <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>

      <p class="text-center mt-4">
        Pas encore de compte ?
        <router-link to="/register" class="text-blue-600 hover:underline">Créer un compte</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/api/api";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = "";
  try {
    const response = await loginUser({
      email: email.value,
      password: password.value,
    });

    // ⚠️ response.data.user contient id, name, email
    const user = response.data.user;

    // 🔥 On stocke l'ID utilisateur pour tout le reste du site
    localStorage.setItem("user_id", user.id);

    // Facultatif (si tu veux stocker le nom, mail etc.)
    localStorage.setItem("user", JSON.stringify(user));

    router.push("/dashboard");
  } catch (err) {
    error.value = "Email ou mot de passe incorrect";
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.75rem;
  border-radius: 8px;
  width: 100%;
}
.btn {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
}
</style>
