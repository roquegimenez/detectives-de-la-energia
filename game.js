/**
 * DETECTIVES DE LA ENERGÍA - Videojuego 2D Pixel Art
 * Motor de juego HTML5 Canvas + Web Audio API
 */

// --- MOTOR DE AUDIO RETRO (Web Audio API Sintetizado) ---
class RetroAudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 600, duration = 0.08, type = 'square') {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playStep() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch(e) {}
  }

  playPowerDown() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);

      setTimeout(() => {
        this.playBeep(980, 0.14, 'sine');
      }, 120);
    } catch(e) {}
  }

  playAlarm() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(340, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch(e) {}
  }

  playReignite() {
    if (!this.enabled) return;
    this.init();
    try {
      // Sonido de chispa y encendido brusco
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch(e) {}
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554, 659, 880, 1108, 1318];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.18, 'triangle');
      }, idx * 90);
    });
  }

  playLose() {
    if (!this.enabled) return;
    this.init();
    const notes = [420, 330, 240, 140];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBeep(freq, 0.25, 'sawtooth');
      }, idx * 120);
    });
  }
}

const audio = new RetroAudioManager();

// --- CONFIGURACIÓN DE ARTEFACTOS DE LA CASA ---
const APPLIANCES_CONFIG = [
  {
    id: 'heater',
    name: 'Estufa Radiante Eléctrica',
    category: 'CONSUMO EXCESIVO',
    catClass: 'cat-excessive',
    badge: '🔴 EXCESIVO',
    power: 2000,
    room: 'Cuarto Superior',
    x: 995,
    y: 340,
    radius: 70,
    icon: 'assets/icon_heater.png',
    actionText: '⚡ APAGAR ESTUFA',
    tip: '¡Una de las mayores devoradoras de energía! Generar calor por resistencia consume hasta 2.000W continuos. Abrígate antes de encenderla.',
    state: 'on'
  },
  {
    id: 'ac',
    name: 'Aire Acondicionado a 17°C',
    category: 'CONSUMO EXCESIVO',
    catClass: 'cat-excessive',
    badge: '🔴 EXCESIVO',
    power: 2200,
    room: 'Cuarto Superior',
    x: 1200,
    y: 310,
    radius: 70,
    icon: 'assets/icon_ac.png',
    actionText: '⚡ APAGAR AIRE ACONDICIONADO',
    tip: '¡Tener el aire a 17°C mientras hay una estufa encendida es una locura! En verano, fija el termostato a 24°C para ahorrar hasta un 30%.',
    state: 'on'
  },
  {
    id: 'iron',
    name: 'Plancha a Vapor Olvidada',
    category: 'CONSUMO EXCESIVO',
    catClass: 'cat-excessive',
    badge: '🔴 EXCESIVO',
    power: 1800,
    room: 'Lavadero / Baño',
    x: 285,
    y: 600,
    radius: 65,
    icon: 'assets/icon_iron.png',
    actionText: '⚡ DESENCHUFAR PLANCHA',
    tip: '¡Peligro de incendio y derroche masivo! Plancha toda la ropa junta y desenchúfala apenas termines.',
    state: 'on'
  },
  {
    id: 'stove',
    name: 'Anafe / Cocina Eléctrica',
    category: 'CONSUMO EXCESIVO',
    catClass: 'cat-excessive',
    badge: '🔴 EXCESIVO',
    power: 2000,
    room: 'Cocina',
    x: 700,
    y: 600,
    radius: 65,
    icon: 'assets/icon_stove.png',
    actionText: '⚡ APAGAR HORNALLA',
    tip: 'Tapa siempre las ollas para cocinar más rápido y aprovecha el calor residual apagando la hornalla 5 minutos antes.',
    state: 'on'
  },
  {
    id: 'microwave',
    name: 'Horno Microondas',
    category: 'CONSUMO ALTO',
    catClass: 'cat-high',
    badge: '🟠 ALTO',
    power: 1400,
    room: 'Cocina',
    x: 615,
    y: 540,
    radius: 60,
    icon: 'assets/icon_microwave.png',
    actionText: '⚡ DETENER MICROONDAS',
    tip: 'El microondas consume mucha potencia puntual (1.400W). Desenchúfalo si no lo usas para evitar consumo vampiro de su display.',
    state: 'on'
  },
  {
    id: 'washer',
    name: 'Lavarropas (Lavado Caliente)',
    category: 'CONSUMO ALTO',
    catClass: 'cat-high',
    badge: '🟠 ALTO',
    power: 1200,
    room: 'Lavadero',
    x: 165,
    y: 600,
    radius: 65,
    icon: 'assets/icon_washer.png',
    actionText: '⚡ APAGAR / CICLO FRÍO',
    tip: 'El 80% de la energía de lavarropas se usa en calentar el agua. Lavar con agua fría ahorra muchísima electricidad.',
    state: 'on'
  },
  {
    id: 'fridge',
    name: 'Refrigerador con Puerta Abierta',
    category: 'CONSUMO ALTO (DERROCHE)',
    catClass: 'cat-high',
    badge: '🟠 ALTO',
    power: 500,
    room: 'Cocina',
    x: 510,
    y: 580,
    radius: 65,
    icon: 'assets/icon_fridge.png',
    actionText: '🚪 CERRAR PUERTA HELADERA',
    tip: '¡Cierra la heladera! Al dejarla abierta, el compresor trabaja sin descanso tratando de enfriar toda la casa.',
    state: 'on'
  },
  {
    id: 'computer',
    name: 'Computadora Gamer Activa',
    category: 'CONSUMO MEDIO',
    catClass: 'cat-medium',
    badge: '🟡 MEDIO',
    power: 450,
    room: 'Dormitorio Superior',
    x: 380,
    y: 310,
    radius: 60,
    icon: 'assets/icon_dryer.png',
    actionText: '⚡ SUSPENDER / APAGAR PC',
    tip: 'Configura el modo suspensión automática cuando te alejes de la computadora por más de 10 minutos.',
    state: 'on'
  },
  {
    id: 'tv',
    name: 'Televisor y Consola en Standby',
    category: 'CONSUMO MEDIO',
    catClass: 'cat-medium',
    badge: '🟡 MEDIO',
    power: 250,
    room: 'Sala de Estar',
    x: 1065,
    y: 600,
    radius: 65,
    icon: 'assets/icon_bulb.png',
    actionText: '⚡ APAGAR TELEVISOR',
    tip: 'El consumo fantasma o aparatos dejados encendidos sin que nadie los mire representa hasta un 10% del gasto mensual.',
    state: 'on'
  },
  {
    id: 'living_lamp',
    name: 'Lámpara Antigua Encendida',
    category: 'CONSUMO MEDIO',
    catClass: 'cat-medium',
    badge: '🟡 MEDIO',
    power: 100,
    room: 'Sala de Estar',
    x: 1220,
    y: 600,
    radius: 55,
    icon: 'assets/icon_bulb.png',
    actionText: '⚡ APAGAR LÁMPARA',
    tip: 'Las bombillas incandescentes generan un 90% de calor inútil y solo 10% de luz. Reemplázalas por bombillas LED.',
    state: 'on'
  }
];

// --- JUEGO PRINCIPAL ---
class EnergyGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Dimensiones nativas de la ilustración 16:9
    this.W = 1376;
    this.H = 768;

    // Configuración de Niveles
    this.currentLevel = 'easy'; // 'easy' (60s) o 'hard' (30s)
    this.levelConfigs = {
      easy: {
        time: 60,
        reigniteMinSec: 14,
        reigniteMaxSec: 20,
        overloadRate: 0.5,
        scoreMult: 1,
        label: 'FÁCIL (1 min)'
      },
      hard: {
        time: 30,
        reigniteMinSec: 7,
        reigniteMaxSec: 12,
        overloadRate: 1.2,
        scoreMult: 2,
        label: 'DIFÍCIL (30 s)'
      }
    };

    // Estado del juego
    this.gameOver = false;
    this.gameWon = false;
    this.isPaused = false;
    this.timeLeft = this.levelConfigs.easy.time;
    this.timerInterval = null;
    this.reigniteTimer = 0;
    this.score = 0;
    this.energySavedWatts = 0;
    this.thermalOverload = 35;

    // Artefactos y proximidad
    this.appliances = JSON.parse(JSON.stringify(APPLIANCES_CONFIG));
    this.activeAppliance = null;
    this.proximityFrames = 0;
    this.selectedScannerApp = null;

    // Jugador (Niño Detective) - Calibrado perfectamente al suelo
    // Altura del personaje: 126px, Ancho: 84px
    // Suelo Planta Baja: Y=680 => player.y = 554
    // Suelo Planta Alta: Y=412 => player.y = 286
    this.player = {
      x: 750,
      y: 554,
      width: 84,
      height: 126,
      floor: 0, // 0 = planta baja, 1 = planta alta
      speed: 4.8,
      facing: 1,
      isMoving: false,
      walkFrame: 0
    };

    this.groundFloorY = 554;
    this.upperFloorY = 286;
    this.stairsXMin = 800;
    this.stairsXMax = 920;

    // Teclas presionadas
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    // Partículas y efectos visuales avanzados
    this.particles = [];
    this.electricArcs = [];
    this.toastTimer = null;
    this.lastAlarmTime = 0;
    this.screenShake = 0;
    this.radarWaveRadius = 0;

    // Carga de imágenes
    this.images = {};
    this.loadedImages = 0;
    this.totalImages = 0;

    this.init();
  }

  init() {
    this.loadAssets();
    this.bindEvents();
    this.setLevel('easy');
    this.showToast('¡Controla al Detective! Apaga los artefactos antes de que acabe el tiempo.');

    requestAnimationFrame(() => this.gameLoop());
  }

  loadAssets() {
    const assetsToLoad = {
      house: 'assets/house.jpg',
      kid: 'assets/kid_player.png',
      icon_heater: 'assets/icon_heater.png',
      icon_ac: 'assets/icon_ac.png',
      icon_fridge: 'assets/icon_fridge.png',
      icon_microwave: 'assets/icon_microwave.png',
      icon_iron: 'assets/icon_iron.png',
      icon_washer: 'assets/icon_washer.png',
      icon_stove: 'assets/icon_stove.png',
      icon_bulb: 'assets/icon_bulb.png'
    };

    this.totalImages = Object.keys(assetsToLoad).length;

    for (const [key, src] of Object.entries(assetsToLoad)) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.loadedImages++;
      };
      img.onerror = () => {
        console.warn('Error loading asset:', src);
      };
      this.images[key] = img;
    }
  }

  setLevel(levelKey) {
    this.currentLevel = levelKey;
    const cfg = this.levelConfigs[levelKey];
    this.timeLeft = cfg.time;
    this.reigniteTimer = Math.floor(Math.random() * (cfg.reigniteMaxSec - cfg.reigniteMinSec) + cfg.reigniteMinSec);

    // Actualizar botones de nivel en la UI
    document.getElementById('btn-lvl-easy').classList.toggle('active', levelKey === 'easy');
    document.getElementById('btn-lvl-hard').classList.toggle('active', levelKey === 'hard');
    
    const badge = document.getElementById('level-badge');
    badge.innerText = levelKey === 'easy' ? 'FÁCIL (1 min)' : 'DIFÍCIL (30 s)';
    badge.style.color = levelKey === 'easy' ? '#00e676' : '#ff1744';

    this.restartGame();
  }

  bindEvents() {
    // Teclado
    window.addEventListener('keydown', (e) => {
      audio.init();
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        this.keys.up = true;
        this.checkStairs(1);
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        this.keys.down = true;
        this.checkStairs(-1);
      }
      if (['Space', 'KeyE', 'Enter'].includes(e.code)) {
        e.preventDefault();
        this.triggerAction();
      }
      if (e.code === 'Escape') {
        this.closeModals();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = false;
    });

    // Clics directos en el Canvas
    this.canvas.addEventListener('click', (e) => {
      audio.init();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.W / rect.width;
      const scaleY = this.H / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      let clickedApp = null;
      for (const app of this.appliances) {
        const dist = Math.hypot(mouseX - app.x, mouseY - app.y);
        if (dist < app.radius + 30) {
          clickedApp = app;
          break;
        }
      }

      if (clickedApp) {
        this.openScanner(clickedApp);
      } else {
        const targetFloor = mouseY < 450 ? 1 : 0;
        if (this.player.floor === targetFloor) {
          this.player.targetX = mouseX;
        } else {
          this.player.targetX = 860;
        }
      }
    });

    // Selector de niveles
    document.getElementById('btn-lvl-easy').addEventListener('click', () => this.setLevel('easy'));
    document.getElementById('btn-lvl-hard').addEventListener('click', () => this.setLevel('hard'));

    // Botones de la UI
    document.getElementById('btn-sound').addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      document.getElementById('btn-sound').innerText = audio.enabled ? '🔊 ON' : '🔇 OFF';
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      this.restartGame();
    });

    document.getElementById('btn-guide').addEventListener('click', () => {
      this.isPaused = true;
      this.updateHUD();
      document.getElementById('guide-modal').classList.add('active');
    });

    document.getElementById('guide-close-btn').addEventListener('click', () => {
      this.isPaused = false;
      this.updateHUD();
      document.getElementById('guide-modal').classList.remove('active');
    });

    document.getElementById('guide-ok-btn').addEventListener('click', () => {
      this.isPaused = false;
      this.updateHUD();
      document.getElementById('guide-modal').classList.remove('active');
    });

    // Modal Escáner
    document.getElementById('scanner-close-btn').addEventListener('click', () => this.closeScanner());
    document.getElementById('scanner-cancel-btn').addEventListener('click', () => this.closeScanner());
    document.getElementById('scanner-action-btn').addEventListener('click', () => this.executeScannerAction());

    // Modales Fin
    document.getElementById('btn-win-replay').addEventListener('click', () => this.restartGame());
    document.getElementById('btn-win-next').addEventListener('click', () => this.setLevel('hard'));
    document.getElementById('btn-lose-retry').addEventListener('click', () => this.restartGame());

    // Controles táctiles
    this.bindTouchButton('btn-touch-left', () => this.keys.left = true, () => this.keys.left = false);
    this.bindTouchButton('btn-touch-right', () => this.keys.right = true, () => this.keys.right = false);
    this.bindTouchButton('btn-touch-up', () => this.checkStairs(1), () => {});
    this.bindTouchButton('btn-touch-down', () => this.checkStairs(-1), () => {});
    document.getElementById('btn-touch-action').addEventListener('click', () => this.triggerAction());
  }

  bindTouchButton(id, onStart, onEnd) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', (e) => { e.preventDefault(); onStart(); });
    el.addEventListener('touchend', (e) => { e.preventDefault(); onEnd(); });
    el.addEventListener('mousedown', onStart);
    el.addEventListener('mouseup', onEnd);
    el.addEventListener('mouseleave', onEnd);
  }

  checkStairs(direction) {
    const inStairs = this.player.x >= this.stairsXMin && this.player.x <= this.stairsXMax;
    if (inStairs) {
      if (direction === 1 && this.player.floor === 0) {
        this.player.floor = 1;
        this.player.y = this.upperFloorY;
        audio.playBeep(480, 0.1);
        this.showToast('▲ Subiste a la planta alta');
        this.createSparks(this.player.x, this.player.y + 60, '#00e5ff', 16);
      } else if (direction === -1 && this.player.floor === 1) {
        this.player.floor = 0;
        this.player.y = this.groundFloorY;
        audio.playBeep(360, 0.1);
        this.showToast('▼ Bajaste a la planta baja');
        this.createSparks(this.player.x, this.player.y + 60, '#00e5ff', 16);
      }
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.gameOver || this.gameWon || this.isPaused) return;

      this.timeLeft--;
      this.updateHUD();

      // Manejo de Re-encendido dinámico de artefactos
      this.handleReignition();

      // Sobrecarga térmica de la red
      const currentWatts = this.calculateTotalWatts();
      const cfg = this.levelConfigs[this.currentLevel];

      if (currentWatts > 4000) {
        this.thermalOverload = Math.min(100, this.thermalOverload + cfg.overloadRate);
        const now = Date.now();
        if (this.thermalOverload > 85 && now - this.lastAlarmTime > 3000) {
          audio.playAlarm();
          this.lastAlarmTime = now;
        }
      } else {
        this.thermalOverload = Math.max(10, this.thermalOverload - 2.0);
      }

      // Derrota por sobrecarga térmica
      if (this.thermalOverload >= 100) {
        this.loseGame('¡La llave térmica colapsó por exceso de consumo! La casa quedó a oscuras.');
      }

      // Derrota por tiempo agotado
      if (this.timeLeft <= 0) {
        this.loseGame('¡Se agotó el tiempo! La factura eléctrica llegó con un sobrecoste insostenible.');
      }

    }, 1000);
  }

  // --- MECÁNICA: LOS ARTEFACTOS PUEDEN VOLVER A ENCENDERSE ---
  handleReignition() {
    this.reigniteTimer--;
    if (this.reigniteTimer <= 0) {
      // Buscar artefactos que estén apagados
      const offAppliances = this.appliances.filter(a => a.state === 'off');

      if (offAppliances.length > 0) {
        // Elegir uno al azar para volver a encenderlo
        const randomIndex = Math.floor(Math.random() * offAppliances.length);
        const appToTurnOn = offAppliances[randomIndex];

        appToTurnOn.state = 'on';

        // Efectos: sonido brusco, sacudida de pantalla, chispas y alerta
        audio.playReignite();
        this.screenShake = 14;
        this.createSparks(appToTurnOn.x, appToTurnOn.y, '#ff1744', 35);
        this.createFloatingText(`⚠️ +${appToTurnOn.power} W`, appToTurnOn.x, appToTurnOn.y - 25, '#ff1744');

        this.showReigniteAlert(appToTurnOn.name);
      }

      // Reiniciar temporizador de re-encendido según la dificultad
      const cfg = this.levelConfigs[this.currentLevel];
      this.reigniteTimer = Math.floor(Math.random() * (cfg.reigniteMaxSec - cfg.reigniteMinSec) + cfg.reigniteMinSec);
    }
  }

  showReigniteAlert(appName) {
    const banner = document.getElementById('alert-banner');
    banner.innerText = `⚠️ ¡ALERTA! ¡Alguien volvió a encender: ${appName.toUpperCase()}!`;
    banner.classList.add('show');

    setTimeout(() => {
      banner.classList.remove('show');
    }, 3500);
  }

  calculateTotalWatts() {
    return this.appliances
      .filter(a => a.state === 'on')
      .reduce((sum, a) => sum + a.power, 0);
  }

  triggerAction() {
    if (this.activeAppliance) {
      this.openScanner(this.activeAppliance);
    } else {
      this.showToast('🔍 Acércate o haz clic sobre un artefacto para inspeccionarlo');
      audio.playBeep(280, 0.08);
    }
  }

  openScanner(appliance) {
    this.selectedScannerApp = appliance;
    this.isPaused = true;
    this.updateHUD();
    audio.playBeep(640, 0.1);

    document.getElementById('scanner-name').innerText = appliance.name.toUpperCase();
    document.getElementById('scanner-power').innerText = `${appliance.power.toLocaleString()} W`;
    document.getElementById('scanner-room').innerText = appliance.room;
    document.getElementById('scanner-tip').innerText = appliance.tip;
    document.getElementById('scanner-img').src = appliance.icon;

    const tagEl = document.getElementById('scanner-cat-tag');
    tagEl.className = `appliance-category-tag ${appliance.catClass}`;
    tagEl.innerText = appliance.badge;

    const actionBtn = document.getElementById('scanner-action-btn');
    if (appliance.state === 'on') {
      actionBtn.innerText = appliance.actionText;
      actionBtn.style.background = '#00e676';
      actionBtn.style.color = '#052e16';
    } else {
      actionBtn.innerText = '✅ YA ESTÁ APAGADO / EFICIENTE';
      actionBtn.style.background = '#374151';
      actionBtn.style.color = '#9ca3af';
    }

    document.getElementById('scanner-modal').classList.add('active');
  }

  closeScanner() {
    document.getElementById('scanner-modal').classList.remove('active');
    this.selectedScannerApp = null;
    this.isPaused = false;
    this.updateHUD();
  }

  closeModals() {
    document.getElementById('scanner-modal').classList.remove('active');
    document.getElementById('guide-modal').classList.remove('active');
    this.isPaused = false;
    this.updateHUD();
  }

  executeScannerAction() {
    if (!this.selectedScannerApp) return;

    if (this.selectedScannerApp.state === 'on') {
      this.selectedScannerApp.state = 'off';
      const points = 300 * this.levelConfigs[this.currentLevel].scoreMult;
      this.score += points;
      this.energySavedWatts += this.selectedScannerApp.power;

      audio.playPowerDown();
      this.createSparks(this.selectedScannerApp.x, this.selectedScannerApp.y, '#00e676', 35);
      this.createFloatingText(`-${this.selectedScannerApp.power} W`, this.selectedScannerApp.x, this.selectedScannerApp.y - 25, '#00e676');

      this.showToast(`¡Genial! Desactivaste: ${this.selectedScannerApp.name} (-${this.selectedScannerApp.power}W)`);
      this.closeScanner();

      this.checkWinCondition();
    } else {
      this.closeScanner();
    }
  }

  checkWinCondition() {
    const totalWatts = this.calculateTotalWatts();
    if (totalWatts <= 350 && !this.gameWon) {
      this.winGame();
    }
  }

  winGame() {
    this.gameWon = true;
    this.isPaused = false;
    audio.playWin();

    const totalWatts = this.calculateTotalWatts();
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;

    document.getElementById('final-level').innerText = this.levelConfigs[this.currentLevel].label;
    document.getElementById('final-watts').innerText = `${totalWatts} W`;
    document.getElementById('final-time').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} s`;
    document.getElementById('final-score').innerText = `${this.score} pts`;

    let rank = 'A - DETECTIVE DE PRIMERA';
    if (this.currentLevel === 'hard') {
      rank = 'S+ - LEYENDA DEL AHORRO ⭐⭐⭐⭐';
    } else if (this.timeLeft > 25) {
      rank = 'S - MAESTRO DE LA EFICIENCIA ⭐⭐⭐';
    }
    document.getElementById('final-rank').innerText = rank;

    setTimeout(() => {
      document.getElementById('win-modal').classList.add('active');
    }, 500);
  }

  loseGame(reason) {
    this.gameOver = true;
    this.isPaused = false;
    audio.playLose();
    document.getElementById('lose-reason').innerText = reason;
    document.getElementById('lose-modal').classList.add('active');
  }

  restartGame() {
    this.gameOver = false;
    this.gameWon = false;
    this.isPaused = false;
    this.timeLeft = this.levelConfigs[this.currentLevel].time;
    this.score = 0;
    this.energySavedWatts = 0;
    this.thermalOverload = 35;
    this.appliances = JSON.parse(JSON.stringify(APPLIANCES_CONFIG));
    this.player.x = 750;
    this.player.floor = 0;
    this.player.y = this.groundFloorY;
    this.particles = [];
    this.electricArcs = [];
    this.proximityFrames = 0;

    const cfg = this.levelConfigs[this.currentLevel];
    this.reigniteTimer = Math.floor(Math.random() * (cfg.reigniteMaxSec - cfg.reigniteMinSec) + cfg.reigniteMinSec);

    this.closeModals();
    document.getElementById('win-modal').classList.remove('active');
    document.getElementById('lose-modal').classList.remove('active');

    this.startTimer();
    this.updateHUD();
    this.showToast(`¡Partida iniciada en Modo ${this.levelConfigs[this.currentLevel].label}!`);
  }

  showToast(text) {
    const toast = document.getElementById('toast-message');
    toast.innerText = text;
    toast.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  updateHUD() {
    const totalWatts = this.calculateTotalWatts();
    const wattEl = document.getElementById('watt-meter');
    wattEl.innerText = `${totalWatts.toLocaleString()} W`;

    if (totalWatts > 5000) {
      wattEl.className = 'metric-value critical';
    } else if (totalWatts > 1500) {
      wattEl.className = 'metric-value warning';
    } else {
      wattEl.className = 'metric-value safe';
    }

    // Barra de sobrecarga térmica
    const barEl = document.getElementById('overload-bar');
    const textEl = document.getElementById('overload-text');
    barEl.style.width = `${Math.min(100, Math.max(5, this.thermalOverload))}%`;

    if (this.thermalOverload > 80) {
      textEl.innerText = '¡SOBRECALENTADA!';
      textEl.style.color = '#ff1744';
      barEl.className = 'progress-fill overheat';
    } else if (this.thermalOverload > 45) {
      textEl.innerText = 'TEMPERATURA MEDIA';
      textEl.style.color = '#ffea00';
      barEl.className = 'progress-fill';
    } else {
      textEl.innerText = 'ESTABLE / SEGURA';
      textEl.style.color = '#00e676';
      barEl.className = 'progress-fill';
    }

    // Reloj
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    document.getElementById('time-meter').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const pauseEl = document.getElementById('pause-indicator');
    const iconEl = document.getElementById('timer-status-icon');
    if (this.isPaused) {
      pauseEl.style.display = 'block';
      iconEl.innerText = '⏸️';
    } else {
      pauseEl.style.display = 'none';
      iconEl.innerText = '⏳';
    }

    // Puntos
    document.getElementById('score-meter').innerText = `${this.score} pts`;
  }

  // --- BUCLE PRINCIPAL ---
  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    if (this.gameOver || this.gameWon) return;

    // Reducir sacudida de pantalla
    if (this.screenShake > 0) this.screenShake *= 0.85;
    if (this.screenShake < 0.2) this.screenShake = 0;

    // Movimiento del detective
    let moving = false;
    let dx = 0;

    if (this.keys.left) {
      dx -= this.player.speed;
      this.player.facing = -1;
      moving = true;
    }
    if (this.keys.right) {
      dx += this.player.speed;
      this.player.facing = 1;
      moving = true;
    }

    // Clic para caminar hacia el objetivo
    if (this.player.targetX !== undefined) {
      const diff = this.player.targetX - this.player.x;
      if (Math.abs(diff) > 8) {
        dx = Math.sign(diff) * this.player.speed;
        this.player.facing = Math.sign(diff);
        moving = true;
      } else {
        this.player.targetX = undefined;
      }
    }

    this.player.x += dx;
    this.player.isMoving = moving;

    if (moving) {
      this.player.walkFrame += 0.22;
      if (Math.floor(this.player.walkFrame) % 5 === 0) {
        audio.playStep();
        // Polvo de pasos
        this.particles.push({
          x: this.player.x - (this.player.facing * 15),
          y: this.player.y + this.player.height - 5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 0.8 - 0.2,
          color: 'rgba(200, 200, 200, 0.4)',
          size: Math.random() * 3 + 2,
          alpha: 0.6,
          life: 18
        });
      }
    }

    // Límites de la casa
    const minX = 140;
    const maxX = 1260;
    this.player.x = Math.max(minX, Math.min(maxX, this.player.x));

    // Determinar Y según el piso para que los pies toquen firmemente el suelo
    this.player.y = (this.player.floor === 1) ? this.upperFloorY : this.groundFloorY;

    // Proximidad a artefactos
    let nearestApp = null;
    let closestDist = Infinity;

    for (const app of this.appliances) {
      const appFloor = app.y < 450 ? 1 : 0;
      if (appFloor === this.player.floor) {
        const dist = Math.hypot(this.player.x - app.x, (this.player.y + 60) - app.y);
        if (dist < app.radius + 50 && dist < closestDist) {
          closestDist = dist;
          nearestApp = app;
        }
      }
    }

    if (nearestApp) {
      if (this.activeAppliance === nearestApp) {
        this.proximityFrames++;
      } else {
        this.activeAppliance = nearestApp;
        this.proximityFrames = 0;
      }
    } else {
      this.activeAppliance = null;
      this.proximityFrames = 0;
    }

    // Radar del detective
    this.radarWaveRadius = (this.radarWaveRadius + 1.2) % 65;

    // Actualizar partículas y arcos eléctricos
    this.updateParticles();
    this.spawnApplianceEffects();
    this.updateElectricArcs();
  }

  // --- EFECTOS VISUALES: ARCOS ELÉCTRICOS DE SOBRECARGA ---
  updateElectricArcs() {
    const totalWatts = this.calculateTotalWatts();
    // Si la casa supera los 5000W, se forman arcos de chispas en la red eléctrica
    if (totalWatts > 5000 && Math.random() < 0.2) {
      const activeApps = this.appliances.filter(a => a.state === 'on');
      if (activeApps.length >= 2) {
        const a1 = activeApps[Math.floor(Math.random() * activeApps.length)];
        const a2 = activeApps[Math.floor(Math.random() * activeApps.length)];
        if (a1 !== a2 && Math.abs(a1.y - a2.y) < 150) {
          this.electricArcs.push({
            x1: a1.x,
            y1: a1.y - 30,
            x2: a2.x,
            y2: a2.y - 30,
            life: 6
          });
        }
      }
    }

    for (let i = this.electricArcs.length - 1; i >= 0; i--) {
      this.electricArcs[i].life--;
      if (this.electricArcs[i].life <= 0) {
        this.electricArcs.splice(i, 1);
      }
    }
  }

  spawnApplianceEffects() {
    if (Math.random() < 0.45) {
      for (const app of this.appliances) {
        if (app.state !== 'on') continue;

        if (app.id === 'heater') {
          // Estufa: ascuas ardientes al rojo vivo
          this.particles.push({
            x: app.x + (Math.random() * 60 - 30),
            y: app.y + 10,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 2.5 - 1.0,
            color: Math.random() > 0.3 ? '#ff1744' : '#ffea00',
            size: Math.random() * 5 + 2,
            alpha: 1,
            life: 30
          });
        } else if (app.id === 'ac') {
          // Aire acondicionado: ráfagas frías y nieve
          this.particles.push({
            x: app.x - 20,
            y: app.y + (Math.random() * 40 - 20),
            vx: -Math.random() * 4.0 - 1.8,
            vy: (Math.random() - 0.5) * 1.2,
            color: '#e0f2fe',
            size: Math.random() * 4 + 2,
            alpha: 0.9,
            life: 25
          });
        } else if (app.id === 'iron') {
          // Plancha: volutas de vapor blanco
          this.particles.push({
            x: app.x + (Math.random() * 20 - 10),
            y: app.y - 10,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 2.0 - 0.6,
            color: 'rgba(255, 255, 255, 0.75)',
            size: Math.random() * 7 + 4,
            alpha: 0.85,
            life: 35
          });
        } else if (app.id === 'fridge') {
          // Heladera: niebla gélida cayendo
          this.particles.push({
            x: app.x + (Math.random() * 40 - 20),
            y: app.y + 20,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 1.5 + 0.6,
            color: 'rgba(186, 230, 253, 0.65)',
            size: Math.random() * 6 + 3,
            alpha: 0.75,
            life: 32
          });
        } else if (app.id === 'stove') {
          // Anafe: llamas/chispas naranjas
          this.particles.push({
            x: app.x + (Math.random() * 30 - 15),
            y: app.y - 10,
            vx: (Math.random() - 0.5) * 1.0,
            vy: -Math.random() * 1.8 - 0.5,
            color: '#ff9100',
            size: Math.random() * 4 + 2,
            alpha: 0.9,
            life: 25
          });
        }
      }
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 1 / p.life;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  createSparks(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        size: Math.random() * 5 + 2,
        alpha: 1,
        life: Math.floor(Math.random() * 25 + 20)
      });
    }
  }

  createFloatingText(text, x, y, color) {
    this.particles.push({
      text: text,
      x: x,
      y: y,
      vx: 0,
      vy: -1.3,
      color: color,
      alpha: 1,
      life: 45,
      isText: true
    });
  }

  render() {
    this.ctx.save();

    // Sacudida de pantalla si hubo un evento o re-encendido
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(sx, sy);
    }

    this.ctx.clearRect(0, 0, this.W, this.H);

    // 1. Fondo limpio de la casa
    if (this.images.house && this.images.house.complete) {
      this.ctx.drawImage(this.images.house, 0, 0, this.W, this.H);
    } else {
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(0, 0, this.W, this.H);
    }

    // 2. Arcos eléctricos de alta tensión en el techo/paredes
    this.renderElectricArcs();

    // 3. Indicadores de artefactos
    this.renderAppliances();

    // 4. Escaleras
    this.renderStairsIndicator();

    // 5. Partículas ambientales
    this.renderParticles();

    // 6. Personaje Principal (El Niño Detective)
    this.renderPlayer();

    // 7. Cartel de interacción
    this.renderInteractionPrompt();

    this.ctx.restore();
  }

  renderElectricArcs() {
    if (this.electricArcs.length === 0) return;
    this.ctx.save();
    this.ctx.strokeStyle = '#00e5ff';
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = '#00e5ff';
    this.ctx.shadowBlur = 10;

    for (const arc of this.electricArcs) {
      this.ctx.beginPath();
      this.ctx.moveTo(arc.x1, arc.y1);
      // Puntos intermedios quebrados para simular rayo eléctrico
      const midX = (arc.x1 + arc.x2) / 2 + (Math.random() - 0.5) * 30;
      const midY = (arc.y1 + arc.y2) / 2 + (Math.random() - 0.5) * 30;
      this.ctx.lineTo(midX, midY);
      this.ctx.lineTo(arc.x2, arc.y2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderAppliances() {
    const time = Date.now() * 0.005;

    for (const app of this.appliances) {
      if (app.state === 'on') {
        const pulse = Math.sin(time + app.x) * 0.35 + 0.65;
        const color = app.category.includes('EXCESIVO') ? 'rgba(255, 23, 68,' : 'rgba(255, 145, 0,';

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(app.x, app.y, app.radius * 0.85, 0, Math.PI * 2);
        this.ctx.fillStyle = `${color} ${0.14 * pulse})`;
        this.ctx.fill();

        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = `${color} ${0.75 * pulse})`;
        this.ctx.setLineDash([6, 4]);
        this.ctx.stroke();
        this.ctx.restore();

        // Etiqueta flotante de Vatios
        this.ctx.save();
        this.ctx.font = 'bold 12px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = app.category.includes('EXCESIVO') ? '#ff1744' : '#ffea00';
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(`⚡ ${app.power}W`, app.x, app.y - app.radius + 6);
        this.ctx.restore();
      } else {
        // Indicador verde de ahorro
        this.ctx.save();
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#00e676';
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 3;
        this.ctx.fillText('✓ 0W (APAGADO)', app.x, app.y - app.radius + 6);
        this.ctx.restore();
      }
    }
  }

  renderStairsIndicator() {
    const inStairs = this.player.x >= this.stairsXMin && this.player.x <= this.stairsXMax;
    if (inStairs) {
      this.ctx.save();
      this.ctx.font = '11px "Press Start 2P", monospace';
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#000';
      this.ctx.shadowBlur = 6;

      const label = this.player.floor === 0 ? '▲ W / ARRIBA PARA SUBIR' : '▼ S / ABAJO PARA BAJAR';
      this.ctx.fillText(label, 860, this.player.y - 25);
      this.ctx.restore();
    }
  }

  // --- RENDER DEL PERSONAJE PRINCIPAL CON MÁXIMA CLARIDAD Y EFECTOS ---
  renderPlayer() {
    this.ctx.save();

    const feetY = this.player.y + this.player.height;

    // 1. Sombra e iluminación suave en el suelo
    this.ctx.beginPath();
    this.ctx.ellipse(this.player.x, feetY - 4, 32, 9, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    this.ctx.fill();

    // 2. Ondas de radar de energía emitidas por el detector del niño
    this.ctx.beginPath();
    this.ctx.arc(this.player.x + (this.player.facing * 18), this.player.y + 55, this.radarWaveRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = `rgba(0, 229, 255, ${1 - this.radarWaveRadius / 65})`;
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // 3. Dibujo del Niño Detective
    const bob = this.player.isMoving ? Math.sin(this.player.walkFrame) * 3 : 0;
    const angle = this.player.isMoving ? Math.sin(this.player.walkFrame) * 0.06 : 0;

    this.ctx.translate(this.player.x, this.player.y + bob + (this.player.height / 2));
    this.ctx.rotate(angle);
    this.ctx.scale(this.player.facing, 1);

    if (this.images.kid && this.images.kid.complete && this.images.kid.naturalWidth > 0) {
      this.ctx.drawImage(
        this.images.kid,
        -this.player.width / 2,
        -this.player.height / 2,
        this.player.width,
        this.player.height
      );
    } else {
      // Fallback estilizado si la imagen estuviera cargando
      this.ctx.fillStyle = '#00e5ff';
      this.ctx.fillRect(-25, -50, 50, 100);
      this.ctx.fillStyle = '#ffe082';
      this.ctx.fillRect(-20, -75, 40, 30);
    }

    this.ctx.restore();

    // 4. Marcador distintivo sobre la cabeza del Detective para localizarlo instantáneamente
    this.ctx.save();
    const arrowBounce = Math.sin(Date.now() * 0.008) * 3;
    const markerY = this.player.y - 12 + arrowBounce;

    // Etiqueta "DETECTIVE"
    this.ctx.font = 'bold 9px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#00e5ff';
    this.ctx.shadowColor = '#000';
    this.ctx.shadowBlur = 4;
    this.ctx.fillText('DETECTIVE', this.player.x, markerY - 8);

    // Flechita hacia abajo
    this.ctx.fillStyle = '#ffea00';
    this.ctx.fillText('▼', this.player.x, markerY);
    this.ctx.restore();
  }

  renderInteractionPrompt() {
    if (!this.activeAppliance) return;

    if (this.proximityFrames < 20) {
      this.ctx.save();
      const bounce = Math.sin(Date.now() * 0.008) * 4;
      this.ctx.font = '20px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#00e5ff';
      this.ctx.shadowBlur = 8;
      this.ctx.fillText('🔍', this.activeAppliance.x, this.activeAppliance.y - this.activeAppliance.radius - 12 + bounce);
      this.ctx.restore();
      return;
    }

    this.ctx.save();
    const promptY = this.player.y - 28;
    this.ctx.font = '11px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';

    const text = this.activeAppliance.state === 'on' 
      ? `[ESPACIO / CLIC] APAGAR: ${this.activeAppliance.name.toUpperCase()}`
      : `[ESPACIO / CLIC] DETALLES: ${this.activeAppliance.name.toUpperCase()}`;

    const textWidth = this.ctx.measureText(text).width;

    this.ctx.fillStyle = 'rgba(8, 14, 24, 0.9)';
    this.ctx.strokeStyle = '#00e5ff';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(this.player.x - textWidth / 2 - 12, promptY - 18, textWidth + 24, 28);
    this.ctx.strokeRect(this.player.x - textWidth / 2 - 12, promptY - 18, textWidth + 24, 28);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = '#00e5ff';
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(text, this.player.x, promptY);
    this.ctx.restore();
  }

  renderParticles() {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.isText) {
        this.ctx.font = 'bold 15px "Press Start 2P", monospace';
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(p.text, p.x, p.y);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}

// Iniciar cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  window.game = new EnergyGame();
});
