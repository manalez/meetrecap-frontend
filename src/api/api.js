// src/api/api.js
import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({
  baseURL: API_URL,
});

// ==================== 🔐 AUTH ====================

// REGISTER
export async function registerUser(data) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  return api.post("/register", formData);
}

// LOGIN
export async function loginUser(data) {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);

  return api.post("/login", formData);
}

// ==================== 🎧 UPLOAD AUDIO ====================
export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ==================== 📂 FICHIERS ====================

// Liste fichiers
export async function fetchFiles() {
  return api.get("/fichiers");
}

// Détail d’un fichier
export async function fetchFileDetail(id) {
  return api.get(`/fichiers/${id}/detail`);
}

// Télécharger audio original
export async function downloadAudio(id) {
  window.open(`${API_URL}/fichiers/${id}/download`, "_blank");
}

export default api;
