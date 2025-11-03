import { createRouter, createWebHistory } from "vue-router"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Dashboard from "../components/Dashboard.vue"
import UploadAudio from "../components/UploadAudio.vue"
import Account from "../components/Account.vue"

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/upload", component: UploadAudio },
  { path: "/account", component: Account },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
