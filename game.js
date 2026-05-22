const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const breadButton = document.querySelector("#breadButton");
const fireButton = document.querySelector("#fireButton");
const timerButton = document.querySelector("#timerButton");
const tapEffectsLayer = document.querySelector("#tapEffects");
const gameOverlay = document.querySelector("#gameOverlay");
const overlaySummary = document.querySelector("#overlaySummary");
const overlayStats = document.querySelector("#overlayStats");
const playerNameInput = document.querySelector("#playerName");
const startGameButton = document.querySelector("#startGameButton");
const helpButton = document.querySelector("#helpButton");
const helpPanel = document.querySelector("#helpPanel");
const saveScoreButton = document.querySelector("#saveScoreButton");
const rankingList = document.querySelector("#rankingList");
const rankingButton = document.querySelector("#rankingButton");
const rankingPanel = document.querySelector("#rankingPanel");
const closeRankingButton = document.querySelector("#closeRankingButton");
const rankingAllList = document.querySelector("#rankingAllList");
const topRankingBlock = document.querySelector("#topRankingBlock");
const characterStatus = document.querySelector("#characterStatus");
const characterX = document.querySelector("#characterX");
const characterY = document.querySelector("#characterY");
const characterScale = document.querySelector("#characterScale");
const removeBlack = document.querySelector("#removeBlack");
const tableFrontY = document.querySelector("#tableFrontY");
const panCenterXInput = document.querySelector("#panCenterX");
const panCenterYInput = document.querySelector("#panCenterY");
const breadWidthInput = document.querySelector("#breadWidth");
const showPanInput = document.querySelector("#showPan");
const comparePansInput = document.querySelector("#comparePans");
const panWidthInput = document.querySelector("#panWidth");
const panBottomYInput = document.querySelector("#panBottomY");
const meterXInput = document.querySelector("#meterX");
const meterYInput = document.querySelector("#meterY");
const meterWidthInput = document.querySelector("#meterWidth");
const messageYInput = document.querySelector("#messageY");
const bubbleXInput = document.querySelector("#bubbleX");
const bubbleYInput = document.querySelector("#bubbleY");
const bubbleWidthInput = document.querySelector("#bubbleWidth");
const bubbleTailXInput = document.querySelector("#bubbleTailX");
const bubbleTailYInput = document.querySelector("#bubbleTailY");
const hinattaBubbleXInput = document.querySelector("#hinattaBubbleX");
const hinattaBubbleYInput = document.querySelector("#hinattaBubbleY");
const hinattaBubbleWidthInput = document.querySelector("#hinattaBubbleWidth");
const copyLayoutButton = document.querySelector("#copyLayoutButton");
const panOffsetInputs = [0, 1, 2, 3, 4].map((index) => ({
  x: document.querySelector(`#panOffsetX${index}`),
  y: document.querySelector(`#panOffsetY${index}`),
  visible: document.querySelector(`#showPan${index}`),
}));

const fireSprites = [
  "assets/stove_pan_fire_00_off.png?v=3",
  "assets/stove_pan_fire_01_low.png?v=3",
  "assets/stove_pan_fire_02_medium.png?v=3",
  "assets/stove_pan_fire_03_high.png?v=3",
  "assets/stove_pan_fire_04_danger.png?v=3",
];

const characterSprites = {
  normal: "assets/characters/normal.png",
  cry: "assets/characters/cry.png",
  panic: "assets/characters/panic.png",
  happy: "assets/characters/happy.png",
  angry: "assets/characters/angry.png",
  good: "assets/characters/good.png",
  hinatta: "assets/characters/hinatta.png",
};

const uiSprites = {
  firePowerMeter: "assets/ui/fire_power_meter_fan_no_needle.png?v=5",
  hinattaBubble: "assets/ui/hinatta_bubble.png?v=1",
  messageFrame: "assets/ui/message_frame_talk.png?v=2",
  breadRaw: "assets/ui/bread_raw.png?v=4",
  breadTargetFrame: "assets/ui/bread_target_frame.png?v=1",
  breadLight: "assets/ui/bread_light.png?v=4",
  breadToasted: "assets/ui/bread_toasted.png?v=4",
  breadBurnt: "assets/ui/bread_burnt.png?v=6",
};

const audioSources = {
  bgm: "assets/audio/bgm_cute_kitchen_loop.wav",
  placeBread: "assets/audio/place_bread.wav",
  fireIgnite: "assets/audio/fire_ignite.wav",
  timerStart: "assets/audio/timer_start.wav",
  timerEnd: "assets/audio/timer_end.wav",
  voiceYaku: ["assets/audio/voice_yaku.mp3", "assets/audio/voice_yaku.m4a", "assets/audio/voice_yaku.ogg"],
  voiceHinatta: ["assets/audio/voice_hinatta.mp3", "assets/audio/voice_hinatta.m4a", "assets/audio/voice_hinatta.ogg"],
  voiceSuccess: ["assets/audio/voice_success.mp3", "assets/audio/voice_success.m4a", "assets/audio/voice_success.ogg"],
  voiceFire: ["assets/audio/voice_fire.mp3", "assets/audio/voice_fire.m4a", "assets/audio/voice_fire.ogg"],
  voiceTimer: ["assets/audio/voice_timer.mp3", "assets/audio/voice_timer.m4a", "assets/audio/voice_timer.ogg"],
  voicePlace: ["assets/audio/voice_place.mp3", "assets/audio/voice_place.m4a", "assets/audio/voice_place.ogg"],
};

const initialPanCenter = { x: 540, y: 1085 };
const fireZoneStops = [
  { from: 0, to: 0.38, stage: 4, color: "#f22d3d" },
  { from: 0.38, to: 0.47, stage: 1, color: "#1c9bf0" },
  { from: 0.47, to: 0.53, stage: 2, color: "#3dcc63" },
  { from: 0.53, to: 0.62, stage: 3, color: "#ff9e1b" },
  { from: 0.62, to: 1, stage: 4, color: "#f22d3d" },
];
const breadPlacement = {
  idle: "idle",
  aimingX: "aimingX",
  aimingY: "aimingY",
  placed: "placed",
};

const fireAiming = {
  idle: "idle",
  aiming: "aiming",
  locked: "locked",
};

const toastJudge = {
  pale: 34,
  goodMin: 62,
  goodMax: 74,
  burnt: 88,
};

const challengeSeconds = 45;
const rankingStorageKey = "toastGameRankings";
const rankingConfig = {
  supabaseUrl: "https://lrifberimtqrzkbioxzu.supabase.co",
  supabaseAnonKey: "sb_publishable_iFLP9EMbLR2NVKSZMHVqTg__sc3IKVs",
  tableName: "toast_rankings",
  limit: 100,
};
const gameModes = {
  idle: "idle",
  playing: "playing",
  ended: "ended",
};

const fireCookProfiles = [
  { rate: 0, curve: 1.8, afterheat: 0, smokeLag: 999, name: "off" },
  { rate: 10, curve: 1.28, afterheat: 0.22, smokeLag: 48, name: "low" },
  { rate: 20, curve: 2.15, afterheat: 0.30, smokeLag: 36, name: "medium" },
  { rate: 38, curve: 2.9, afterheat: 0.42, smokeLag: 46, name: "high" },
  { rate: 62, curve: 3.6, afterheat: 0.54, smokeLag: 58, name: "danger" },
];

const fireRiskProfiles = [
  { multiplier: 0, goodMin: 52, goodMax: 90, burnAt: 104, label: "消火" },
  { multiplier: 0.85, goodMin: 46, goodMax: 100, burnAt: 118, label: "弱火" },
  { multiplier: 1.2, goodMin: 50, goodMax: 98, burnAt: 114, label: "中火" },
  { multiplier: 1.5, goodMin: 54, goodMax: 92, burnAt: 106, label: "強火" },
  { multiplier: 2.0, goodMin: 56, goodMax: 86, burnAt: 98, label: "危険" },
];

const state = {
  images: {},
  mode: gameModes.idle,
  timeRemaining: challengeSeconds,
  hasBread: false,
  placementStep: breadPlacement.aimingX,
  breadX: initialPanCenter.x,
  breadY: initialPanCenter.y,
  lockedBreadX: initialPanCenter.x,
  breadAccuracy: 0,
  fireAimState: fireAiming.idle,
  firePower: 0,
  fireAccuracy: 0,
  fireStage: 0,
  score: 0,
  combo: 0,
  bestCombo: 0,
  breadsFinished: 0,
  goodToasts: 0,
  hinattaToasts: 0,
  undercookedToasts: 0,
  overcookedToasts: 0,
  breadMovePattern: 0,
  breadMoveSpeed: 1,
  breadMovePhase: 0,
  fireMeterSpeed: 1,
  fireMeterPhase: 0,
  message: "パンを置いてね",
  messageTimer: 0,
  hinattaShakeTimer: 0,
  timeSeconds: 0,
  lastTimeSeconds: 0,
  toast: 0,
  isCooking: false,
  isStoppingCook: false,
  stopDelayRemaining: 0,
  toastFinished: false,
  smokeTimer: 0,
  smokeParticles: [],
  scorePopups: [],
  tapStars: [],
  activeExpression: "normal",
  audioUnlocked: false,
  characterSources: {
    normal: null,
    cry: null,
    panic: null,
    happy: null,
    angry: null,
    good: null,
    hinatta: null,
  },
  characters: {
    normal: null,
    cry: null,
    panic: null,
    happy: null,
    angry: null,
    good: null,
    hinatta: null,
  },
  audio: {},
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function setupAudio() {
  const volumes = {
    bgm: 0.24,
    placeBread: 0.68,
    fireIgnite: 0.62,
    timerStart: 0.58,
    timerEnd: 0.66,
    voiceYaku: 0.82,
    voiceHinatta: 0.9,
    voiceSuccess: 0.9,
    voiceFire: 0.86,
    voiceTimer: 0.86,
    voicePlace: 0.86,
  };

  for (const [name, src] of Object.entries(audioSources)) {
    const sound = createAudioElement(src);
    sound.preload = "auto";
    sound.setAttribute("playsinline", "");
    sound.volume = volumes[name] ?? 0.6;
    if (name === "bgm") {
      sound.loop = true;
    }
    state.audio[name] = sound;
  }
}

function createAudioElement(src) {
  if (!Array.isArray(src)) {
    return new Audio(src);
  }

  const sound = new Audio();
  for (const candidate of src) {
    const source = document.createElement("source");
    source.src = candidate;
    source.type = getAudioMimeType(candidate);
    sound.appendChild(source);
  }
  sound.load();
  return sound;
}

function getAudioMimeType(src) {
  if (src.endsWith(".mp3")) {
    return "audio/mpeg";
  }
  if (src.endsWith(".m4a")) {
    return "audio/mp4";
  }
  if (src.endsWith(".ogg")) {
    return "audio/ogg";
  }
  if (src.endsWith(".wav")) {
    return "audio/wav";
  }
  return "";
}

function unlockAudio() {
  if (state.audioUnlocked) {
    return;
  }

  state.audioUnlocked = true;
  for (const sound of Object.values(state.audio)) {
    const originalVolume = sound.volume;
    sound.muted = true;
    sound.volume = 0;
    sound.play()
      .then(() => {
        sound.pause();
        sound.currentTime = 0;
        sound.muted = false;
        sound.volume = originalVolume;
      })
      .catch(() => {
        sound.muted = false;
        sound.volume = originalVolume;
      });
  }
}

function playSound(name) {
  const source = state.audio[name];
  if (!source) {
    return;
  }

  source.pause();
  source.currentTime = 0;
  source.play().catch(() => {});
}

function playVoice(name) {
  if (name !== "voiceHinatta" && state.message === "HINATTA") {
    return;
  }
  playSound(name);
}

function startBgm() {
  const bgm = state.audio.bgm;
  if (!bgm) {
    return;
  }

  bgm.currentTime = 0;
  bgm.play().catch(() => {});
}

function stopBgm() {
  const bgm = state.audio.bgm;
  if (!bgm) {
    return;
  }

  bgm.pause();
  bgm.currentTime = 0;
}

function controlValue(input) {
  return Number(input.value);
}

function getPanCenter() {
  return {
    x: controlValue(panCenterXInput),
    y: controlValue(panCenterYInput),
  };
}

function updateControlOutputs() {
  for (const input of document.querySelectorAll(".character-panel input[type='range']")) {
    const output = input.parentElement.querySelector("output");
    if (output != null) {
      output.textContent = input.value;
    }
  }
}

function getLayoutValues() {
  const panOffsets = panOffsetInputs.map((input) => ({
    x: controlValue(input.x),
    y: controlValue(input.y),
  }));

  return {
    characterX: controlValue(characterX),
    characterY: controlValue(characterY),
    characterScale: controlValue(characterScale),
    tableFrontY: controlValue(tableFrontY),
    panCenterX: controlValue(panCenterXInput),
    panCenterY: controlValue(panCenterYInput),
    breadWidth: controlValue(breadWidthInput),
    panWidth: controlValue(panWidthInput),
    panBottomY: controlValue(panBottomYInput),
    panOffsets,
    meterX: controlValue(meterXInput),
    meterY: controlValue(meterYInput),
    meterWidth: controlValue(meterWidthInput),
    messageY: controlValue(messageYInput),
    bubbleX: controlValue(bubbleXInput),
    bubbleY: controlValue(bubbleYInput),
    bubbleWidth: controlValue(bubbleWidthInput),
    bubbleTailX: controlValue(bubbleTailXInput),
    bubbleTailY: controlValue(bubbleTailYInput),
    hinattaBubbleX: controlValue(hinattaBubbleXInput),
    hinattaBubbleY: controlValue(hinattaBubbleYInput),
    hinattaBubbleWidth: controlValue(hinattaBubbleWidthInput),
  };
}

function copyLayoutValues() {
  const text = JSON.stringify(getLayoutValues(), null, 2);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  console.log(text);
  setMessage("数値をコピーしたよ");
}

async function boot() {
  setupAudio();
  state.images.background = await loadImage("assets/kitchen_table_stage.png");
  state.images.fire = await Promise.all(fireSprites.map(loadImage));
  state.images.firePowerMeter = await loadImage(uiSprites.firePowerMeter);
  state.images.hinattaBubble = await loadImage(uiSprites.hinattaBubble);
  state.images.messageFrame = await loadImage(uiSprites.messageFrame);
  state.images.breadRaw = await loadImage(uiSprites.breadRaw);
  state.images.breadTargetFrame = await loadImage(uiSprites.breadTargetFrame);
  state.images.breadLight = await loadImage(uiSprites.breadLight);
  state.images.breadToasted = await loadImage(uiSprites.breadToasted);
  state.images.breadBurnt = await loadImage(uiSprites.breadBurnt);
  await loadCharacters();
  updateControlOutputs();
  renderRankingList();
  showStartOverlay();
  updateActionButtons();
  requestAnimationFrame(loop);
}

async function loadCharacters() {
  let loaded = 0;
  for (const [expression, src] of Object.entries(characterSprites)) {
    try {
      const image = await loadImage(src);
      state.characterSources[expression] = image;
      state.characters[expression] = image;
      loaded++;
    } catch {
      state.characterSources[expression] = null;
      state.characters[expression] = null;
    }
  }

  if (characterStatus != null) {
    characterStatus.textContent = loaded > 0 ? "キャラ " + loaded + "/4 読込済" : "キャラ未配置";
  }
}

function loop(time) {
  const nextTimeSeconds = time * 0.001;
  const deltaTime = state.lastTimeSeconds === 0 ? 0 : Math.min(0.05, nextTimeSeconds - state.lastTimeSeconds);
  state.timeSeconds = nextTimeSeconds;
  state.lastTimeSeconds = nextTimeSeconds;
  if (state.messageTimer > 0) {
    state.messageTimer -= deltaTime;
  }
  if (state.hinattaShakeTimer > 0) {
    state.hinattaShakeTimer = Math.max(0, state.hinattaShakeTimer - deltaTime);
  }
  updateChallengeTimer(deltaTime);
  updateCooking(deltaTime);
  updateFireLockedEffects(deltaTime);
  updateSmoke(deltaTime);
  updateScorePopups(deltaTime);
  updateTapStars(deltaTime);
  updateActionButtons();
  draw();
  requestAnimationFrame(loop);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCover(state.images.background, 0, 0, canvas.width, canvas.height);
  drawHud();
  drawCharacter();
  drawForegroundTable();
  drawPan();
  drawPlacementGuide();
  drawToast();
  drawToastStatus();
  drawSmoke();
  drawFireMeter();
  drawScorePopups();
  drawTapStars();
  drawMessage();
}

function drawCover(image, x, y, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawHud() {
  roundedRect(292, 38, 496, 88, 42, "#fff4db", "#7f4327", 7);
  ctx.fillStyle = "#5a2c1d";
  ctx.font = "700 54px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(state.score).padStart(5, "0"), 540, 98);

  roundedRect(36, 38, 196, 76, 34, "#fff4db", "#7f4327", 6);
  ctx.fillStyle = state.timeRemaining <= 5 && state.mode === gameModes.playing ? "#f25161" : "#5a2c1d";
  ctx.font = "900 42px system-ui, sans-serif";
  ctx.fillText(String(Math.ceil(state.timeRemaining)) + "s", 134, 90);

  roundedRect(820, 40, 220, 70, 30, "rgba(255, 244, 219, 0.88)", "#f25161", 5);
  ctx.fillStyle = "#ff2f67";
  ctx.strokeStyle = "#fff5d4";
  ctx.lineWidth = 6;
  ctx.font = "900 34px system-ui, sans-serif";
  ctx.strokeText(`${state.combo} COMBO`, 930, 88);
  ctx.fillText(`${state.combo} COMBO`, 930, 88);

  roundedRect(332, 142, 416, 42, 22, "#242026", "#fff4d4", 6);
  const ratio = Math.min(1, state.toast / 100);
  const grad = ctx.createLinearGradient(344, 0, 732, 0);
  grad.addColorStop(0, "#47e7a0");
  grad.addColorStop(0.62, "#ffe86f");
  grad.addColorStop(1, "#f23545");
  roundedRect(346, 153, 388 * ratio, 20, 10, grad, null, 0);
}

function spawnScorePopup(text, x, y, color = "#ffed86") {
  state.scorePopups.push({
    text,
    x,
    y,
    age: 0,
    duration: 1.25,
    color,
  });
}

function getPlacementRank(accuracy) {
  if (accuracy >= 0.92) {
    return { label: "PERFECT", color: "#8affbd", points: 180, multiplier: 1.8 };
  }
  if (accuracy >= 0.76) {
    return { label: "GREAT", color: "#ffed86", points: 130, multiplier: 1.45 };
  }
  if (accuracy >= 0.52) {
    return { label: "GOOD", color: "#ffd4a3", points: 80, multiplier: 1.15 };
  }
  return { label: "BAD", color: "#ff9aa8", points: 25, multiplier: 1 };
}

function getFireRank(stage) {
  if (stage === 2) {
    return { label: "PERFECT", color: "#8affbd", points: 60, multiplier: 1.8 };
  }
  if (stage === 3) {
    return { label: "GREAT", color: "#ffed86", points: 35, multiplier: 1.45 };
  }
  if (stage === 1) {
    return { label: "GOOD", color: "#ffd4a3", points: 18, multiplier: 1.15 };
  }
  return { label: "BAD", color: "#ff9aa8", points: 0, multiplier: 1 };
}

function getCookRank(visibleToast, range) {
  if (visibleToast >= range.burnAt || visibleToast > range.goodMax) {
    return { label: "BAD", color: "#ff9aa8", points: 0, multiplier: 1 };
  }
  if (visibleToast < range.goodMin) {
    return { label: "BAD", color: "#ff9aa8", points: 10, multiplier: 1 };
  }

  const center = (range.goodMin + range.goodMax) / 2;
  const half = (range.goodMax - range.goodMin) / 2;
  const closeness = 1 - Math.min(1, Math.abs(visibleToast - center) / Math.max(1, half));
  if (closeness >= 0.78) {
    return { label: "PERFECT", color: "#8affbd", points: 150, multiplier: 1.8 };
  }
  if (closeness >= 0.45) {
    return { label: "GREAT", color: "#ffed86", points: 115, multiplier: 1.45 };
  }
  return { label: "GOOD", color: "#ffd4a3", points: 80, multiplier: 1.15 };
}

function applyRankCombo(rank) {
  if (rank.label === "BAD") {
    state.combo = 0;
    return 1;
  }

  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  return rank.multiplier * (1 + Math.min(30, state.combo) * 0.03);
}

function updateScorePopups(deltaTime) {
  for (const popup of state.scorePopups) {
    popup.age += deltaTime;
    popup.y -= deltaTime * 72;
  }

  state.scorePopups = state.scorePopups.filter((popup) => popup.age < popup.duration);
}

function drawScorePopups() {
  ctx.save();
  ctx.textAlign = "center";
  for (const popup of state.scorePopups) {
    const progress = popup.age / popup.duration;
    const alpha = Math.max(0, 1 - progress);
    const scale = 1 + Math.sin(Math.min(1, progress * 2) * Math.PI) * 0.12;
    ctx.globalAlpha = alpha;
    ctx.translate(popup.x, popup.y);
    ctx.scale(scale, scale);
    ctx.font = "900 44px system-ui, sans-serif";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(122, 54, 32, 0.86)";
    ctx.fillStyle = popup.color;
    ctx.strokeText(popup.text, 0, 0);
    ctx.fillText(popup.text, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.restore();
}

function spawnTapStars(button) {
  if (!tapEffectsLayer) {
    return;
  }

  const layerRect = tapEffectsLayer.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const x = buttonRect.left + buttonRect.width / 2 - layerRect.left;
  const y = buttonRect.top + buttonRect.height / 2 - layerRect.top;
  for (let i = 0; i < 14; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 42 + Math.random() * 82;
    const star = document.createElement("span");
    star.className = "tap-star";
    star.style.setProperty("--x", `${x + (Math.random() - 0.5) * buttonRect.width * 0.18}px`);
    star.style.setProperty("--y", `${y + (Math.random() - 0.5) * buttonRect.height * 0.18}px`);
    star.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    star.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    star.style.setProperty("--size", `${14 + Math.random() * 16}px`);
    star.style.setProperty("--rot", `${Math.random() * 180}deg`);
    tapEffectsLayer.appendChild(star);
    star.addEventListener("animationend", () => star.remove(), { once: true });
  }
}

function updateTapStars(deltaTime) {
  for (const star of state.tapStars) {
    star.age += deltaTime;
    star.x += star.vx * deltaTime;
    star.y += star.vy * deltaTime;
    star.vy += 190 * deltaTime;
    star.rotation += star.spin * deltaTime;
  }

  state.tapStars = state.tapStars.filter((star) => star.age < star.duration);
}

function drawTapStars() {
  if (state.tapStars.length === 0) {
    return;
  }

  ctx.save();
  for (const star of state.tapStars) {
    const progress = star.age / star.duration;
    ctx.globalAlpha = Math.max(0, 1 - progress);
    drawStar(star.x, star.y, star.size * (1 - progress * 0.18), star.rotation);
  }
  ctx.restore();
}

function drawStar(x, y, radius, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? radius : radius * 0.42;
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "#ffe86f";
  ctx.strokeStyle = "#fff7d4";
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawCharacter() {
  const image = getActiveCharacter();
  if (!image) {
    return;
  }

  const breath = Math.sin(state.timeSeconds * Math.PI * 1.15);
  const bob = breath * 6;
  const squash = 1 + breath * 0.012;
  const scale = (controlValue(characterScale) / 100) * squash;
  const width = 650 * scale;
  const height = image.height * (width / image.width);
  const x = 90 + controlValue(characterX);
  const y = 275 + controlValue(characterY) + bob;
  ctx.drawImage(image, x, y, width, height);
}

function drawForegroundTable() {
  const y = controlValue(tableFrontY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, canvas.width, canvas.height - y);
  ctx.clip();
  drawCover(state.images.background, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawPan() {
  if (!showPanInput.checked) {
    return;
  }

  if (comparePansInput.checked) {
    drawPanComparison();
    return;
  }

  drawPanState(state.fireStage, 1);
}

function drawPanState(stage, alpha) {
  const image = state.images.fire[stage];
  const width = controlValue(panWidthInput);
  const height = image.height * (width / image.width);
  const offset = panOffsetInputs[stage];
  let x = (canvas.width - width) / 2 + controlValue(offset.x);
  const bottomY = controlValue(panBottomYInput) + controlValue(offset.y);
  let y = bottomY - height;
  if (!comparePansInput.checked && stage >= 3) {
    const shake = getCookShakeOffset(stage);
    x += shake.x;
    y += shake.y;
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}

function getCookShakeOffset(stage = state.fireStage) {
  if (stage < 3 || !state.hasBread || state.toastFinished || state.fireAimState !== fireAiming.locked) {
    return { x: 0, y: 0 };
  }

  const amount = stage === 4 ? 8 : 4;
  return {
    x: Math.sin(state.timeSeconds * 58) * amount + Math.sin(state.timeSeconds * 93) * amount * 0.35,
    y: Math.cos(state.timeSeconds * 64) * amount * 0.45,
  };
}

function drawPanComparison() {
  for (let stage = 0; stage < state.images.fire.length; stage++) {
    const controls = panOffsetInputs[stage];
    if (!controls.visible.checked) {
      continue;
    }

    const alpha = stage === state.fireStage ? 0.9 : 0.34;
    drawPanState(stage, alpha);
  }

  drawComparisonLegend();
}

function drawComparisonLegend() {
  const x = 28;
  const y = 250;
  roundedRect(x, y, 174, 38, 16, "rgba(255, 245, 222, 0.74)", "#f25161", 3);
  ctx.fillStyle = "#f02f54";
  ctx.font = "900 20px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("比較中", x + 87, y + 26);
}

function drawPlacementGuide() {
  if (state.hasBread || state.placementStep === breadPlacement.idle) {
    return;
  }

  updateAimingBread();
  const panCenter = getPanCenter();
  const targetX = state.placementStep === breadPlacement.aimingX ? state.breadX : state.lockedBreadX;
  const targetY = state.placementStep === breadPlacement.aimingY ? state.breadY : panCenter.y;

  ctx.save();
  drawBreadTargetFrame(panCenter.x, panCenter.y);
  ctx.globalAlpha = 0.9;
  drawBreadAt(targetX, targetY, 0, "#ffe5a8");
  ctx.restore();
}

function drawBreadTargetFrame(x, y) {
  const image = state.images.breadTargetFrame;
  if (!image) {
    return;
  }

  const width = controlValue(breadWidthInput);
  const height = image.height * (width / image.width);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.08);
  ctx.globalAlpha = 0.88;
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawFireMeter() {
  if (state.isCooking || state.toastFinished || (state.fireAimState === fireAiming.idle && state.fireStage === 0)) {
    return;
  }

  updateFirePower();
  const image = state.images.firePowerMeter;
  const width = controlValue(meterWidthInput);
  const height = image.height * (width / image.width);
  const x = (canvas.width - width) / 2 + controlValue(meterXInput);
  const y = controlValue(meterYInput);
  ctx.save();
  ctx.drawImage(image, x, y, width, height);

  const pivotX = x + width * 0.50;
  const pivotY = y + height * 0.78;
  const angle = (-168 + state.firePower * 156) * Math.PI / 180;
  const needleLength = height * 0.47;
  const tipX = pivotX + Math.cos(angle) * needleLength;
  const tipY = pivotY + Math.sin(angle) * needleLength;
  const sideAngle = angle + Math.PI / 2;
  const baseLeftX = pivotX + Math.cos(sideAngle) * 13;
  const baseLeftY = pivotY + Math.sin(sideAngle) * 13;
  const baseRightX = pivotX - Math.cos(sideAngle) * 13;
  const baseRightY = pivotY - Math.sin(sideAngle) * 13;
  ctx.fillStyle = "#fff4db";
  ctx.strokeStyle = "#7f4327";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseLeftX, baseLeftY);
  ctx.lineTo(baseRightX, baseRightY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f25161";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff6dc";
  ctx.font = "900 30px system-ui, sans-serif";
  ctx.strokeStyle = "#7f4327";
  ctx.lineWidth = 5;
  ctx.textAlign = "center";
  const label = state.fireAimState === fireAiming.aiming ? "火力を止めて!" : "火力: " + getStageLabel(state.fireStage);
  ctx.strokeText(label, x + width / 2, y - 14);
  ctx.fillText(label, x + width / 2, y - 14);
  ctx.restore();
}

function firePowerToAngle(power) {
  return (-168 + power * 156) * Math.PI / 180;
}

function drawFireZoneOverlay(x, y, width, height) {
  const pivotX = x + width * 0.50;
  const pivotY = y + height * 0.78;
  const radius = height * 0.54;

  ctx.save();
  ctx.globalAlpha = 0.62;
  ctx.lineWidth = height * 0.145;
  ctx.lineCap = "butt";
  for (const zone of fireZoneStops) {
    ctx.strokeStyle = zone.color;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, radius, firePowerToAngle(zone.from), firePowerToAngle(zone.to));
    ctx.stroke();
  }

  ctx.globalAlpha = 0.9;
  ctx.lineWidth = Math.max(3, height * 0.012);
  ctx.strokeStyle = "#fff8df";
  for (const stop of fireZoneStops.slice(1)) {
    const angle = firePowerToAngle(stop.from);
    const inner = radius - height * 0.09;
    const outer = radius + height * 0.09;
    ctx.beginPath();
    ctx.moveTo(pivotX + Math.cos(angle) * inner, pivotY + Math.sin(angle) * inner);
    ctx.lineTo(pivotX + Math.cos(angle) * outer, pivotY + Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.restore();
}

function updateAimingBread() {
  const panCenter = getPanCenter();
  const difficulty = Math.min(4, state.breadsFinished + Math.floor(state.combo / 2));
  const speedBoost = 1 + difficulty * 0.08;
  const chaos = Math.max(0, difficulty - 1);
  if (state.placementStep === breadPlacement.aimingX) {
    const t = state.timeSeconds * speedBoost;
    state.breadX = panCenter.x +
      Math.sin(t * 2.7) * 285 +
      Math.sin(t * 5.1 + state.breadsFinished) * chaos * 26;
    state.breadY = panCenter.y + Math.sin(t * 3.6 + 0.7) * chaos * 26;
    return;
  }

  if (state.placementStep === breadPlacement.aimingY) {
    const t = state.timeSeconds * speedBoost;
    state.breadX = state.lockedBreadX;
    if (difficulty >= 3) {
      state.breadX += Math.sin(t * 4.3 + 1.4) * 36;
    }
    state.breadY = panCenter.y +
      Math.sin(t * 3.0) * 215 +
      Math.sin(t * 6.2 + 0.4) * chaos * 22;
  }
}

function updateFirePower() {
  if (state.fireAimState !== fireAiming.aiming) {
    return;
  }

  state.firePower = (Math.sin(state.timeSeconds * 3.8 * state.fireMeterSpeed + state.fireMeterPhase) + 1) / 2;
}

function chooseFireMeterSpeed() {
  const roll = Math.random();
  if (roll < 0.08) {
    return 0.85;
  }
  if (roll < 0.20) {
    return 1.15;
  }
  if (roll < 0.45) {
    return 1.5;
  }
  if (roll < 0.75) {
    return 1.85;
  }
  return 2.25;
}

function updateCooking(deltaTime) {
  if (!state.isCooking || !state.hasBread || deltaTime <= 0) {
    return;
  }

  const profile = getCookProfile();
  const visibleToast = getVisibleToast();
  const uneven = 1 - state.breadAccuracy;
  const lateSurge = 1 + Math.pow(Math.max(0, state.toast - 48) / 52, 2.1) * (state.fireStage >= 3 ? 2.25 : 1.25);
  const poorPlacementBoost = 1 + uneven * (0.42 + Math.max(0, visibleToast - 45) / 90);
  const stoppingBoost = state.isStoppingCook ? 1.22 : 1;
  state.toast = Math.min(112, state.toast + profile.rate * lateSurge * poorPlacementBoost * stoppingBoost * deltaTime);

  if (state.isStoppingCook) {
    state.stopDelayRemaining -= deltaTime;
    if (state.stopDelayRemaining <= 0) {
      finishCooking();
      return;
    }
  }

  state.smokeTimer += deltaTime * getSmokeRate(visibleToast);
  while (state.smokeTimer >= 1) {
    state.smokeTimer -= 1;
    spawnSmoke();
  }

  const range = getCookJudgeRange();
  const isBurntLook = visibleToast > range.goodMax;
  if (visibleToast >= range.burnAt) {
    setExpression("panic");
    return;
  }

  if (visibleToast >= range.goodMax - 2) {
    setExpression(state.fireStage >= 3 ? "panic" : "happy");
    return;
  }

  if (visibleToast >= range.goodMin) {
    setExpression("happy");
    return;
  }

  setExpression(visibleToast >= toastJudge.pale ? "normal" : "cry");
}

function updateFireLockedEffects(deltaTime) {
  if (deltaTime <= 0 || state.isCooking || !state.hasBread || state.toastFinished || state.fireAimState !== fireAiming.locked || state.fireStage < 3) {
    return;
  }

  const rate = state.fireStage === 4 ? 6.4 : 3.4;
  state.smokeTimer += deltaTime * rate;
  while (state.smokeTimer >= 1) {
    state.smokeTimer -= 1;
    spawnSmoke(true);
  }
}

function getCookProfile() {
  return fireCookProfiles[state.fireStage] || fireCookProfiles[0];
}

function getVisibleToast() {
  const profile = getCookProfile();
  const normalized = Math.max(0, Math.min(1.15, state.toast / 100));
  return Math.min(110, Math.pow(normalized, profile.curve) * 100);
}

function getFireRiskProfile(stage = state.fireStage) {
  return fireRiskProfiles[stage] || fireRiskProfiles[0];
}

function getCookJudgeRange(stage = state.fireStage) {
  const profile = getFireRiskProfile(stage);
  const placementPenalty = Math.round((1 - state.breadAccuracy) * 3);
  return {
    goodMin: profile.goodMin + placementPenalty,
    goodMax: profile.goodMax - placementPenalty,
    burnAt: Math.max(profile.goodMax + 4, profile.burnAt - placementPenalty),
    multiplier: profile.multiplier,
  };
}

function getSmokeRate(visibleToast) {
  const profile = getCookProfile();
  const delayedHeat = Math.max(0, visibleToast - profile.smokeLag);
  const fireMultiplier = state.fireStage === 4 ? 2.6 : state.fireStage === 3 ? 1.8 : 1;
  if (delayedHeat <= 0) {
    return state.fireStage >= 3 ? 0.22 * fireMultiplier : 0.04;
  }

  const hiddenDanger = state.fireStage >= 3 ? 1.65 : 0.65;
  return (hiddenDanger + delayedHeat / (state.fireStage >= 3 ? 5.5 : 13) + (1 - state.breadAccuracy) * 1.4) * fireMultiplier;
}

function spawnSmoke(forceStrong = false) {
  const uneven = 1 - state.breadAccuracy;
  const visibleToast = getVisibleToast();
  const strongFire = forceStrong || state.fireStage >= 3;
  state.smokeParticles.push({
    x: state.breadX + (Math.random() - 0.5) * (strongFire ? 230 : 120 + uneven * 95),
    y: state.breadY - 38 + (Math.random() - 0.5) * (strongFire ? 78 : 38),
    radius: 18 + Math.random() * (strongFire ? 38 : 24) + visibleToast * 0.11,
    vx: (Math.random() - 0.5) * (strongFire ? 46 : 22),
    vy: -48 - Math.random() * (strongFire ? 92 : 54) - state.fireStage * 9,
    age: 0,
    life: 1.0 + Math.random() * (strongFire ? 0.95 : 0.65),
    dark: strongFire || visibleToast >= toastJudge.goodMax,
  });

  if (state.smokeParticles.length > 130) {
    state.smokeParticles.splice(0, state.smokeParticles.length - 130);
  }
}

function spawnSmokeBurst(amount, forceStrong = true) {
  for (let i = 0; i < amount; i += 1) {
    spawnSmoke(forceStrong);
  }
}

function updateSmoke(deltaTime) {
  for (const particle of state.smokeParticles) {
    particle.age += deltaTime;
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.radius += 22 * deltaTime;
  }

  state.smokeParticles = state.smokeParticles.filter((particle) => particle.age < particle.life);
}

function drawPlacementScore() {
  if (!state.hasBread || state.breadAccuracy <= 0) {
    return;
  }

  const panCenter = getPanCenter();
  const radius = 86 + state.breadAccuracy * 80;
  ctx.save();
  ctx.globalAlpha = 0.22 + state.breadAccuracy * 0.22;
  ctx.fillStyle = state.breadAccuracy > 0.82 ? "#47e7a0" : state.breadAccuracy > 0.55 ? "#ffe86f" : "#f25161";
  ctx.beginPath();
  ctx.ellipse(panCenter.x, panCenter.y, radius, radius * 0.68, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawToast() {
  if (!state.hasBread) {
    return;
  }

  const shake = getCookShakeOffset();
  drawPlacementScore();
  drawBreadAt(state.breadX + shake.x, state.breadY + shake.y, -0.08);
}

function getToastColor() {
  const visibleToast = getVisibleToast();
  if (visibleToast >= toastJudge.burnt) {
    return "#312018";
  }

  if (visibleToast >= toastJudge.goodMax) {
    return "#8a4b2a";
  }

  if (visibleToast >= toastJudge.goodMin) {
    return "#d88435";
  }

  if (visibleToast >= toastJudge.pale) {
    return "#f1bd67";
  }

  if (visibleToast >= 15) {
    return "#ffdda0";
  }

  return "#ffeab8";
}

function getToastStateLabel() {
  const visibleToast = getVisibleToast();
  const range = getCookJudgeRange();
  if (visibleToast >= range.burnAt || visibleToast > range.goodMax) {
    return { text: "焦げた", color: "#f25161" };
  }
  if (visibleToast >= range.goodMin) {
    return { text: "焼けた", color: "#ffed86" };
  }
  if (visibleToast >= toastJudge.pale) {
    return { text: "少し焼けた", color: "#ffd4a3" };
  }
  return { text: "まだ", color: "#fff4db" };
}

function drawToastStatus() {
  if (!state.hasBread || state.toastFinished || state.fireStage === 0) {
    return;
  }

  const status = getToastStateLabel();
  const panCenter = getPanCenter();
  const y = Math.min(controlValue(meterYInput) - 78, panCenter.y + 330);
  ctx.save();
  roundedRect(panCenter.x - 160, y - 34, 320, 56, 24, "rgba(64, 33, 24, 0.74)", "#fff0ca", 4);
  ctx.fillStyle = status.color;
  ctx.font = "900 30px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(status.text, panCenter.x, y + 4);
  ctx.restore();
}

function drawBreadAt(x, y, rotation) {
  const image = getBreadSprite();
  if (!image) {
    return;
  }

  const width = controlValue(breadWidthInput);
  const height = image.height * (width / image.width);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getBreadSprite() {
  const visibleToast = getVisibleToast();
  const range = getCookJudgeRange();
  if (visibleToast > range.goodMax) {
    return state.images.breadBurnt || state.images.breadToasted || state.images.breadRaw;
  }

  if (visibleToast >= range.goodMin) {
    return state.images.breadToasted || state.images.breadRaw;
  }

  if (visibleToast >= toastJudge.pale) {
    return state.images.breadLight || state.images.breadRaw;
  }

  return state.images.breadRaw;
}

function drawToastMarks() {
  const visibleToast = getVisibleToast();
  if (visibleToast < 28) {
    return;
  }

  const range = getCookJudgeRange();
  const progress = Math.min(1, visibleToast / 100);
  const uneven = 1 - state.breadAccuracy;
  const panCenter = getPanCenter();
  const sideBias = Math.max(-1, Math.min(1, (state.breadX - panCenter.x) / 170));
  const verticalBias = Math.max(-1, Math.min(1, (state.breadY - panCenter.y) / 145));
  const edgeHeat = Math.max(0, visibleToast - 42) * uneven;
  ctx.save();
  ctx.globalAlpha = 0.16 + progress * 0.42 + edgeHeat * 0.006;
  ctx.fillStyle = visibleToast >= range.burnAt ? "#140d0a" : "#9b5429";
  ctx.beginPath();
  ctx.ellipse(
    -56 - sideBias * 46 - uneven * 26,
    -10 - verticalBias * 28 + uneven * 22,
    58 + progress * 20 + edgeHeat * 0.24,
    34 + progress * 14 + edgeHeat * 0.16,
    -0.18,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  if (visibleToast >= range.goodMin || uneven > 0.18) {
    ctx.globalAlpha = 0.14 + progress * 0.34;
    ctx.beginPath();
    ctx.ellipse(
      64 - sideBias * 38 + uneven * 22,
      12 - verticalBias * 24 - uneven * 18,
      52 + progress * 22 + edgeHeat * 0.18,
      30 + progress * 12 + edgeHeat * 0.12,
      0.22,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  if (visibleToast > range.goodMax) {
    ctx.globalAlpha = Math.min(0.74, (visibleToast - range.goodMax) / 30);
    ctx.fillStyle = "#23150f";
    for (let i = 0; i < 5; i += 1) {
      const angle = i * 1.7;
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * 72 + (i - 2) * 8,
        Math.sin(angle) * 42 + 12,
        12 + i * 3,
        7 + i * 2,
        angle * 0.3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawSmoke() {
  if (state.smokeParticles.length === 0) {
    return;
  }

  ctx.save();
  const visibleToast = getVisibleToast();
  for (const particle of state.smokeParticles) {
    const progress = particle.age / particle.life;
    const alpha = (1 - progress) * (particle.dark ? 0.38 : 0.22);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.dark ? "#6d6258" : "#f4ead8";
    ctx.beginPath();
    ctx.ellipse(particle.x, particle.y, particle.radius * 0.8, particle.radius, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMessage() {
  if (state.messageTimer <= 0 && state.message === "こんがり!") {
    return;
  }

  if (state.message === "HINATTA" && state.images.hinattaBubble) {
    drawHinattaBubble();
    return;
  }

  const bubble = getSpeechBubbleRect();
  drawMessageFrame(bubble.x, bubble.y, bubble.width, bubble.height, bubble.tailX, bubble.tailY);
  ctx.fillStyle = "#f02f54";
  ctx.textAlign = "center";
  drawMessageText(state.message, bubble.x, bubble.y, bubble.width, bubble.height);
}

function drawHinattaBubble() {
  const image = state.images.hinattaBubble;
  const width = controlValue(hinattaBubbleWidthInput);
  const height = image.height * (width / image.width);
  let x = Math.max(18, Math.min(canvas.width - width - 18, controlValue(hinattaBubbleXInput)));
  let y = Math.max(120, Math.min(860, controlValue(hinattaBubbleYInput)));
  let rotation = 0;
  if (state.hinattaShakeTimer > 0) {
    const progress = state.hinattaShakeTimer / 0.72;
    const strength = Math.max(0, progress) * 15;
    x += Math.sin(state.timeSeconds * 76) * strength;
    y += Math.cos(state.timeSeconds * 91) * strength * 0.55;
    rotation = Math.sin(state.timeSeconds * 82) * strength * 0.0038;
  }
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rotation);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawMessageText(text, x, y, width, height) {
  const fontSize = 34;
  ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
  const maxWidth = width - 130;
  const lines = splitMessageLines(text, maxWidth);

  const lineHeight = fontSize + 8;
  const startY = y + height / 2 - (lines.length - 1) * lineHeight / 2 + fontSize * 0.36;
  lines.forEach((messageLine, index) => {
    ctx.fillText(messageLine, x + width / 2, startY + index * lineHeight);
  });
}

function splitMessageLines(text, maxWidth) {
  const nextIndex = text.indexOf("次は");
  if (nextIndex > 0) {
    return [text.slice(0, nextIndex).trim(), text.slice(nextIndex).trim()];
  }

  const bangIndex = Math.max(text.indexOf("!"), text.indexOf("！"));
  if (bangIndex > 0 && bangIndex < text.length - 1) {
    return [text.slice(0, bangIndex + 1).trim(), text.slice(bangIndex + 1).trim()];
  }

  if (ctx.measureText(text).width <= maxWidth) {
    return [text];
  }

  const chars = Array.from(text);
  let first = "";
  let second = "";
  for (const char of chars) {
    if (!second && ctx.measureText(first + char).width <= maxWidth) {
      first += char;
    } else {
      second += char;
    }
  }

  return second ? [first, second] : [first];
}

function drawMessageFrame(x, y, width, height, tailX, tailY) {
  const image = state.images.messageFrame;
  if (!image) {
    drawSpeechBubble(x, y, width, height, tailX, tailY);
    return;
  }

  ctx.save();
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}

function getSpeechBubbleRect() {
  const characterMouth = getCharacterMouthPoint();
  const width = Math.max(300, controlValue(bubbleWidthInput));
  const frame = state.images.messageFrame;
  const height = frame ? Math.max(132, width * frame.height / frame.width) : 180;
  let x = controlValue(bubbleXInput);
  let y = controlValue(bubbleYInput);

  x = Math.max(24, Math.min(canvas.width - width - 24, x));
  y = Math.max(210, Math.min(820, y));

  return {
    x,
    y,
    width,
    height,
    tailX: characterMouth.x + controlValue(bubbleTailXInput),
    tailY: characterMouth.y + controlValue(bubbleTailYInput),
  };
}

function getCharacterMouthPoint() {
  const scale = controlValue(characterScale) / 100;
  return {
    x: 90 + controlValue(characterX) + 340 * scale,
    y: 275 + controlValue(characterY) + 255 * scale,
  };
}

function drawSpeechBubble(x, y, width, height, tailX, tailY) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 247, 228, 0.94)";
  ctx.strokeStyle = "#f25161";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 28);
  ctx.fill();
  ctx.stroke();

  const anchorX = Math.max(x + 42, Math.min(x + width - 42, tailX));
  ctx.beginPath();
  ctx.moveTo(anchorX - 24, y + height - 4);
  ctx.lineTo(Math.max(24, Math.min(canvas.width - 24, tailX)), Math.max(y + height + 18, Math.min(y + height + 72, tailY)));
  ctx.lineTo(anchorX + 26, y + height - 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.34)";
  ctx.beginPath();
  ctx.roundRect(x + 18, y + 10, width - 36, 18, 12);
  ctx.fill();
  ctx.restore();
}

function roundedRect(x, y, width, height, radius, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && lineWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function setMessage(message) {
  state.message = message;
  state.messageTimer = 1.2;
}

function setExpression(expression) {
  state.activeExpression = expression;
}

function isPlaying() {
  return state.mode === gameModes.playing;
}

function updateActionButtons() {
  if (!isPlaying()) {
    breadButton.disabled = true;
    fireButton.disabled = true;
    timerButton.disabled = true;
    return;
  }

  const breadEnabled = !state.isCooking &&
    !state.isStoppingCook &&
    (!state.hasBread || state.placementStep !== breadPlacement.placed || state.toastFinished);
  const fireEnabled = state.hasBread &&
    !state.toastFinished &&
    !state.isCooking &&
    !state.isStoppingCook &&
    state.fireAimState !== fireAiming.locked;
  const timerEnabled = state.hasBread &&
    !state.toastFinished &&
    !state.isStoppingCook &&
    state.fireAimState === fireAiming.locked &&
    state.fireStage !== 0;

  breadButton.disabled = !breadEnabled;
  fireButton.disabled = !fireEnabled;
  timerButton.disabled = !timerEnabled;
}

function getActiveCharacter() {
  return state.characters[state.activeExpression] ||
    state.characters.normal ||
    state.characters.cry ||
    state.characters.panic ||
    state.characters.happy ||
    state.characters.angry ||
    state.characters.good ||
    state.characters.hinatta;
}

breadButton.addEventListener("click", () => {
  if (!isPlaying()) {
    return;
  }

  spawnTapStars(breadButton);
  if (state.hasBread) {
    if (state.toastFinished) {
      resetBreadPlacement("次はパンを置いてね");
    }
    return;
  }

  updateAimingBread();
  if (state.placementStep === breadPlacement.aimingX) {
    state.lockedBreadX = state.breadX;
    state.placementStep = breadPlacement.aimingY;
    setExpression("normal");
    setMessage("次は縦位置を決めてね");
    return;
  }

  if (state.placementStep === breadPlacement.aimingY) {
    placeBread();
  }
});

fireButton.addEventListener("click", () => {
  if (!isPlaying()) {
    return;
  }

  if (!state.hasBread || state.toastFinished || state.isCooking || state.isStoppingCook || state.fireAimState === fireAiming.locked) {
    return;
  }

  spawnTapStars(fireButton);
  if (state.fireAimState !== fireAiming.aiming) {
    state.fireAimState = fireAiming.aiming;
    state.fireMeterSpeed = chooseFireMeterSpeed();
    state.fireMeterPhase = Math.random() * Math.PI * 2;
    setExpression(state.hasBread ? "normal" : "cry");
    setMessage("次は火力を止めてね");
    return;
  }

  updateFirePower();
  lockFirePower();
});

timerButton.addEventListener("click", () => {
  if (!isPlaying()) {
    return;
  }

  if (timerButton.disabled) {
    return;
  }

  spawnTapStars(timerButton);
  if (!state.hasBread) {
    state.combo = 0;
    setExpression("cry");
    setMessage("パンがないよ");
    return;
  }

  if (state.fireStage === 0) {
    state.combo = 0;
    setExpression("cry");
    setMessage("火をつけて!");
    return;
  }

  if (state.toastFinished) {
    setMessage("次のパンを置いてね!");
    return;
  }

  if (state.isStoppingCook) {
    setMessage("まだ判定中!");
    return;
  }

  if (!state.isCooking) {
    startCooking();
    return;
  }

  requestStopCooking();
});

function resetBreadPlacement(message) {
  const panCenter = getPanCenter();
  state.hasBread = false;
  state.toast = 0;
  state.isCooking = false;
  state.isStoppingCook = false;
  state.stopDelayRemaining = 0;
  state.toastFinished = false;
  state.smokeTimer = 0;
  state.smokeParticles = [];
  state.breadAccuracy = 0;
  state.breadX = panCenter.x;
  state.breadY = panCenter.y;
  state.lockedBreadX = panCenter.x;
  state.placementStep = breadPlacement.aimingX;
  setExpression("cry");
  setMessage(message);
  playVoice("voicePlace");
}

function placeBread() {
  const panCenter = getPanCenter();
  state.breadX = state.lockedBreadX;
  state.breadY = state.breadY;
  const dx = state.breadX - panCenter.x;
  const dy = (state.breadY - panCenter.y) * 1.18;
  const distance = Math.hypot(dx, dy);
  state.breadAccuracy = Math.max(0, 1 - distance / 255);
  state.hasBread = true;
  state.placementStep = breadPlacement.placed;
  state.toast = 0;
  state.isCooking = false;
  state.isStoppingCook = false;
  state.stopDelayRemaining = 0;
  state.toastFinished = false;
  state.smokeTimer = 0;
  state.smokeParticles = [];
  playSound("placeBread");
  const placementRank = getPlacementRank(state.breadAccuracy);
  const positionMultiplier = applyRankCombo(placementRank);
  const positionScore = Math.round((placementRank.points + Math.round(state.breadAccuracy * 40)) * positionMultiplier);
  state.score += positionScore;
  spawnScorePopup(placementRank.label, state.breadX, state.breadY - 170, placementRank.color);
  spawnScorePopup(`+${positionScore}点`, state.breadX, state.breadY - 115, placementRank.color);

  if (state.breadAccuracy >= 0.92) {
    setExpression("good");
    setMessage("PERFECT! 次は火をつけてね");
    playVoice("voiceFire");
    return;
  }

  if (state.breadAccuracy >= 0.52) {
    setExpression("normal");
    setMessage("いい感じ! 次は火をつけてね");
    playVoice("voiceFire");
    return;
  }

  setExpression("angry");
  setMessage("ちょっと端っこ! 次は火をつけてね");
  playVoice("voiceFire");
}

function startCooking() {
  state.isCooking = true;
  state.isStoppingCook = false;
  state.stopDelayRemaining = 0;
  state.smokeTimer = 0.65;
  playSound("timerStart");
  setExpression(state.fireStage === 4 ? "panic" : "normal");
  setMessage("いい焼き色でタイマーを押してね");
  playVoice("voiceYaku");
}

function requestStopCooking() {
  finishCooking();
}

function updateChallengeTimer(deltaTime) {
  if (!isPlaying() || deltaTime <= 0) {
    return;
  }

  state.timeRemaining = Math.max(0, state.timeRemaining - deltaTime);
  if (state.timeRemaining <= 0) {
    endChallenge();
  }
}

function finishCooking() {
  state.isCooking = false;
  state.isStoppingCook = false;
  state.stopDelayRemaining = 0;
  state.toastFinished = true;
  state.smokeTimer = 0;
  state.scorePopups = [];
  const visibleToast = getVisibleToast();
  const finishedFireStage = state.fireStage;
  const range = getCookJudgeRange(finishedFireStage);
  const isBurntLook = visibleToast > range.goodMax;
  state.fireStage = 0;
  state.fireAimState = fireAiming.idle;
  playSound("timerEnd");
  const cookRank = getCookRank(visibleToast, range);

  if (visibleToast >= range.burnAt) {
    state.hinattaToasts += 1;
    applyRankCombo(cookRank);
    spawnSmokeBurst(46, true);
    spawnScorePopup("0点...", state.breadX, state.breadY - 150, "#b7a29a");
    state.hinattaShakeTimer = 0.72;
    setExpression("hinatta");
    setMessage("HINATTA");
    playVoice("voiceHinatta");
    finishBreadRound();
    return;
  }

  if (!isBurntLook && visibleToast >= range.goodMin && visibleToast <= range.goodMax) {
    state.goodToasts += 1;
    const rankMultiplier = applyRankCombo(cookRank);
    const placementBonus = Math.round(state.breadAccuracy * 50);
    const fireBonus = Math.round(40 * range.multiplier);
    const baseScore = cookRank.points + placementBonus + fireBonus;
    const comboBonus = state.combo * 12;
    const gainedScore = Math.round((baseScore + comboBonus) * range.multiplier * rankMultiplier);
    state.score += gainedScore;
    spawnScorePopup(cookRank.label, state.breadX, state.breadY - 215, cookRank.color);
    spawnScorePopup("+" + gainedScore + "点!", state.breadX, state.breadY - 160, cookRank.color);
    setExpression("good");
    setMessage("上手に焼けました!");
    playVoice("voiceSuccess");
    finishBreadRound();
    return;
  }

  const badMultiplier = applyRankCombo(cookRank);
  const badScore = Math.round(cookRank.points * badMultiplier);
  spawnScorePopup(cookRank.label, state.breadX, state.breadY - 200, cookRank.color);
  spawnScorePopup("+" + badScore + "点", state.breadX, state.breadY - 145, cookRank.color);
  state.score += badScore;
  if (visibleToast < range.goodMin) {
    state.undercookedToasts += 1;
  } else {
    state.overcookedToasts += 1;
  }
  setExpression(visibleToast < range.goodMin ? "cry" : "angry");
  setMessage(visibleToast < range.goodMin ? "まだ早い!" : "焼きすぎ!");
  finishBreadRound();
}

function finishBreadRound(nextRoundDelayMs = 2600) {
  state.breadsFinished += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  if (isPlaying() && state.timeRemaining > 0) {
    window.setTimeout(() => {
      if (isPlaying() && state.toastFinished) {
        resetBreadPlacement("次はパンを置いてね");
      }
    }, nextRoundDelayMs);
  }
}

function lockFirePower() {
  state.fireAimState = fireAiming.locked;
  playSound("fireIgnite");

  if (state.firePower < 0.38) {
    state.fireStage = 4;
    state.fireAccuracy = 0;
    state.combo = 0;
    spawnSmokeBurst(14, true);
    showFireRank();
    setExpression("angry");
    setMessage("危険! 次はタイマーを押してね");
    playVoice("voiceTimer");
    return;
  }

  if (state.firePower < 0.47) {
    state.fireStage = 1;
    state.fireAccuracy = 0.35;
    showFireRank();
    setExpression(state.hasBread ? "normal" : "cry");
    setMessage("弱火! 次はタイマーを押してね");
    playVoice("voiceTimer");
    return;
  }

  if (state.firePower < 0.53) {
    state.fireStage = 2;
    state.fireAccuracy = 1;
    showFireRank();
    setExpression("good");
    setMessage("いい火加減! 次はタイマーを押してね");
    playVoice("voiceTimer");
    return;
  }

  if (state.firePower < 0.62) {
    state.fireStage = 3;
    state.fireAccuracy = 0.78;
    spawnSmokeBurst(9, true);
    showFireRank();
    setExpression("normal");
    setMessage("強火! 次はタイマーを押してね");
    playVoice("voiceTimer");
    return;
  }

  state.fireStage = 4;
  state.fireAccuracy = 0;
  state.combo = 0;
  spawnSmokeBurst(14, true);
  showFireRank();
  setExpression("angry");
  setMessage("危険! 次はタイマーを押してね");
  playVoice("voiceTimer");
}

function showFireRank() {
  const rank = getFireRank(state.fireStage);
  const multiplier = applyRankCombo(rank);
  const score = Math.round(rank.points * multiplier);
  state.score += score;
  const panCenter = getPanCenter();
  spawnScorePopup(rank.label, panCenter.x, controlValue(meterYInput) - 115, rank.color);
  if (score > 0) {
    spawnScorePopup(`+${score}点`, panCenter.x, controlValue(meterYInput) - 62, rank.color);
  }
}

function resetRunState() {
  const panCenter = getPanCenter();
  state.mode = gameModes.playing;
  state.timeRemaining = challengeSeconds;
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.breadsFinished = 0;
  state.goodToasts = 0;
  state.hinattaToasts = 0;
  state.undercookedToasts = 0;
  state.overcookedToasts = 0;
  state.hasBread = false;
  state.placementStep = breadPlacement.aimingX;
  state.breadX = panCenter.x;
  state.breadY = panCenter.y;
  state.lockedBreadX = panCenter.x;
  state.breadAccuracy = 0;
  state.fireAimState = fireAiming.idle;
  state.firePower = 0;
  state.fireAccuracy = 0;
  state.fireStage = 0;
  state.fireMeterSpeed = 1;
  state.fireMeterPhase = 0;
  state.toast = 0;
  state.isCooking = false;
  state.isStoppingCook = false;
  state.stopDelayRemaining = 0;
  state.toastFinished = false;
  state.smokeTimer = 0;
  state.smokeParticles = [];
  state.scorePopups = [];
  state.tapStars = [];
  state.hinattaShakeTimer = 0;
  setExpression("normal");
  setMessage("パンを置いてね");
  playVoice("voicePlace");
}

function startChallenge() {
  unlockAudio();
  resetRunState();
  startBgm();
  gameOverlay.hidden = true;
  if (helpPanel != null) {
    helpPanel.hidden = true;
  }
  saveScoreButton.hidden = true;
  updateActionButtons();
}

function endChallenge() {
  if (state.mode !== gameModes.playing) {
    return;
  }

  state.mode = gameModes.ended;
  state.isCooking = false;
  state.isStoppingCook = false;
  state.fireAimState = fireAiming.idle;
  state.fireStage = 0;
  state.timeRemaining = 0;
  stopBgm();
  playSound("timerEnd");
  updateActionButtons();
  showResultOverlay();
}

function showStartOverlay() {
  state.mode = gameModes.idle;
  gameOverlay.dataset.screen = "start";
  gameOverlay.hidden = false;
  overlaySummary.textContent = "45秒で何枚こんがり焼けるかな？";
  overlayStats.innerHTML = "";
  startGameButton.textContent = "ゲーム開始";
  if (helpButton != null) {
    helpButton.hidden = false;
  }
  if (rankingButton != null) {
    rankingButton.hidden = false;
  }
  if (helpPanel != null) {
    helpPanel.hidden = true;
  }
  if (rankingPanel != null) {
    rankingPanel.hidden = true;
  }
  if (topRankingBlock != null) {
    topRankingBlock.hidden = true;
  }
  saveScoreButton.hidden = true;
  renderRankingList();
}

function showResultOverlay() {
  gameOverlay.dataset.screen = "result";
  gameOverlay.hidden = false;
  overlaySummary.textContent = "結果発表！";
  overlayStats.innerHTML = `
    <div class="overlay-stat"><span>スコア</span>${state.score}</div>
    <div class="overlay-stat"><span>枚数</span>${state.breadsFinished}</div>
    <div class="overlay-stat"><span>上手に焼けた</span>${state.goodToasts}</div>
    <div class="overlay-stat"><span>ひなった</span>${state.hinattaToasts}</div>
    <div class="overlay-stat"><span>まだ早い</span>${state.undercookedToasts}</div>
    <div class="overlay-stat"><span>焼きすぎ</span>${state.overcookedToasts}</div>
    <div class="overlay-stat"><span>最大コンボ</span>${state.bestCombo}</div>
  `;
  startGameButton.textContent = "もう一回";
  if (helpButton != null) {
    helpButton.hidden = true;
  }
  if (rankingButton != null) {
    rankingButton.hidden = false;
  }
  if (helpPanel != null) {
    helpPanel.hidden = true;
  }
  if (rankingPanel != null) {
    rankingPanel.hidden = true;
  }
  if (topRankingBlock != null) {
    topRankingBlock.hidden = true;
  }
  saveScoreButton.hidden = false;
  renderRankingList();
}

function isRemoteRankingEnabled() {
  return Boolean(rankingConfig.supabaseUrl && rankingConfig.supabaseAnonKey);
}

function getLocalRankings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(rankingStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeRankingEntry(entry) {
  return {
    name: String(entry.name || "PLAYER").slice(0, 12),
    score: Number(entry.score) || 0,
    breads: Number(entry.breads) || 0,
    combo: Number(entry.combo) || 0,
    good: Number(entry.good) || 0,
    hinatta: Number(entry.hinatta) || 0,
    undercooked: Number(entry.undercooked) || 0,
    overcooked: Number(entry.overcooked) || 0,
    date: entry.date || entry.created_at || Date.now(),
  };
}

function sortRankings(rankings) {
  return rankings.sort((a, b) => b.score - a.score || b.combo - a.combo || b.breads - a.breads);
}

async function getRankings() {
  if (!isRemoteRankingEnabled()) {
    return sortRankings(getLocalRankings().map(normalizeRankingEntry));
  }

  try {
    const params = new URLSearchParams({
      select: "name,score,breads,combo,good,hinatta,undercooked,overcooked,created_at",
      order: "score.desc,combo.desc,breads.desc,created_at.asc",
      limit: String(rankingConfig.limit),
    });
    const response = await fetch(`${rankingConfig.supabaseUrl}/rest/v1/${rankingConfig.tableName}?${params}`, {
      headers: {
        apikey: rankingConfig.supabaseAnonKey,
        Authorization: `Bearer ${rankingConfig.supabaseAnonKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`ranking fetch failed: ${response.status}`);
    }
    const rows = await response.json();
    return rows.map(normalizeRankingEntry);
  } catch (error) {
    console.warn(error);
    return sortRankings(getLocalRankings().map(normalizeRankingEntry));
  }
}

async function saveRanking() {
  const name = (playerNameInput.value || "PLAYER").trim().slice(0, 12) || "PLAYER";
  const entry = {
    name,
    score: state.score,
    breads: state.breadsFinished,
    combo: state.bestCombo,
    good: state.goodToasts,
    hinatta: state.hinattaToasts,
    undercooked: state.undercookedToasts,
    overcooked: state.overcookedToasts,
    date: Date.now(),
  };

  if (isRemoteRankingEnabled()) {
    try {
      const response = await fetch(`${rankingConfig.supabaseUrl}/rest/v1/${rankingConfig.tableName}`, {
        method: "POST",
        headers: {
          apikey: rankingConfig.supabaseAnonKey,
          Authorization: `Bearer ${rankingConfig.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: entry.name,
          score: entry.score,
          breads: entry.breads,
          combo: entry.combo,
          good: entry.good,
          hinatta: entry.hinatta,
          undercooked: entry.undercooked,
          overcooked: entry.overcooked,
        }),
      });
      if (!response.ok) {
        throw new Error(`ranking save failed: ${response.status}`);
      }
    } catch (error) {
      console.warn(error);
      const rankings = sortRankings([...getLocalRankings().map(normalizeRankingEntry), entry]);
      localStorage.setItem(rankingStorageKey, JSON.stringify(rankings));
    }
  } else {
    const rankings = sortRankings([...getLocalRankings().map(normalizeRankingEntry), entry]);
    localStorage.setItem(rankingStorageKey, JSON.stringify(rankings));
  }

  saveScoreButton.hidden = true;
  await renderRankingList();
}

async function renderRankingList() {
  const rankings = await getRankings();
  const topRankings = rankings.slice(0, 3);
  rankingList.innerHTML = topRankings.length
    ? topRankings.map(formatRankingEntry).join("")
    : "<li>まだ記録なし</li>";

  if (rankingAllList != null) {
    rankingAllList.innerHTML = rankings.length
      ? rankings.map(formatRankingEntry).join("")
      : "<li>まだ記録なし</li>";
  }
}

function formatRankingEntry(entry, index) {
  return `<li><span class="ranking-left">${index + 1}. ${escapeHtml(entry.name)}</span><strong>${entry.score}点</strong></li>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function getStageLabel(stage) {
  switch (stage) {
    case 1:
      return "弱火";
    case 2:
      return "中火";
    case 3:
      return "強火";
    case 4:
      return "危険";
    default:
      return "消火";
  }
}

removeBlack.addEventListener("change", () => {
  for (const expression of Object.keys(state.characterSources)) {
    const source = state.characterSources[expression];
    if (source) {
      state.characters[expression] = source;
    }
  }
});

for (const input of document.querySelectorAll(".character-panel input[type='range']")) {
  input.addEventListener("input", updateControlOutputs);
}

copyLayoutButton.addEventListener("click", copyLayoutValues);
startGameButton.addEventListener("click", startChallenge);
saveScoreButton.addEventListener("click", saveRanking);
if (helpButton != null && helpPanel != null) {
  helpButton.addEventListener("click", () => {
    helpPanel.hidden = !helpPanel.hidden;
    if (rankingPanel != null) {
      rankingPanel.hidden = true;
    }
    if (topRankingBlock != null) {
      topRankingBlock.hidden = true;
    }
  });
}
if (rankingButton != null && rankingPanel != null) {
  rankingButton.addEventListener("click", () => {
    renderRankingList();
    rankingPanel.hidden = false;
    if (topRankingBlock != null) {
      topRankingBlock.hidden = true;
    }
    if (helpPanel != null) {
      helpPanel.hidden = true;
    }
  });
}
if (closeRankingButton != null && rankingPanel != null) {
  closeRankingButton.addEventListener("click", () => {
    rankingPanel.hidden = true;
    if (topRankingBlock != null) {
      topRankingBlock.hidden = true;
    }
  });
}

function knockOutBlack(image) {
  const work = document.createElement("canvas");
  work.width = image.width;
  work.height = image.height;
  const workCtx = work.getContext("2d");
  workCtx.drawImage(image, 0, 0);
  const data = workCtx.getImageData(0, 0, work.width, work.height);
  const pixels = data.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const brightness = Math.max(r, g, b);
    if (brightness < 20) {
      pixels[i + 3] = 0;
    } else if (brightness < 48) {
      pixels[i + 3] = Math.min(pixels[i + 3], (brightness - 20) * 9);
    }
  }

  workCtx.putImageData(data, 0, 0);
  return work;
}

boot();
