/**
 * Multi-Agent Autonomous Mind & 2D Steering Engine for the Background Skeleton Crew.
 * Gives Ollie (skater), Sherlock (detective), and B-Boy distinct personalities,
 * varied dance repertoires, dance battles, internal energy/memory, buddy chats,
 * games of tag, portfolio section scanning, cursor curiosity, and pop panic.
 */

const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'playground',
  'experience',
  'education',
  'skills',
  'contact',
];

const AGENT_LABELS = {
  skater: 'OLLIE',
  detective: 'SHERLOCK',
  bboy: 'B-BOY',
};

const MOVE_REPERTOIRE = {
  skater: {
    hyper: ['kickflip', 'wheelie', 'spin360', 'moonwalk'],
    party: ['kickflip', 'wheelie', 'spin360', 'moonwalk'],
    lofi: ['chill_cruise', 'wheelie', 'moonwalk', 'spin360'],
    disco: ['chill_cruise', 'wheelie', 'moonwalk', 'spin360'],
  },
  detective: {
    hyper: ['bass_squat', 'robot', 'shuffle', 'dab'],
    party: ['bass_squat', 'robot', 'shuffle', 'dab'],
    lofi: ['rose_sway', 'robot', 'shuffle', 'dab'],
    disco: ['rose_sway', 'robot', 'shuffle', 'dab'],
  },
  bboy: {
    hyper: ['headspin', 'freeze', 'windmill', 'wave'],
    party: ['headspin', 'freeze', 'windmill', 'wave'],
    lofi: ['balloon', 'freeze', 'wave', 'windmill'],
    disco: ['balloon', 'freeze', 'wave', 'windmill'],
  },
};

const MOVE_CAPTIONS = {
  kickflip: 'KICKFLIP!! 🔥🛹',
  wheelie: 'ONE-WHEEL MANUAL!! 🛹✨',
  moonwalk: 'moonwalking across!! 🌙🕺',
  spin360: '360 BOARD SPIN!! ⚡',
  chill_cruise: 'smooth cruise~ 💖🛹',
  bass_squat: 'HEAVY BASS SQUAT!! 🔊🔥',
  robot: 'BEEP BOOP ROBOT!! 🤖⚡',
  shuffle: 'SHUFFLE FOOTWORK!! 👟🔥',
  dab: 'SICK DAB!! 🔥😎',
  rose_sway: 'holding a rose for u 🌹',
  headspin: 'UPSIDE-DOWN HEADSPIN!! 🌪️🔥',
  freeze: 'ONE-HAND FREEZE!! 🪩',
  windmill: '360 WINDMILL SPIN!! 🌪️⚡',
  balloon: 'floating in love~ 🎈💖',
  wave: 'funky wave groove~ ✨',
};

const SECTION_COMMENTS = {
  hero: {
    skater: ['Flutter 60FPS cruise! 🛹⚡', 'welcome to Sagar’s desk! 😎'],
    detective: ['checking out the desk! 🔍', 'nice clean UI up top 👀'],
    bboy: ['vibing in the hero zone! 🎵', 'yo check that Polaroid! ✨'],
  },
  about: {
    skater: ['reading Sagar’s story~ 📖🛹', '1+ yr mobile dev! 🔥'],
    detective: ['inspecting the ABOUT bio! 🔍', 'MCA + Flutter specialist! 💡'],
    bboy: ['chill bio reading break~ 💀', 'solid engineering mindset! ✨'],
  },
  projects: {
    skater: ['Uthix LMS looks slick!! 🔥📱', 'Flutter + Riverpod speed! ⚡'],
    detective: ['ooh Uthix Flutter app! 🔍', 'live analytics case study! 📊'],
    bboy: ['look at those case studies! 🪩', 'clean UI architecture!! 💯'],
  },
  playground: {
    skater: ['try tapping the phone!! 📱🛹', 'interactive studio!! 🔥'],
    detective: ['testing every app screen 🔍', '60fps phone simulator!! 👀'],
    bboy: ['ooh playable phone preview! ✨', 'tap those tabs in playground! 👆'],
  },
  experience: {
    skater: ['VPower Logistics driver app! 🚚💨', 'shipping real apps!! 🔥'],
    detective: ['checking work history 🔍', 'VPower Logistics & Uthix! 📋'],
    bboy: ['real production experience! 💪', 'mobile dev grinding!! 🎵'],
  },
  education: {
    skater: ['MCA @ Chandigarh Univ! 🎓🛹', 'campus vibes!! ✨'],
    detective: ['studying degree timeline 🔍', 'MCA 2024–2026 noted! 📝'],
    bboy: ['listening near education ledge ♪', 'student-turned-engineer!! 💀'],
  },
  skills: {
    skater: ['Python + FastAPI clean! ⚡', 'Flutter + Firebase + Dart!! 🔥'],
    detective: ['scanning the tech stack 🔍', 'try searching a skill! 💡'],
    bboy: ['that skill board is stacked! 🛠️', 'Flutter, Dart, Python, FastAPI! ✨'],
  },
  contact: {
    skater: ['psst hire Sagar already!! 💌', 'drop a message right here! 🛹'],
    detective: ['waiting for a DM right here 🔍', 'open for mobile roles! ✉️'],
    bboy: ['send a hello note!! 💖💌', 'he actually reads every email! 📬'],
  },
};

const CHAT_SCRIPTS = [
  ['skater', 'detective', 'bet u cant land a kickflip!! 🛹', 'my magnifying glass begs to differ 🧐'],
  ['detective', 'bboy', 'why is this portfolio so clean?! 🔍', 'because of 60fps Flutter magic~ ✨'],
  ['bboy', 'skater', 'yo how’s the grip tape holding up?', 'fresh as Sagar’s Dart code!! 🔥'],
  ['skater', 'bboy', 'race u across the screen?! 🏁', 'only if u let me moonwalk there 🕺'],
  ['detective', 'skater', 'psst... think the visitor saw us?', 'act natural... just keep dancing!! 👀'],
  ['bboy', 'detective', 'my ribs hurt from that last beat 😅', 'walk it off buddy!! 🔍🦴'],
  ['skater', 'detective', 'careful, their cursor looks sus.. 👀', 'if we inflate, EVERYBODY RUN!! 😱'],
  ['detective', 'bboy', 'have u checked the Playground phone?', 'yeah the animations are butter!! 📱✨'],
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Select a different dance move from the character's repertoire so moves never repeat consecutively.
 */
export function pickNextMove(id, danceStyle, prevMove) {
  const pool = MOVE_REPERTOIRE[id]?.[danceStyle] || MOVE_REPERTOIRE[id]?.lofi || [];
  if (!pool.length) return prevMove || 'spin360';
  const candidates = pool.filter((m) => m !== prevMove);
  return pickRandom(candidates.length ? candidates : pool);
}

/**
 * Find which portfolio section is currently closest to the viewport center.
 */
export function detectVisibleSection() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 'hero';
  }
  const targetY = window.innerHeight * 0.45;
  let bestId = 'hero';
  let bestDist = Infinity;

  for (let i = 0; i < SECTION_IDS.length; i++) {
    const id = SECTION_IDS[i];
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const center = (rect.top + rect.bottom) / 2;
    const dist = Math.abs(center - targetY);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = id;
    }
  }
  return bestId;
}

/**
 * Pick an open visible destination spot tailored to character roaming habits.
 */
function pickVisibleSpot(vw, vh, preferSide = null, allowCenter = false, horizontalRun = false) {
  const safeW = Math.max(320, vw || 1200);
  const safeH = Math.max(320, vh || 800);

  if (horizontalRun) {
    // Sweeping cross-page run along open upper or lower lane
    const upperLane = Math.random() < 0.5;
    const y = upperLane ? rand(86, 138) : rand(Math.max(180, safeH - 125), safeH - 68);
    const leftToRight = Math.random() < 0.5;
    const x = leftToRight ? safeW - 72 : 72;
    return { x: clamp(x, 48, safeW - 48), y, inCenter: false };
  }

  let side = preferSide;
  if (!side) {
    const roll = Math.random();
    side = allowCenter && roll < 0.16 ? 'center' : roll < 0.58 ? 'left' : 'right';
  }

  let x;
  if (side === 'left') {
    x = rand(58, Math.max(96, safeW * 0.16));
  } else if (side === 'right') {
    x = rand(Math.min(safeW - 96, safeW * 0.84), safeW - 58);
  } else {
    x = rand(safeW * 0.34, safeW * 0.66);
  }

  const y = rand(96, Math.max(150, safeH - 78));
  return {
    x: clamp(x, 48, safeW - 48),
    y: clamp(y, 82, safeH - 68),
    inCenter: side === 'center',
  };
}

function getMusicModeProps(id, danceStyle, isPlaying, intent) {
  if (intent === 'nap') {
    return { trick: false, inspecting: false, move: 'freeze', napping: true };
  }
  if (!isPlaying) {
    return {
      trick: false,
      inspecting: id === 'detective',
      move: 'freeze',
      napping: false,
    };
  }
  if (danceStyle === 'hyper') {
    return {
      trick: intent !== 'chat' && intent !== 'investigate_cursor',
      inspecting: false,
      move: intent === 'chat' ? 'freeze' : 'headspin',
      napping: false,
    };
  }
  if (danceStyle === 'disco') {
    return {
      trick: intent === 'showoff' || intent === 'chase' || intent === 'dance_off',
      inspecting: false,
      move: 'freeze',
      napping: false,
    };
  }
  if (danceStyle === 'party') {
    return {
      trick: intent !== 'chat',
      inspecting: false,
      move: 'headspin',
      napping: false,
    };
  }
  // 'lofi' romantic cruise
  return {
    trick: intent === 'chase' || intent === 'flee' || intent === 'grudge_dodge',
    inspecting: intent !== 'flee' && intent !== 'showoff',
    move: 'balloon',
    napping: false,
  };
}

/**
 * Create the 3 distinct independent skeleton agents.
 */
export function createInitialCrewState(vw = 1200, vh = 800, danceStyle = 'hyper') {
  const safeW = Math.max(320, vw || 1200);
  const safeH = Math.max(320, vh || 800);
  const now = typeof performance !== 'undefined' ? performance.now() : 0;

  const skaterMove = pickNextMove('skater', danceStyle, null);
  const detectiveMove = pickNextMove('detective', danceStyle, null);
  const bboyMove = pickNextMove('bboy', danceStyle, null);

  return {
    skater: {
      id: 'skater',
      x: safeW * 0.1,
      y: safeH * 0.28,
      vx: 0,
      vy: 0,
      targetX: safeW * 0.14,
      targetY: safeH * 0.36,
      facing: 1,
      baseSpeed: 280,
      intent: 'showoff',
      intentUntil: now + rand(2200, 3800),
      danceMove: skaterMove,
      moveUntil: now + rand(2000, 3600),
      scanFlipAt: now + 900,
      partnerId: null,
      energy: 88,
      popMemory: 0,
      lastPoppedAt: 0,
      dodgeCooldownUntil: 0,
      flinchCooldownUntil: 0,
      phrase: MOVE_CAPTIONS[skaterMove] || 'KICKFLIP!! 🔥🛹',
      phraseUntil: now + 3500,
      pendingReply: null,
      hiding: false,
      ...getMusicModeProps('skater', danceStyle, true, 'showoff'),
    },
    detective: {
      id: 'detective',
      x: safeW * 0.88,
      y: safeH * 0.52,
      vx: 0,
      vy: 0,
      targetX: safeW * 0.85,
      targetY: safeH * 0.46,
      facing: -1,
      baseSpeed: 175,
      intent: 'patrol_section',
      intentUntil: now + rand(2900, 4700),
      danceMove: detectiveMove,
      moveUntil: now + rand(2200, 4000),
      scanFlipAt: now + 900,
      partnerId: null,
      energy: 82,
      popMemory: 0,
      lastPoppedAt: 0,
      dodgeCooldownUntil: 0,
      flinchCooldownUntil: 0,
      phrase: pickRandom(SECTION_COMMENTS.hero.detective),
      phraseUntil: now + 3800,
      pendingReply: null,
      hiding: false,
      ...getMusicModeProps('detective', danceStyle, true, 'patrol_section'),
    },
    bboy: {
      id: 'bboy',
      x: safeW * 0.13,
      y: safeH * 0.78,
      vx: 0,
      vy: 0,
      targetX: safeW * 0.16,
      targetY: safeH * 0.7,
      facing: 1,
      baseSpeed: 190,
      intent: 'showoff',
      intentUntil: now + rand(3400, 5600),
      danceMove: bboyMove,
      moveUntil: now + rand(2400, 4200),
      scanFlipAt: now + 900,
      partnerId: null,
      energy: 74,
      popMemory: 0,
      lastPoppedAt: 0,
      dodgeCooldownUntil: 0,
      flinchCooldownUntil: 0,
      phrase: MOVE_CAPTIONS[bboyMove] || 'WINDMILL SPIN!! 🌪️',
      phraseUntil: now + 4000,
      pendingReply: null,
      hiding: false,
      ...getMusicModeProps('bboy', danceStyle, true, 'showoff'),
    },
  };
}

function releaseAgentLink(agent, agents) {
  if (!agent.partnerId) return;
  const partner = agents[agent.partnerId];
  if (partner && partner.partnerId === agent.id) {
    partner.partnerId = null;
    partner.pendingReply = null;
    if (
      partner.intent === 'chat' ||
      partner.intent === 'chase' ||
      partner.intent === 'flee' ||
      partner.intent === 'dance_off'
    ) {
      partner.intent = 'roam';
      partner.intentUntil = 0;
    }
  }
  agent.partnerId = null;
}

function getFreeBuddies(self, agents) {
  return Object.values(agents).filter(
    (other) =>
      other.id !== self.id &&
      (other.intent === 'roam' ||
        other.intent === 'patrol_section' ||
        other.intent === 'showoff') &&
      !other.partnerId &&
      !other.hiding
  );
}

function pickMeetingAnchor(a, b, world) {
  const side =
    a.x < world.vw * 0.5 && b.x < world.vw * 0.5
      ? 'left'
      : a.x > world.vw * 0.5 && b.x > world.vw * 0.5
      ? 'right'
      : Math.random() < 0.5
      ? 'left'
      : 'right';

  const anchor = pickVisibleSpot(world.vw, world.vh, side, false, false);
  return {
    meetX: clamp(anchor.x, 108, world.vw - 108),
    meetY: clamp(anchor.y, 102, world.vh - 84),
  };
}

function startBuddyChat(initiator, partner, world, now) {
  const { meetX, meetY } = pickMeetingAnchor(initiator, partner, world);
  const dur = rand(4500, 6000);

  const matchingScripts = CHAT_SCRIPTS.filter(
    ([a, b]) =>
      (a === initiator.id && b === partner.id) ||
      (a === partner.id && b === initiator.id)
  );
  const script = matchingScripts.length
    ? pickRandom(matchingScripts)
    : pickRandom(CHAT_SCRIPTS);

  const line1 = script[0] === initiator.id ? script[2] : script[3];
  const line2 = script[0] === initiator.id ? script[3] : script[2];

  const leftBuddy = initiator.x <= partner.x ? initiator : partner;
  const rightBuddy = leftBuddy === initiator ? partner : initiator;

  leftBuddy.targetX = clamp(meetX - 46, 48, world.vw - 115);
  leftBuddy.targetY = meetY;
  rightBuddy.targetX = clamp(meetX + 46, 115, world.vw - 48);
  rightBuddy.targetY = meetY;

  [initiator, partner].forEach((a) => {
    a.intent = 'chat';
    a.intentUntil = now + dur;
    a.hiding = false;
    a.napping = false;
    a.pendingReply = null;
    Object.assign(
      a,
      getMusicModeProps(a.id, world.danceStyle, world.isPlaying, 'chat')
    );
  });

  initiator.partnerId = partner.id;
  partner.partnerId = initiator.id;
  initiator.phrase = line1;
  partner.phrase = '...listening 👂';
  partner.pendingReply = { text: line2, at: now + 1750 };
}

function startDanceBattle(initiator, partner, world, now) {
  const { meetX, meetY } = pickMeetingAnchor(initiator, partner, world);
  const dur = rand(4200, 5600);

  const leftBuddy = initiator.x <= partner.x ? initiator : partner;
  const rightBuddy = leftBuddy === initiator ? partner : initiator;

  leftBuddy.targetX = clamp(meetX - 49, 48, world.vw - 118);
  leftBuddy.targetY = meetY;
  rightBuddy.targetX = clamp(meetX + 49, 118, world.vw - 48);
  rightBuddy.targetY = meetY;

  [initiator, partner].forEach((a) => {
    a.intent = 'dance_off';
    a.intentUntil = now + dur;
    a.danceMove = pickNextMove(a.id, 'hyper', a.danceMove);
    a.moveUntil = now + 1300;
    a.hiding = false;
    a.napping = false;
    a.pendingReply = null;
    Object.assign(
      a,
      getMusicModeProps(a.id, world.danceStyle, world.isPlaying, 'dance_off')
    );
  });

  initiator.partnerId = partner.id;
  partner.partnerId = initiator.id;
  initiator.phrase = 'DANCE BATTLE!! 🔥';
  partner.phrase = 'OH U ASKED FOR IT!! 🕺';
  partner.pendingReply = { text: 'ok that move was fire 😂🔥', at: now + 2700 };
}

/**
 * Independent autonomous decision-maker for a single skeleton when its current intent expires.
 */
export function chooseNextIntent(agent, agents, world, now) {
  if (agent.intent === 'inflating' || agent.intent === 'popped') return;

  releaseAgentLink(agent, agents);
  agent.hiding = false;
  agent.pendingReply = null;

  const { vw, vh, danceStyle, isPlaying, userIdleMs, section, mouseX, mouseY } =
    world;

  // 1. Nap / catch breath when tired OR when music is paused
  const wantsMusicPauseNap = !isPlaying && Math.random() < (agent.id === 'bboy' ? 0.55 : 0.35);
  if (agent.energy < 24 || wantsMusicPauseNap) {
    const spot = pickVisibleSpot(vw, vh, agent.x < vw * 0.5 ? 'left' : 'right');
    agent.intent = 'nap';
    agent.intentUntil = now + rand(3800, 6200);
    agent.targetX = spot.x;
    agent.targetY = spot.y;
    agent.phrase = !isPlaying
      ? pickRandom(['too quiet.. zzz 💤', 'napping til music plays 💤'])
      : pickRandom(['zzz... bone break 💤', 'catching my breath~ 😴']);
    Object.assign(agent, getMusicModeProps(agent.id, danceStyle, isPlaying, 'nap'));
    return;
  }

  const freeBuddies = getFreeBuddies(agent, agents);
  const roll = Math.random();

  // 2. Spontaneous 2-skeleton Dance Battle (~18% when energized & music playing)
  if (freeBuddies.length > 0 && isPlaying && agent.energy > 42 && roll < 0.18) {
    startDanceBattle(agent, pickRandom(freeBuddies), world, now);
    return;
  }

  // 3. Buddy chat (~18%)
  if (freeBuddies.length > 0 && roll < 0.36) {
    startBuddyChat(agent, pickRandom(freeBuddies), world, now);
    return;
  }

  // 4. Playful tag / chase (~16% for Ollie or B-Boy when energized & music playing)
  if (
    freeBuddies.length > 0 &&
    isPlaying &&
    agent.energy > 45 &&
    (agent.id === 'skater' || agent.id === 'bboy') &&
    roll < 0.52
  ) {
    const runner = pickRandom(freeBuddies);
    const dur = rand(2600, 4200);

    agent.intent = 'chase';
    agent.partnerId = runner.id;
    agent.intentUntil = now + dur;
    agent.phrase = pickRandom(['TAG!! UR IT!! 🏃💨', 'COME HERE!! 😂🦴', 'CATCHING U!! ⚡']);
    Object.assign(agent, getMusicModeProps(agent.id, danceStyle, isPlaying, 'chase'));

    runner.intent = 'flee';
    runner.partnerId = agent.id;
    runner.intentUntil = now + dur;
    runner.hiding = false;
    runner.phrase = pickRandom([
      'AHH STOP CHASING ME!! 😱',
      'NOO U CANT CATCH ME!! 🏃💨',
      'HEELP!! 🦴💨',
    ]);
    Object.assign(runner, getMusicModeProps(runner.id, danceStyle, isPlaying, 'flee'));
    return;
  }

  // 5. Investigate idle cursor (~36% when cursor still > 4.8s and not right on top of skeleton)
  const distToCursor = Math.hypot(mouseX - agent.x, mouseY - agent.y);
  if (
    userIdleMs > 4800 &&
    distToCursor > 110 &&
    (agent.id === 'detective' || agent.id === 'skater') &&
    Math.random() < 0.36
  ) {
    const angle = Math.atan2(agent.y - mouseY, agent.x - mouseX);
    agent.intent = 'investigate_cursor';
    agent.intentUntil = now + rand(3400, 5200);
    agent.targetX = clamp(mouseX + Math.cos(angle) * 78, 54, vw - 54);
    agent.targetY = clamp(mouseY + Math.sin(angle) * 78, 86, vh - 68);
    agent.phrase = pickRandom([
      'hello?? u still there? 👀',
      '*pokes cursor* 🧐',
      'did u fall asleep?? 🖱️👀',
    ]);
    Object.assign(
      agent,
      getMusicModeProps(agent.id, danceStyle, isPlaying, 'investigate_cursor')
    );
    return;
  }

  // 6. Inspect & comment on the current portfolio section (higher probability for Sherlock)
  const sectionChance = agent.id === 'detective' ? 0.48 : 0.22;
  if (Math.random() < sectionChance) {
    const spot = pickVisibleSpot(vw, vh);
    const comments =
      SECTION_COMMENTS[section]?.[agent.id] || SECTION_COMMENTS.hero[agent.id];
    agent.intent = 'patrol_section';
    agent.intentUntil = now + rand(3400, 5600);
    agent.scanFlipAt = now + 900;
    agent.targetX = spot.x;
    agent.targetY = spot.y;
    agent.phrase = isPlaying ? pickRandom(comments) : 'quiet reading time 📖🔍';
    Object.assign(
      agent,
      getMusicModeProps(agent.id, danceStyle, isPlaying, 'patrol_section')
    );
    return;
  }

  // 7. Varied dance showoff vs sweeping/floating organic roam (never repeats same dance move twice)
  const horizontalRun = agent.id === 'skater' && Math.random() < 0.4;
  const spot = pickVisibleSpot(vw, vh, null, isPlaying, horizontalRun);
  const doShowoff = isPlaying && Math.random() < 0.68;

  agent.intent = doShowoff ? 'showoff' : 'roam';
  agent.intentUntil = now + rand(2400, 5400);
  agent.targetX = spot.x;
  agent.targetY = spot.y;
  agent.hiding = !horizontalRun && spot.inCenter && agent.intent === 'roam' && Math.random() < 0.3;

  if (doShowoff) {
    agent.danceMove = pickNextMove(agent.id, danceStyle, agent.danceMove);
    agent.moveUntil = now + rand(2000, 4200);
    agent.phrase = MOVE_CAPTIONS[agent.danceMove] || 'vibing!! ✨';
  } else {
    agent.phrase = !isPlaying
      ? pickRandom(['waiting for beat.. 🎵', 'music paused ⏸'])
      : horizontalRun
      ? 'carving across the page!! 🛹💨'
      : pickRandom([
          'just cruising around~ ✨',
          'stretching my bones 🦴',
          'nice day on canvas! 🎨',
        ]);
  }

  Object.assign(
    agent,
    getMusicModeProps(agent.id, danceStyle, isPlaying, agent.intent)
  );
}

/**
 * Advance all 3 agents by `dt` seconds with smooth steering, social sync,
 * varied dance moves, energy updates, cursor reactions, and boundary clamping.
 */
export function stepCrewPhysics(agents, world, dt, now) {
  const list = Object.values(agents);
  const vw = Math.max(320, world.vw || 1200);
  const vh = Math.max(320, world.vh || 800);
  const minX = 44;
  const maxX = Math.max(48, vw - 44);
  const minY = 76;
  const maxY = Math.max(84, vh - 58);

  // 1. Mind updates, move repertoire switching, dialogue triggers, energy & intent transitions
  for (let i = 0; i < list.length; i++) {
    const a = list[i];

    // Deliver timed buddy reply line in chats or dance battles
    if (a.pendingReply && now >= a.pendingReply.at) {
      if (a.intent === 'chat' || a.intent === 'dance_off') {
        a.phrase = a.pendingReply.text;
        a.phraseUntil = now + 2600;
      }
      a.pendingReply = null;
    }

    // Update energy organically
    if (a.intent === 'nap') {
      a.energy = Math.min(100, a.energy + 15 * dt);
    } else if (a.intent === 'chat') {
      a.energy = Math.min(100, a.energy + 5 * dt);
    } else if (
      a.intent === 'chase' ||
      a.intent === 'flee' ||
      a.intent === 'dance_off' ||
      (world.isPlaying && world.danceStyle === 'hyper')
    ) {
      a.energy = Math.max(0, a.energy - 4.5 * dt);
    } else {
      a.energy = Math.max(0, Math.min(100, a.energy - 1.2 * dt));
    }

    if (a.intent === 'inflating' || a.intent === 'popped') {
      a.vx = 0;
      a.vy = 0;
      continue;
    }

    // Continuously switch dance moves (faster during dance_off) so skeletons don't loop one move
    if (world.isPlaying && a.intent !== 'nap' && now >= a.moveUntil) {
      if (a.intent === 'dance_off') {
        a.danceMove = pickNextMove(a.id, 'hyper', a.danceMove);
        a.moveUntil = now + 1300;
      } else {
        a.danceMove = pickNextMove(a.id, world.danceStyle, a.danceMove);
        a.moveUntil = now + rand(2000, 4200);
        if (a.intent === 'showoff' && Math.random() < 0.65) {
          a.phrase = MOVE_CAPTIONS[a.danceMove] || a.phrase;
        }
      }
    }

    // Break off chat / dance_off / chase / flee cleanly if partner was grabbed or popped
    if (
      (a.intent === 'chat' ||
        a.intent === 'dance_off' ||
        a.intent === 'chase' ||
        a.intent === 'flee') &&
      a.partnerId
    ) {
      const p = agents[a.partnerId];
      if (!p || p.intent === 'popped' || p.intent === 'inflating') {
        a.partnerId = null;
        a.pendingReply = null;
        a.intent = 'roam';
        a.intentUntil = now + rand(1200, 2200);
        const escapeSpot = pickVisibleSpot(vw, vh);
        a.targetX = escapeSpot.x;
        a.targetY = escapeSpot.y;
      }
    }

    // Playful cursor-wiggle hype reaction for Ollie or B-Boy
    const distCursor = Math.hypot(world.mouseX - a.x, world.mouseY - a.y);
    if (
      world.cursorSpeed > 950 &&
      distCursor < 210 &&
      (a.id === 'skater' || a.id === 'bboy') &&
      (a.intent === 'roam' || a.intent === 'patrol_section' || a.intent === 'showoff') &&
      !a.hiding &&
      now > a.flinchCooldownUntil
    ) {
      a.flinchCooldownUntil = now + 4500;
      a.danceMove = a.id === 'skater' ? 'spin360' : 'windmill';
      a.moveUntil = now + 2400;
      a.trick = true;
      a.phrase = pickRandom(['woah hype cursor!! 😵🔥', 'tryna race me?! ⚡']);
      a.intentUntil = Math.max(a.intentUntil, now + 2000);
    }

    // Reactive cursor flinch while investigating idle cursor
    if (
      a.intent === 'investigate_cursor' &&
      world.cursorSpeed > 260 &&
      now > a.flinchCooldownUntil
    ) {
      a.flinchCooldownUntil = now + 3500;
      const awayAngle = Math.atan2(a.y - world.mouseY, a.x - world.mouseX);
      a.intent = 'grudge_dodge';
      a.intentUntil = now + 900;
      a.targetX = clamp(a.x + Math.cos(awayAngle) * 145, minX, maxX);
      a.targetY = clamp(a.y + Math.sin(awayAngle) * 120, minY, maxY);
      a.phrase = pickRandom(['WHOA IT MOVED!! 🫣', 'EEP!! scared me!! 😱']);
      continue;
    }

    // Playful grudge dodge if popped >= 2 times & cursor approaches (never overrides active inflating)
    if (
      a.popMemory >= 2 &&
      now > a.dodgeCooldownUntil &&
      (a.intent === 'roam' || a.intent === 'patrol_section' || a.intent === 'showoff') &&
      !a.hiding &&
      distCursor >= 95 &&
      distCursor <= 155 &&
      world.cursorSpeed > 18 &&
      world.cursorSpeed < 1200
    ) {
      a.dodgeCooldownUntil = now + 7500;
      const awayAngle = Math.atan2(a.y - world.mouseY, a.x - world.mouseX);
      const jitterAngle = awayAngle + (Math.random() < 0.5 ? 0.55 : -0.55);
      a.intent = 'grudge_dodge';
      a.intentUntil = now + 850;
      a.targetX = clamp(a.x + Math.cos(jitterAngle) * 175, minX, maxX);
      a.targetY = clamp(a.y + Math.sin(jitterAngle) * 145, minY, maxY);
      a.phrase = pickRandom(['NOPE NOT AGAIN!! 🏃💨', 'NICE TRY!! 😂', 'STAY BACK!! 🦴💨']);
      a.trick = a.id === 'skater';
      continue;
    }

    // Time for a new independent decision!
    if (now >= a.intentUntil) {
      chooseNextIntent(a, agents, world, now);
    }
  }

  // 2. Tag collision check (`chase` reaches `flee`)
  for (let i = 0; i < list.length; i++) {
    const chaser = list[i];
    if (chaser.intent !== 'chase' || !chaser.partnerId) continue;
    const runner = agents[chaser.partnerId];
    if (!runner || runner.intent !== 'flee') continue;

    const d = Math.hypot(runner.x - chaser.x, runner.y - chaser.y);
    if (d < 62) {
      chaser.intent = 'roam';
      chaser.partnerId = null;
      chaser.intentUntil = now + 2200;
      chaser.phrase = 'GOTCHA!! 😂🦴';
      const s1 = pickVisibleSpot(vw, vh);
      chaser.targetX = s1.x;
      chaser.targetY = s1.y;

      runner.intent = 'roam';
      runner.partnerId = null;
      runner.intentUntil = now + 2200;
      runner.phrase = 'no fair!! u tagged me 😤';
      const s2 = pickVisibleSpot(vw, vh);
      runner.targetX = s2.x;
      runner.targetY = s2.y;
    }
  }

  // 3. Distinct Spatial Steering + Soft Separation + Integration
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (a.intent === 'inflating' || a.intent === 'popped') continue;

    let speedLimit =
      world.danceStyle === 'hyper' && world.isPlaying
        ? a.baseSpeed * 1.24
        : a.baseSpeed;
    if (a.intent === 'chase') speedLimit *= 1.18;
    if (a.intent === 'flee' || a.intent === 'grudge_dodge') speedLimit *= 1.26;
    if (a.intent === 'investigate_cursor') speedLimit *= 0.65;
    if (a.intent === 'nap') speedLimit *= 0.45;
    if (!world.isPlaying && a.intent !== 'witness_panic') speedLimit *= 0.55;

    let goalX = a.targetX;
    let goalY = a.targetY;
    let slowRadius = 110;

    if (a.intent === 'chase' && a.partnerId && agents[a.partnerId]) {
      goalX = agents[a.partnerId].x;
      goalY = agents[a.partnerId].y;
      slowRadius = 30;
    } else if (a.intent === 'flee' && a.partnerId && agents[a.partnerId]) {
      const chaser = agents[a.partnerId];
      const awayX = a.x - chaser.x;
      const awayY = a.y - chaser.y;
      const len = Math.hypot(awayX, awayY) || 1;
      const centerPullX = (vw * 0.5 - a.x) * 0.35;
      const centerPullY = (vh * 0.5 - a.y) * 0.35;
      goalX = clamp(a.x + (awayX / len) * 220 + centerPullX, minX, maxX);
      goalY = clamp(a.y + (awayY / len) * 220 + centerPullY, minY, maxY);
      slowRadius = 10;
    }

    const dx = goalX - a.x;
    const dy = goalY - a.y;
    const dist = Math.hypot(dx, dy);

    let desiredVx = 0;
    let desiredVy = 0;
    if (a.id === 'detective' && a.intent === 'patrol_section' && dist < 22) {
      // Sherlock halts and scans side to side with magnifying glass
      desiredVx = 0;
      desiredVy = 0;
      if (now >= a.scanFlipAt) {
        a.facing *= -1;
        a.scanFlipAt = now + rand(780, 1100);
      }
    } else if (dist > 6) {
      const ramp = dist < slowRadius ? dist / slowRadius : 1;
      const mag = speedLimit * ramp;
      desiredVx = (dx / dist) * mag;
      desiredVy = (dy / dist) * mag;

      // B-Boy floats along smooth wavy arcs instead of straight lines
      if (a.id === 'bboy' && a.intent !== 'nap' && dist > 28) {
        desiredVy += Math.sin(now * 0.0045) * 42;
      }
    }

    // Soft buddy separation so non-grouped buddies don't overlap
    for (let j = 0; j < list.length; j++) {
      if (i === j) continue;
      const other = list[j];
      if (other.intent === 'popped') continue;
      if (
        a.partnerId === other.id &&
        (a.intent === 'chat' || a.intent === 'dance_off' || a.intent === 'chase')
      ) {
        continue;
      }
      const sepX = a.x - other.x;
      const sepY = a.y - other.y;
      const sepD = Math.hypot(sepX, sepY);
      if (sepD > 1 && sepD < 90) {
        const push = ((90 - sepD) / 90) * 140;
        desiredVx += (sepX / sepD) * push;
        desiredVy += (sepY / sepD) * push;
      }
    }

    const steerRate = Math.min(1, dt * 5.2);
    a.vx += (desiredVx - a.vx) * steerRate;
    a.vy += (desiredVy - a.vy) * steerRate;

    a.x = clamp(a.x + a.vx * dt, minX, maxX);
    a.y = clamp(a.y + a.vy * dt, minY, maxY);

    // Facing direction based on social partner, target focus, or horizontal speed
    if (
      (a.intent === 'chat' || a.intent === 'dance_off') &&
      a.partnerId &&
      agents[a.partnerId]
    ) {
      a.facing = agents[a.partnerId].x >= a.x ? 1 : -1;
    } else if (a.intent === 'investigate_cursor' || a.intent === 'just_reassembled') {
      a.facing = world.mouseX >= a.x ? 1 : -1;
    } else if (a.intent === 'witness_panic' && a.watchX !== undefined) {
      a.facing = a.watchX >= a.x ? 1 : -1;
    } else if (Math.abs(a.vx) > 18) {
      a.facing = a.vx >= 0 ? 1 : -1;
    }
  }
}

/**
 * Notify surviving crew buddies immediately when any skeleton is popped!
 */
export function notifyBuddyPopped(agents, poppedId, popX, popY, now) {
  const poppedAgent = agents[poppedId];
  if (poppedAgent) {
    releaseAgentLink(poppedAgent, agents);
    poppedAgent.intent = 'popped';
    poppedAgent.vx = 0;
    poppedAgent.vy = 0;
    poppedAgent.napping = false;
    poppedAgent.popMemory += 1;
    poppedAgent.lastPoppedAt = now;
  }

  const poppedCount = Object.values(agents).filter((a) => a.intent === 'popped').length;
  const victimName = AGENT_LABELS[poppedId] || 'BUDDY';

  Object.values(agents).forEach((other) => {
    if (other.id === poppedId || other.intent === 'popped' || other.intent === 'inflating') {
      return;
    }
    releaseAgentLink(other, agents);

    const awayX = other.x - popX;
    const awayY = other.y - popY;
    const len = Math.hypot(awayX, awayY) || 1;

    other.intent = 'witness_panic';
    other.intentUntil = now + 2600;
    other.napping = false;
    other.hiding = false;
    other.watchX = popX;
    other.facing = popX >= other.x ? 1 : -1;
    other.targetX = other.x + (awayX / len) * 115;
    other.targetY = other.y + (awayY / len) * 90;
    other.trick = false;
    other.inspecting = other.id === 'detective';

    other.phrase =
      poppedCount >= 2
        ? 'IM THE LAST SURVIVOR!! HELP!! 😱💀'
        : pickRandom([
            `WHOA!! ${victimName} EXPLODED?! 😱🦴`,
            'NOT MY BONES NEXT!! 😰',
            `${victimName}!! UR BONES R EVERYWHERE!! 💀`,
          ]);
  });
}

/**
 * Notify a popped skeleton as its 12 bones zip back together.
 */
export function notifyBuddyReassembled(agents, id, world, now) {
  const agent = agents[id];
  if (!agent) return;

  agent.intent = 'just_reassembled';
  agent.intentUntil = now + 2200;
  agent.targetX = agent.x;
  agent.targetY = agent.y;
  agent.facing = world.mouseX >= agent.x ? 1 : -1;
  agent.napping = false;
  agent.phrase =
    agent.popMemory >= 2
      ? pickRandom(['STOP POPPING ME!! 😤👀', 'ok thats it im watching u 😤🦴'])
      : pickRandom(['HEY!! why’d u pop me?! 😤🦴', 'ouch my ribs!! 🦴']);
  Object.assign(
    agent,
    getMusicModeProps(agent.id, world.danceStyle, world.isPlaying, 'just_reassembled')
  );
}

/**
 * Let one idle buddy occasionally notice where the user clicked on the page.
 */
export function notifyUserClick(agents, clickX, clickY, now) {
  const candidates = Object.values(agents).filter(
    (a) =>
      (a.intent === 'roam' || a.intent === 'patrol_section' || a.intent === 'showoff') &&
      !a.hiding
  );
  if (!candidates.length || Math.random() > 0.35) return;

  let chosen = candidates.find((c) => c.id === 'detective');
  if (!chosen) {
    chosen = candidates.reduce((best, cur) =>
      Math.hypot(cur.x - clickX, cur.y - clickY) <
      Math.hypot(best.x - clickX, best.y - clickY)
        ? cur
        : best
    );
  }

  chosen.facing = clickX >= chosen.x ? 1 : -1;
  if (chosen.intent !== 'showoff') {
    chosen.phrase = pickRandom([
      'ooh what’d u click? 👀',
      'checking that click~ 🔍',
      'nice spot!! ✨',
    ]);
    chosen.intentUntil = Math.max(chosen.intentUntil, now + 1800);
  }
}

/**
 * Ollie surfs fast page scroll waves if available.
 */
export function notifyFastScroll(agents, danceStyle, now) {
  const skater = agents.skater;
  if (
    !skater ||
    skater.intent === 'inflating' ||
    skater.intent === 'popped' ||
    skater.intent === 'nap' ||
    skater.intent === 'witness_panic'
  ) {
    return;
  }
  skater.trick = true;
  skater.danceMove = pickNextMove('skater', danceStyle, skater.danceMove);
  skater.phrase = pickRandom(['WHOA FAST SCROLL!! 🛹💨', 'SURFING THE PAGE!! 🔥']);
  skater.intentUntil = Math.max(skater.intentUntil, now + 1400);
}

/**
 * Sync agent vibes & dance move repertoires immediately when song or play/pause changes.
 */
export function syncCrewMusicVibe(agents, danceStyle, isPlaying, now) {
  Object.values(agents).forEach((a) => {
    if (a.intent === 'popped' || a.intent === 'inflating') return;

    a.danceMove = pickNextMove(a.id, danceStyle, null);
    a.moveUntil = now + rand(1800, 3400);

    if (isPlaying && a.intent === 'nap' && a.energy > 35) {
      a.intent = 'showoff';
      a.intentUntil = now + rand(2400, 4200);
      a.napping = false;
      a.phrase = MOVE_CAPTIONS[a.danceMove] || 'vibing!! ✨';
    } else if (a.intent === 'showoff' || !isPlaying) {
      a.phrase = isPlaying
        ? MOVE_CAPTIONS[a.danceMove] || 'vibing!! ✨'
        : a.intent === 'nap'
        ? a.phrase
        : 'music paused ⏸🎵';
    }

    Object.assign(a, getMusicModeProps(a.id, danceStyle, isPlaying, a.intent));
  });
}
