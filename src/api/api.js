// src/api/api.js
import axios from "axios";
import { API_URL } from "./config";

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_URL,
});

// ==================== 🔐 AUTH ====================

// ✅ Inscription (REGISTER)
export async function registerUser(data) {
  return api.post("/register", {
    name: data.name,        // doit correspondre au backend
    email: data.email,
    password: data.password,
  });
}

// ✅ Connexion (LOGIN)
export async function loginUser(credentials) {
  return api.post("/login", {
    email: credentials.email,
    password: credentials.password,
  });
}

// ==================== 🎧 UPLOAD AUDIO ====================

export async function uploadAudio(file, title, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  return api.post("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}

// ==================== 📂 FICHIERS ====================

// ✅ Liste des fichiers
export async function getUserFiles(token) {
  return api.get("/fichiers", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ✅ Détails d’un compte-rendu
export async function getCompteRendu(audioId, token) {
  return api.get(`/fichiers/${audioId}/compte-rendu`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default api;
