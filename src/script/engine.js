document.addEventListener("DOMContentLoaded", () => {
  // Ouvinte para as teclas do Piano
const pianoKeys = document.querySelectorAll(".piano-keys .key");
  // Ouvinte para quando clicar com o dedo/mouse nos Pads da Bateria
const pads = document.querySelectorAll(".drum-pads .pad");
  const volumeSlider = document.querySelector(".volume-slider input");
  const keysCheck = document.querySelector(".keys-check input");
  const bodyElement = document.body;

  let currentMode = "piano"; // Modo inicial
  let mapedKeys = [];
  let audio = new Audio();
  
// --- CONFIGURAÇÃO DO METRÔNOMO E SUSTAIN ---

const btnMetronome = document.getElementById("btn-metronome");
const inputBpm = document.getElementById("input-bpm");
const bpmValue = document.getElementById("bpm-value");
const metronomeLight = document.getElementById("metronome-light");
const checkSustain = document.getElementById("check-sustain");

let metronomeInterval = null;
let isMetronomeOn = false;
let bpm = 120;

// Mapa de frequências (Hz) para cada tecla do seu teclado musical
const frequencies = {
  "a": 261.63, // C4 (Dó)
  "w": 277.18, // C#4 (Dó#)
  "s": 293.66, // D4 (Ré)
  "e": 311.13, // D#4 (Ré#)
  "d": 329.63, // E4 (Mi)
  "f": 349.23, // F4 (Fá)
  "t": 369.99, // F#4 (Fá#)
  "g": 392.00, // G4 (Sol)
  "y": 415.30, // G#4 (Sol#)
  "h": 440.00, // A4 (Lá)
  "u": 466.16, // A#4 (Lá#)
  "j": 493.88, // B4 (Si)
  "k": 523.25, // C5 (Dó agudo)
  "o": 554.37, // C#5
  "l": 587.33, // D5 (Ré agudo)
  "p": 622.25, // D#5
  ";": 659.25  // E5 (Mi agudo)
};

// Alimenta o array mapedKeys com as letras do teclado ('a', 'w', 's', etc.)
mapedKeys = Object.keys(frequencies);

// Cria um único contexto de áudio para todo o app (evita travar o celular)
const audioCtx = new (window.AudioContext || window.AudioContext)();

// Som do clique do metrônomo usando a própria frequência do navegador (sem precisar de arquivo!)
const playMetronomeClick = () => {
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, audioCtx.currentTime); // Som estalado de clique
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);

  // Faz a luzinha piscar na tela
  metronomeLight.classList.add("flash");
  setTimeout(() => metronomeLight.classList.remove("flash"), 50);
};

// Função para iniciar/parar o metrônomo
const toggleMetronome = () => {
  if (isMetronomeOn) {
    clearInterval(metronomeInterval);
    btnMetronome.textContent = "⏱️ Ligar Metrônomo";
    btnMetronome.classList.remove("active");
    isMetronomeOn = false;
  } else {
    const intervalMs = (60 / bpm) * 1000; // Converte BPM para milissegundos
    metronomeInterval = setInterval(playMetronomeClick, intervalMs);
    btnMetronome.textContent = "⏱️ Parar Metrônomo";
    btnMetronome.classList.add("active");
    isMetronomeOn = true;
  }
};

// Ouvinte do arrastar do BPM
inputBpm.addEventListener("input", (e) => {
  bpm = e.target.value;
  bpmValue.textContent = `${bpm} BPM`;
  if (isMetronomeOn) {
    // Se estiver ligado, reinicia com o tempo novo instantaneamente
    toggleMetronome();
    toggleMetronome();
  }
});

btnMetronome.addEventListener("click", toggleMetronome);

// Função que gera o som do Sintetizador via código
const playSynthSound = (key) => {
  if (!frequencies[key]) return;

  // Se o motor de áudio estiver "dormindo" (bloqueio do mobile), nós acordamos ele
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  // IMPORTANTE: Removemos a linha "const audioCtx = new ..." que criava vários motores!

  // 1. Criamos o Oscilador e o Controle de Volume
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sawtooth"; 
  oscillator.frequency.setValueAtTime(frequencies[key], audioCtx.currentTime);

  const sliderVolumeHtml = document.querySelector(".volume-slider input");
  const currentVolume = sliderVolumeHtml ? sliderVolumeHtml.value : 1;

  // Configuração do volume e tempo de duração
  gainNode.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
  
  const duration = checkSustain.checked ? 1.5 : 0.4;
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  // Conecta e toca
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

// Função principal para tocar os sons de forma inteligente
const playTune = (key, isDrumClick = false) => {
  
  // 1. CHECAGEM SE É BATERIA (Se veio do clique no Pad ou se o modo global for Drum)
  // Se clicou no Pad de bateria OU se o modo geral for bateria, toca o som da pasta 'drum'
  if (isDrumClick) {
    audio.src = `src/drum/${key}.wav`;
    audio.play().catch(e => console.log("Erro ao tocar bateria:", e));
    
    // Faz a animação do Pad acender
    const padElement = document.querySelector(`.pad[data-key="${key}"]`);
    if (padElement) {
      padElement.classList.add("active");
      setTimeout(() => padElement.classList.remove("active"), 100);
    }

    // Grava na Loop Station se estiver ativo
    if (isRecording) {
      recordedNotes.push({ key: key, mode: "drum", time: Date.now() - recordStartTime });
    }
    return; // Para a função aqui para não misturar com o piano!
  }

  // 2. CHECAGEM DO SINTETIZADOR ESPACIAL
  if (currentMode === "synth") {
    playSynthSound(key);
    if (isRecording) {
      recordedNotes.push({ key: key, mode: "synth", time: Date.now() - recordStartTime });
    }
    const element = document.querySelector(`.key[data-key="${key}"]`);
    if (element) {
      element.classList.add("active");
      setTimeout(() => element.classList.remove("active"), 150);
    }
    return;
  }

  // 3. SE NÃO FOR NENHUM DOS DOIS, TOCA O PIANO TRADICIONAL (.wav)
  audio.src = `src/tunes/${key}.wav`;
  audio.play().catch(e => console.log("Erro ao tocar piano:", e));

  const keyElement = document.querySelector(`.key[data-key="${key}"]`);
  if (keyElement) {
    keyElement.classList.add("active");
    setTimeout(() => keyElement.classList.remove("active"), 150);
  }

  if (isRecording) {
    recordedNotes.push({ key: key, mode: "piano", time: Date.now() - recordStartTime });
  }
};

  // Mapeia chaves do piano
pianoKeys.forEach(key => {
  key.addEventListener("click", () => {
    const clickedKey = key.dataset.key;
    playTune(clickedKey, false); // false = não é bateria, é piano/synth!
  });
});

  // Mapeia chaves da bateria
  pads.forEach(pad => {
  pad.addEventListener("click", () => {
    const clickedKey = pad.dataset.key;
    // Passamos o segundo parâmetro como 'true' para o sistema saber que é BATERIA!
    playTune(clickedKey, true); 
  });
});

// 🚀 1. ANTES DE TUDO: Recupera o tema salvo ou usa o "theme-neon" se não tiver nenhum
const temaSalvo = localStorage.getItem("piano-theme") || "theme-neon";

// GARANTE AS CONFIGURAÇÕES INICIAIS AO ABRIR A PÁGINA (Agora usando a memória):
bodyElement.classList.add(temaSalvo, "mode-piano");

// --- 1. CONTROLE DE TROCA DE TEMAS DE FORMA SEGURA ---
const themeStyleSelect = document.getElementById("theme-style");

// 🚀 2. Ajusta a caixinha do menu select para mostrar o nome do tema salvo ao carregar
themeStyleSelect.value = temaSalvo;

themeStyleSelect.addEventListener("change", (e) => {
  const valorSelecionado = e.target.value; // Pega o que o usuário clicou
  
  // Limpa APENAS as classes de tema antigas para não dar conflito
  document.body.classList.remove("theme-neon", "theme-vintage", "theme-pastel", "theme-gold", "theme-arcade", "theme-light");
  
  // Váriavel auxiliar para sabermos qual classe foi ativada e salvar depois
  let classeAtiva = "theme-neon";
  
  // Faz uma checagem direta para garantir que a classe certa do CSS seja aplicada
  if (valorSelecionado.includes("neon") || valorSelecionado.includes("cyberpunk")) {
    document.body.classList.add("theme-neon");
    classeAtiva = "theme-neon";
  } else if (valorSelecionado.includes("vintage")) {
    document.body.classList.add("theme-vintage");
    classeAtiva = "theme-vintage";
  } else if (valorSelecionado.includes("pastel")) {
    document.body.classList.add("theme-pastel");
    classeAtiva = "theme-pastel";
  } else if (valorSelecionado.includes("gold")) {
    document.body.classList.add("theme-gold");
    classeAtiva = "theme-gold";
  } else if (valorSelecionado.includes("arcade")) {
    document.body.classList.add("theme-arcade");
    classeAtiva = "theme-arcade";
  } else if (valorSelecionado.includes("light")) {
    document.body.classList.add("theme-light");
    classeAtiva = "theme-light";
  }
  
  // 🚀 3. SALVA O TEMA SELECIONADO NA MEMÓRIA:
  localStorage.setItem("piano-theme", classeAtiva);
});

// --- 2. CONTROLE DE TROCA DE MODO (PIANO / BATERIA) ---
const stationModeSelect = document.getElementById("station-mode");

stationModeSelect.addEventListener("change", (e) => {
  const selectedMode = e.target.value; // "piano", "drum" ou "synth"
  
    // ATUALIZAÇÃO DA TROCA DE MODO (Substitua o if/else antigo por este):
  currentMode = selectedMode; // Atualiza a variável global com o modo atual ("piano", "drum" ou "synth")
  
  // Se for Piano OU Sintetizador, precisamos que a estrutura visual do Piano apareça
  if (selectedMode === "piano" || selectedMode === "synth") {
    bodyElement.classList.add("mode-piano");
    bodyElement.classList.remove("mode-drum");
  } else if (selectedMode === "drum") {
    // Se for bateria, esconde o piano e mostra o MPC
    bodyElement.classList.add("mode-drum");
    bodyElement.classList.remove("mode-piano");
  }
});

  // Ouvinte do Teclado Físico
  document.addEventListener("keydown", (e) => {
    if (mapedKeys.includes(e.key)) {
      playTune(e.key);
    }
  });

  const handleVolume = (e) => { audio.volume = e.target.value; };
  const showHideKeys = () => { pianoKeys.forEach((key) => key.classList.toggle("hide")); };

  if (volumeSlider) volumeSlider.addEventListener("input", handleVolume);
  if (keysCheck) keysCheck.addEventListener("click", showHideKeys);
});

// --- CONFIGURAÇÃO DA LOOP STATION (GRAVADOR) ---

const btnRecord = document.getElementById("btn-record");
const btnStopRec = document.getElementById("btn-stop-rec");
const btnPlayRec = document.getElementById("btn-play-rec");

let recordedNotes = []; // Array que vai guardar a nossa música
let isRecording = false;
let recordStartTime = 0;

// Função que inicia a gravação
btnRecord.addEventListener("click", () => {
  recordedNotes = []; // Limpa gravações antigas
  isRecording = true;
  recordStartTime = Date.now(); // Guarda o momento exato em que começou
  
  btnRecord.classList.add("recording");
  btnRecord.textContent = "🔴 Gravando...";
  btnRecord.disabled = true;
  btnStopRec.disabled = false;
  btnPlayRec.disabled = true;
});

// Função que para a gravação
btnStopRec.addEventListener("click", () => {
  isRecording = false;
  btnRecord.classList.remove("recording");
  btnRecord.textContent = "🔴 Gravar";
  btnRecord.disabled = false;
  btnStopRec.disabled = true;
  
  // Se gravou alguma coisa, libera o botão de dar Play
  if (recordedNotes.length > 0) {
    btnPlayRec.disabled = false;
  }
  // LINHA DE TESTE: Vamos ver o que foi gravado!
  console.log("Notas gravadas até agora:", recordedNotes);
});

// Função que reproduz o que foi gravado (CORRIGIDA)
btnPlayRec.addEventListener("click", () => {
  if (recordedNotes.length === 0) return;

  btnPlayRec.disabled = true;
  const sliderVolumeHtml = document.querySelector(".volume-slider input");

  recordedNotes.forEach((note) => {
    setTimeout(() => {
      
      // Se a nota gravada for do Sintetizador, toca gerando a onda sonora por código
      if (note.mode === "synth") {
        playSynthSound(note.key);
      } else {
        // Se for piano ou bateria, carrega o arquivo .wav correspondente
        const folder = note.mode === "piano" ? "tunes" : "drum";
        const caminhoFinal = `src/${folder}/${note.key}.wav`;
        const playbackAudio = new Audio(caminhoFinal);
        
        playbackAudio.volume = sliderVolumeHtml ? sliderVolumeHtml.value : 1;
        playbackAudio.play().catch((err) => console.log("Erro ao tocar áudio:", err));
      }

      // Efeito visual das teclas acendendo sozinhas
      const selector = (note.mode === "piano" || note.mode === "synth") ? `.key[data-key="${note.key}"]` : `.pad[data-key="${note.key}"]`;
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add("active");
        setTimeout(() => element.classList.remove("active"), 150);
      }
    }, note.time);
  });

  const lastNoteTime = recordedNotes[recordedNotes.length - 1].time;
  setTimeout(() => {
    btnPlayRec.disabled = false;
  }, lastNoteTime + 500);
});