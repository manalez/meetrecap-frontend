<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Créer un compte </h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nom complet</label>
          <input
            v-model="name"
            type="text"
            placeholder="Entrez votre nom"
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Entrez votre email"
            required
          />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input
            v-model="password"
            type="password"
            placeholder="Choisissez un mot de passe"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="loading">Création du compte...</span>
          <span v-else>S'inscrire</span>
        </button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>

      <router-link to="/login" class="link">
        Déjà un compte ? Connectez-vous
      </router-link>
    </div>
  </div>
</template>

<script>
import { registerUser } from "@/api/api";

export default {
  name: "RegisterView",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";
      this.successMessage = "";
      this.loading = true;

      try {
        const { data } = await registerUser({
          name: this.name,
          email: this.email,
          password: this.password,
        });

        // Sauvegarde du token (si backend en renvoie un)
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }

        this.successMessage = "Compte créé avec succès ! Redirection...";
        setTimeout(() => {
          this.$router.push("/login"); // redirection vers login après inscription
        }, 1500);
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage =
            error.response.data.detail || "Erreur lors de la création du compte.";
        } else {
          this.errorMessage = "Impossible de contacter le serveur.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f9fc;
}

.register-card {
  width: 380px;
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #222;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

button {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #d9534f;
  margin-top: 1rem;
}

.success {
  color: #28a745;
  margin-top: 1rem;
}

.link {
  display: block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
}
</style>
