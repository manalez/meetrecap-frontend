
```markdown
# 🎨 MeetRecap – Frontend (Vue.js + Tailwind CSS)

## 🚀 Présentation

MeetRecap est une application web qui permet de transcrire et résumer automatiquement des réunions grâce à l’intelligence artificielle.  
Cette partie du projet correspond au **frontend**, développé avec **Vue.js 3** et **Tailwind CSS**.

Le frontend communique avec le backend (FastAPI - Python) pour :
- gérer l’authentification (connexion / inscription),
- permettre l’envoi de fichiers audio,
- et afficher le résumé et la transcription générés par l’IA.


## 🧱 Structure du projet
frontend/
│
├── src/
│ ├── assets/ # Fichiers CSS et images
│ │ └── tailwind.css
│ │
│ ├── components/ # Composants Vue réutilisables
│ │ ├── Auth/
│ │ │ ├── Login.vue # Page de connexion
│ │ │ └── Register.vue # Page d’inscription
│ │ │
│ │ ├── Dashboard.vue # Page principale (après connexion)
│ │ └── UploadAudio.vue # Interface d’envoi de fichiers audio
│ │
│ ├── router/
│ │ └── index.js # Gestion des routes Vue
│ │
│ ├── App.vue # Composant racine
│ └── main.js # Point d’entrée de l’application
│
├── package.json # Dépendances et scripts npm
├── postcss.config.js # Config Tailwind / PostCSS
├── tailwind.config.js # Thème Tailwind personnalisé
└── vite.config.js # Config du serveur de développement (Vite)

## ⚙️ Installation et Lancement

### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/mounia000/transcription_meetvocal.git
cd frontend
````

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Lancer le serveur de développement

```bash
npm run dev
```

### 4️⃣ Accéder à l’application

➡️ [http://localhost:5173](http://localhost:5173)

---

## 💡 Fonctionnalités principales

| Fonction                       | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| 🔐 **Inscription / Connexion** | Gestion de l’authentification utilisateur (via API FastAPI). |
| 🏠 **Dashboard**               | Espace principal après connexion.                            |
| 🎧 **Upload audio**            | Envoi de fichiers `.mp3` pour transcription automatique.     |
| 🧾 **Résumés IA**              | Affichage du résumé et de la transcription nettoyée.         |
| 📱 **Responsive Design**       | Interface adaptée à tous les écrans grâce à Tailwind CSS.    |

---

## 🧠 Technologies utilisées

| Technologie                       | Rôle                                       |
| --------------------------------- | ------------------------------------------ |
| 🟢 **Vue.js 3 (Composition API)** | Framework frontend principal               |
| 🎨 **Tailwind CSS**               | Design rapide, moderne et responsive       |
| ⚡ **Vite.js**                     | Outil de build et serveur de développement |
| 🔑 **Vue Router**                 | Gestion de la navigation entre les pages   |
| 🔄 **Axios / Fetch API**          | Communication avec le backend FastAPI      |

---

## 🧭 Fonctionnement global

1️⃣ L’utilisateur s’inscrit ou se connecte (via `Register.vue` / `Login.vue`).

2️⃣ Une fois connecté, il accède au `Dashboard.vue`.

3️⃣ Depuis la page `UploadAudio.vue`, il téléverse un fichier audio `.mp3`.

4️⃣ Le backend (FastAPI) traite le fichier (transcription + résumé IA).

5️⃣ Le frontend affiche les résultats à l’écran.

---

## 🎨 Pourquoi Vue.js et Tailwind CSS ?

* **Vue.js** : Framework progressif, rapide, facile à apprendre et parfait pour les projets modulaires.
* **Tailwind CSS** : Permet un design moderne, propre et responsive sans écrire beaucoup de CSS manuel.

> Ce duo technologique garantit un développement rapide, clair et visuellement cohérent.

---

## 🧑‍💻 Auteurs

👩‍💻 MANAL
👩‍💻 Mounia
👩‍💻 Hafssa
👩‍💻 Youssof

Projet académique :
**MeetRecap – Application de transcription et résumé automatique de réunions**



