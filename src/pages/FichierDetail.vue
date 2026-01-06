<template>
  <div :class="darkMode ? 'bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'">
    <!-- Barre de contrôles sticky -->
    <div class="sticky top-0 z-50 shadow-lg" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- Bouton retour -->
          <button @click="goBack" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            ← Retour au tableau de bord
          </button>

          <!-- Contrôles audio -->
          <div v-if="isPlaying" class="flex items-center gap-3 flex-wrap">
            <button @click="togglePause" :class="isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'" class="text-white px-3 py-2 rounded-lg flex items-center gap-2 transition text-sm">
              <span v-if="isPaused">▶️ Reprendre</span>
              <span v-else>⏸️ Pause</span>
            </button>
            
            <button @click="stopSpeech" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition text-sm">
              ⏹️ Arrêter
            </button>

            <select v-model="playbackRate" @change="updatePlaybackRate" class="px-3 py-2 rounded-lg border text-sm font-semibold" :class="darkMode ? 'bg-gray-800 text-white border-yellow-500' : 'bg-white text-gray-800 border-gray-300'" style="color-scheme: dark;">
              <option value="0.75">0.75x</option>
              <option value="1">1x (Normal)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
            </select>

            <div class="flex items-center gap-2">
              <div class="w-32 h-2 rounded-full overflow-hidden" :class="darkMode ? 'bg-gray-600' : 'bg-gray-300'">
                <div class="h-full bg-blue-500 transition-all duration-300" :style="{width: audioProgress + '%'}"></div>
              </div>
              <span class="text-sm font-semibold" :class="darkMode ? 'text-white' : 'text-gray-700'">{{ audioProgress }}%</span>
            </div>
          </div>

          <!-- Contrôles interface -->
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Mode sombre -->
            <button @click="darkMode = !darkMode" class="px-3 py-2 rounded-lg transition text-sm font-semibold" :class="darkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'">
              {{ darkMode ? '☀️ Clair' : '🌙 Sombre' }}
            </button>

            <!-- Taille police -->
            <select v-model="fontSize" class="px-3 py-2 rounded-lg border text-sm font-semibold" :class="darkMode ? 'bg-gray-800 text-white border-yellow-500' : 'bg-white text-gray-800 border-gray-300'" style="color-scheme: dark;">
              <option value="text-sm">Police petite</option>
              <option value="text-base">Police normale</option>
              <option value="text-lg">Police grande</option>
              <option value="text-xl">Police très grande</option>
            </select>

            <!-- Auto-play -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="autoPlay" class="w-4 h-4">
              <span class="text-sm" :class="darkMode ? 'text-white' : 'text-gray-700'">Auto-play</span>
            </label>
          </div>
        </div>

        <!-- Barre de recherche -->
        <div class="mt-3 flex gap-2">
          <input 
            v-model="searchQuery" 
            @input="highlightSearch"
            type="text" 
            placeholder="Rechercher dans le document..." 
            class="flex-1 px-4 py-2 rounded-lg border" 
            :class="darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300'"
          >
          <span v-if="searchMatches > 0" class="px-4 py-2 rounded-lg text-sm font-semibold" :class="darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'">
            {{ searchMatches }} résultat(s)
          </span>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div v-if="file">
        <!-- En-tête -->
        <div class="shadow-lg rounded-lg p-6 mb-6" :class="darkMode ? 'bg-gray-800 border-2 border-blue-500' : 'bg-white'">
          <h1 class="text-3xl font-bold mb-4" :class="darkMode ? 'text-white' : 'text-gray-800'" style="display: block !important; opacity: 1 !important; visibility: visible !important;">
            🎙️ {{ (file.title || file.filename || 'Fichier Audio').replace(/\.[^/.]+$/, '') }}
          </h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" :class="[fontSize, darkMode ? 'text-gray-200' : 'text-gray-600']">
            <p><strong class="font-semibold">📅 Date :</strong> {{ formatDate(file.date_upload) }}</p>
            <p><strong class="font-semibold">⏱️ Durée :</strong> {{ file.duree ? formatTime(file.duree) : 'N/A' }}</p>
          </div>

          <!-- Boutons téléchargement -->
          <div class="flex gap-4 mt-6">
            <a :href="`http://localhost:8000/download/pdf/${file.id_audio}`" download class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              📄 Télécharger PDF
            </a>
            <a :href="`http://localhost:8000/download/word/${file.id_audio}`" download class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              📝 Télécharger Word
            </a>
          </div>
        </div>

        <!-- Sommaire / Table des matières -->
        <div v-if="file.resumes && file.resumes.length > 0" class="shadow-md rounded-lg p-6 mb-6" :class="darkMode ? 'bg-gray-800 border-2 border-purple-500' : 'bg-white'">
          <h2 class="text-2xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">📑 Sommaire</h2>
          <ul :class="[fontSize, 'space-y-2']">
            <li v-if="getResumesByType('resume_court').length > 0 || getResumesByType('general').length > 0">
              <a href="#resume-court" class="hover:underline font-medium" :class="darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600'">📝 Résumé Court</a>
            </li>
            <li v-if="getResumesByType('compte_rendu_complet').length > 0">
              <a href="#compte-rendu" class="hover:underline font-medium" :class="darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600'">📋 Compte-Rendu Complet</a>
            </li>
            <li v-if="getResumesByType('par_speaker').length > 0">
              <a href="#par-speaker" class="hover:underline font-medium" :class="darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600'">👥 Résumés Par Intervenant</a>
            </li>
            <li v-if="file.transcriptions && file.transcriptions.length > 0">
              <a href="#transcription" class="hover:underline font-medium" :class="darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600'">📝 Transcription Complète</a>
            </li>
          </ul>
        </div>

        <!-- Contenu des résumés -->
        <div v-if="file.resumes && file.resumes.length > 0">
          <!-- 1. RÉSUMÉ COURT -->
          <div id="resume-court" v-if="getResumesByType('resume_court').length > 0 || getResumesByType('general').length > 0">
            <div v-for="resume in [...getResumesByType('resume_court'), ...getResumesByType('general')]" :key="'court-' + resume.type" class="mb-8">
              <div class="p-6 rounded-lg shadow-md" :class="darkMode ? 'bg-gray-800 border-2 border-blue-600' : 'bg-blue-50'">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-2xl font-bold" :class="darkMode ? 'text-blue-400' : 'text-blue-800'">📝 RÉSUMÉ COURT</h3>
                  <button 
                    @click="toggleSpeech(resume.text, 'court')" 
                    :class="{
                      'bg-green-600 hover:bg-green-700': !isPlaying || currentPlayingIndex !== 'court',
                      'bg-red-600 hover:bg-red-700': isPlaying && currentPlayingIndex === 'court'
                    }"
                    class="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <span v-if="!isPlaying || currentPlayingIndex !== 'court'">▶️ Écouter</span>
                    <span v-else>⏹️ Arrêter</span>
                  </button>
                </div>
                <p :class="[fontSize, 'leading-relaxed whitespace-pre-wrap text-justify', darkMode ? 'text-gray-100' : 'text-gray-800', currentPlayingIndex === 'court' && isPlaying ? 'highlight-text' : '']" v-html="highlightText(resume.text)"></p>
              </div>
            </div>
          </div>

          <!-- Séparateur -->
          <div class="border-t-4 my-8" :class="darkMode ? 'border-gray-600' : 'border-gray-300'"></div>

          <!-- 2. COMPTE-RENDU COMPLET -->
          <div id="compte-rendu" v-for="resume in getResumesByType('compte_rendu_complet')" :key="'complet-' + resume.type" class="mb-8">
            <div class="p-6 rounded-lg shadow-md" :class="darkMode ? 'bg-gray-800 border-2 border-green-600' : 'bg-green-50'">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-2xl font-bold" :class="darkMode ? 'text-green-400' : 'text-green-800'">📋 COMPTE-RENDU COMPLET</h3>
                <button 
                  @click="toggleSpeech(resume.text, 'complet')" 
                  :class="{
                    'bg-green-600 hover:bg-green-700': !isPlaying || currentPlayingIndex !== 'complet',
                    'bg-red-600 hover:bg-red-700': isPlaying && currentPlayingIndex === 'complet'
                  }"
                  class="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <span v-if="!isPlaying || currentPlayingIndex !== 'complet'">▶️ Écouter</span>
                  <span v-else>⏹️ Arrêter</span>
                </button>
              </div>
              <p :class="[fontSize, 'leading-relaxed whitespace-pre-wrap text-justify', darkMode ? 'text-gray-100' : 'text-gray-800', currentPlayingIndex === 'complet' && isPlaying ? 'highlight-text' : '']" v-html="highlightText(resume.text)"></p>
            </div>
          </div>

          <!-- Séparateur -->
          <div class="border-t-4 my-8" :class="darkMode ? 'border-gray-600' : 'border-gray-300'"></div>

          <!-- 3. RÉSUMÉS PAR INTERVENANT -->
          <div id="par-speaker" v-if="getResumesByType('par_speaker').length > 0" class="mb-8">
            <div class="p-6 rounded-lg shadow-md" :class="darkMode ? 'bg-gray-800 border-2 border-purple-600' : 'bg-purple-50'">
              <h3 class="text-2xl font-bold mb-6" :class="darkMode ? 'text-purple-400' : 'text-purple-800'">👥 RÉSUMÉS PAR INTERVENANT</h3>
              <div v-for="(resume, index) in getResumesByType('par_speaker')" :key="'speaker-' + index" class="mb-6 p-4 rounded-lg shadow-sm" :class="darkMode ? 'bg-gray-700' : 'bg-white'">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-lg font-bold" :class="darkMode ? 'text-white' : 'text-gray-700'">{{ resume.speaker }}</h4>
                  <button 
                    @click="toggleSpeech(resume.text, 'speaker-' + index)" 
                    :class="{
                      'bg-green-600 hover:bg-green-700': !isPlaying || currentPlayingIndex !== 'speaker-' + index,
                      'bg-red-600 hover:bg-red-700': isPlaying && currentPlayingIndex === 'speaker-' + index
                    }"
                    class="text-white px-3 py-1 rounded-lg flex items-center gap-2 transition text-sm"
                  >
                    <span v-if="!isPlaying || currentPlayingIndex !== 'speaker-' + index">▶️ Écouter</span>
                    <span v-else>⏹️ Arrêter</span>
                  </button>
                </div>
                <p :class="[fontSize, 'leading-relaxed whitespace-pre-wrap text-justify', darkMode ? 'text-gray-100' : 'text-gray-700', currentPlayingIndex === 'speaker-' + index && isPlaying ? 'highlight-text' : '']" v-html="highlightText(resume.text)"></p>
              </div>
            </div>
          </div>

          <!-- Séparateur -->
          <div class="border-t-4 my-8" :class="darkMode ? 'border-gray-600' : 'border-gray-300'"></div>
        </div>

        <!-- Message si pas de résumés -->
        <div v-else class="border-l-4 p-6 rounded-lg" :class="darkMode ? 'bg-yellow-900 border-yellow-600' : 'bg-yellow-50 border-yellow-400'">
          <h3 class="text-lg font-semibold mb-2" :class="darkMode ? 'text-yellow-300' : 'text-yellow-800'">⚠️ Données non disponibles</h3>
          <p :class="[fontSize, darkMode ? 'text-yellow-200' : 'text-yellow-700']" class="mb-3">
            Les résumés ne sont pas encore dans la base de données. Ce fichier a peut-être été traité avant la mise à jour.
          </p>
          <p :class="[fontSize, 'text-sm', darkMode ? 'text-yellow-300' : 'text-yellow-600']">
            💡 Solution : Téléchargez le PDF ci-dessus ou retraitez le fichier audio.
          </p>
        </div>

        <!-- Section Transcriptions -->
        <div id="transcription" v-if="file.transcriptions && file.transcriptions.length > 0" class="shadow-md rounded-lg p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
          <h2 class="text-2xl font-bold mb-4" :class="darkMode ? 'text-white' : 'text-gray-800'">📝 Transcription Complète</h2>
          <button 
            @click="toggleSpeech(getFullTranscription(), -1)" 
            :class="{
              'bg-green-600 hover:bg-green-700': !isPlaying || currentPlayingIndex !== -1,
              'bg-red-600 hover:bg-red-700': isPlaying && currentPlayingIndex === -1
            }"
            class="text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2 transition"
          >
            <span v-if="!isPlaying || currentPlayingIndex !== -1">▶️ Écouter la transcription</span>
            <span v-else>⏹️ Arrêter</span>
          </button>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="(trans, index) in file.transcriptions" :key="index" class="p-3 rounded" :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
              <p :class="[fontSize, 'text-sm mb-1', darkMode ? 'text-gray-400' : 'text-gray-600']">
                <strong>{{ trans.speaker }}</strong> ({{ formatTime(trans.start_time) }} - {{ formatTime(trans.end_time) }})
              </p>
              <p :class="[fontSize, darkMode ? 'text-gray-200' : 'text-gray-700']" v-html="highlightText(trans.text)"></p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-10" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        <p>Chargement...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight-text {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Style pour le surlignage de recherche - :deep() permet d'atteindre le contenu v-html */
:deep(.highlight-search) {
  background-color: #fef08a !important;
  color: #000 !important;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 0 0 2px #facc15;
  animation: highlightPulse 1.5s ease-in-out infinite;
}

@keyframes highlightPulse {
  0%, 100% {
    background-color: #fef08a;
    box-shadow: 0 0 0 2px #facc15;
  }
  50% {
    background-color: #fde047;
    box-shadow: 0 0 8px 4px #facc15;
  }
}

/* Styles pour les selects en mode sombre */
select option {
  background-color: white;
  color: black;
}

.bg-gray-700 option {
  background-color: #374151 !important;
  color: white !important;
}

html.dark {
  color-scheme: dark;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchFileDetail, downloadAudio } from "../api/api";

const file = ref(null);
const route = useRoute();
const router = useRouter();
const isPlaying = ref(false);
const isPaused = ref(false);
const currentPlayingIndex = ref(null);
const audioProgress = ref(0);
const playbackRate = ref(1);
const darkMode = ref(false);
const fontSize = ref('text-base');
const searchQuery = ref('');
const searchMatches = ref(0);
const autoPlay = ref(false);

let speechSynthesis = null;
let currentUtterance = null;
let progressInterval = null;

const sectionsOrder = ['court', 'complet'];

onMounted(async () => {
  const res = await fetchFileDetail(route.params.id);
  file.value = res.data;
  
  console.log('📄 Données du fichier:', file.value);
  console.log('📋 Résumés:', file.value.resumes);
  console.log('📝 Transcriptions:', file.value.transcriptions);
  
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
  }

  // Charger préférences
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode) darkMode.value = savedDarkMode === 'true';
  
  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) fontSize.value = savedFontSize;
});

onUnmounted(() => {
  if (speechSynthesis && isPlaying.value) {
    speechSynthesis.cancel();
  }
  if (progressInterval) clearInterval(progressInterval);
});

// Sauvegarder préférences
watch(darkMode, (val) => {
  localStorage.setItem('darkMode', val);
});

watch(fontSize, (val) => {
  localStorage.setItem('fontSize', val);
});

function goBack() {
  router.push('/dashboard');
}

function toggleSpeech(text, index) {
  if (!speechSynthesis) {
    alert('La synthèse vocale n\'est pas supportée par votre navigateur.');
    return;
  }

  if (isPlaying.value && currentPlayingIndex.value === index) {
    speechSynthesis.cancel();
    isPlaying.value = false;
    isPaused.value = false;
    currentPlayingIndex.value = null;
    audioProgress.value = 0;
    if (progressInterval) clearInterval(progressInterval);
    return;
  }

  if (isPlaying.value) {
    speechSynthesis.cancel();
    if (progressInterval) clearInterval(progressInterval);
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'fr-FR';
  currentUtterance.rate = parseFloat(playbackRate.value);
  currentUtterance.pitch = 1.0;
  currentUtterance.volume = 1.0;

  // Calculer progression
  const textLength = text.length;
  let currentChar = 0;

  currentUtterance.onboundary = (event) => {
    currentChar = event.charIndex;
    audioProgress.value = Math.round((currentChar / textLength) * 100);
  };

  currentUtterance.onend = () => {
    isPlaying.value = false;
    isPaused.value = false;
    audioProgress.value = 0;
    if (progressInterval) clearInterval(progressInterval);
    
    // Lecture automatique en chaîne
    if (autoPlay.value) {
      playNextSection(index);
    }
  };

  currentUtterance.onerror = (event) => {
    isPlaying.value = false;
    isPaused.value = false;
    currentPlayingIndex.value = null;
    audioProgress.value = 0;
    if (progressInterval) clearInterval(progressInterval);
    
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      console.error('Erreur synthèse vocale:', event);
      alert('Erreur lors de la lecture audio: ' + event.error);
    }
  };

  speechSynthesis.speak(currentUtterance);
  isPlaying.value = true;
  isPaused.value = false;
  currentPlayingIndex.value = index;
  
  // Fallback pour progression si onboundary ne fonctionne pas
  progressInterval = setInterval(() => {
    if (isPlaying.value && !isPaused.value && audioProgress.value < 100) {
      audioProgress.value = Math.min(audioProgress.value + 1, 99);
    }
  }, 1000);
}

function togglePause() {
  if (!speechSynthesis) return;
  
  if (isPaused.value) {
    speechSynthesis.resume();
    isPaused.value = false;
  } else {
    speechSynthesis.pause();
    isPaused.value = true;
  }
}

function stopSpeech() {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
  isPlaying.value = false;
  isPaused.value = false;
  currentPlayingIndex.value = null;
  audioProgress.value = 0;
  if (progressInterval) clearInterval(progressInterval);
}

function updatePlaybackRate() {
  if (currentUtterance && speechSynthesis && isPlaying.value) {
    const wasPlaying = isPlaying.value;
    const currentIndex = currentPlayingIndex.value;
    const currentText = currentUtterance.text;
    
    speechSynthesis.cancel();
    
    if (wasPlaying) {
      setTimeout(() => {
        toggleSpeech(currentText, currentIndex);
      }, 100);
    }
  }
}

function playNextSection(currentIndex) {
  const currentSectionIdx = sectionsOrder.indexOf(currentIndex);
  if (currentSectionIdx !== -1 && currentSectionIdx < sectionsOrder.length - 1) {
    const nextSection = sectionsOrder[currentSectionIdx + 1];
    const resumes = file.value.resumes;
    
    if (nextSection === 'complet') {
      const complet = resumes.find(r => r.type === 'compte_rendu_complet');
      if (complet) {
        setTimeout(() => toggleSpeech(complet.text, 'complet'), 500);
      }
    }
  } else if (currentIndex === 'complet') {
    // Passer aux speakers
    const speakers = getResumesByType('par_speaker');
    if (speakers.length > 0) {
      setTimeout(() => toggleSpeech(speakers[0].text, 'speaker-0'), 500);
    }
  } else if (typeof currentIndex === 'string' && currentIndex.startsWith('speaker-')) {
    const speakerIdx = parseInt(currentIndex.split('-')[1]);
    const speakers = getResumesByType('par_speaker');
    if (speakerIdx + 1 < speakers.length) {
      setTimeout(() => toggleSpeech(speakers[speakerIdx + 1].text, `speaker-${speakerIdx + 1}`), 500);
    }
  }
}

function getFullTranscription() {
  if (!file.value || !file.value.transcriptions) return '';
  return file.value.transcriptions
    .map(t => `${t.speaker}: ${t.text}`)
    .join('. ');
}

function getResumesByType(type) {
  if (!file.value || !file.value.resumes) return [];
  return file.value.resumes.filter(r => r.type === type);
}

function highlightText(text) {
  if (!searchQuery.value) return text;
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<span class="highlight-search">$1</span>');
}

function highlightSearch() {
  if (!searchQuery.value) {
    searchMatches.value = 0;
    return;
  }
  
  let count = 0;
  const regex = new RegExp(searchQuery.value, 'gi');
  
  if (file.value && file.value.resumes) {
    file.value.resumes.forEach(resume => {
      const matches = resume.text.match(regex);
      if (matches) count += matches.length;
    });
  }
  
  if (file.value && file.value.transcriptions) {
    file.value.transcriptions.forEach(trans => {
      const matches = trans.text.match(regex);
      if (matches) count += matches.length;
    });
  }
  
  searchMatches.value = count;
}

function formatDate(d) {
  return new Date(d).toLocaleString('fr-FR');
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
</script>
