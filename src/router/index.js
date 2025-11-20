import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../components/Dashboard.vue";
import UploadAudio from "../components/UploadAudio.vue";
import Account from "../components/Account.vue";
import FichiersList from "../components/FichiersList.vue"; // ✅ ajout de la page de consultation

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/upload", component: UploadAudio },
  { path: "/account", component: Account },
  { path: "/fichiers", component: FichiersList }, // ✅ nouvelle route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
