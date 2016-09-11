let game = new Phaser.Game(800, 600, Phaser.CANVAS, "game", {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.image("space", "deep-space.jpg");
  game.load.image("bullet", "bullets.png");
  game.load.image("ship", "ship.png");
  game.load.image("enemy", "enemy1.png");
}

let sprite;

let score;

let bullet;
let bullets;

let enemies;

let text;

let names = [];

function create() {
  game.renderer.clearBeforeRender = false;
  game.renderer.roundPixels = true;

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.add.tileSprite(0, 0, game.width, game.height, "space");

  sprite = game.add.sprite(400, 300, "ship");
  sprite.anchor.set(0.5);
  game.physics.enable(sprite, Phaser.Physics.ARCADE);
  sprite.body.drag.set(100);
  sprite.body.maxVelocity.set(200);

  score = createText("0", 10, 10, true);

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;

  let emptyText = ">_";
  text = createText(emptyText, 0, 0, true);
  text.setTextBounds(40, game.height - 100, 800, 100);
  document.body.onkeydown = event => {
    if (event.keyCode == 8 && text.text.length > 2) { //backspace
      text.text = ">" + text.text.substring(1, text.text.length - 2) + "_";
    } else if (event.keyCode == 27) { //esc
      text.text = emptyText;
    } else if (event.keyCode == 13) { //enter
      let enemy = enemies.children.filter(e => e.text.text == text.text.substring(1, text.text.length - 1))[0];
      if (enemy) {
        sprite.rotation = game.physics.arcade.angleBetween(sprite, enemy);
        for (let i = 0; i < 4; ++i)
          fireBullet();
      }
      text.text = emptyText;
    } else if (event.key.length == 1) {
      text.text = text.text.substring(0, text.text.length - 1) + event.key + "_";
    }
  };

  let time = 0;
  let interval = 2000;
  let spawned = 0;
  setInterval(() => {
    if (time > interval) {
      createEnemy();
      time -= interval;
      ++spawned;
      if (spawned % 10 == 0 && interval > 500) {
        interval -= 200;
      }
    }
    time += 100;
  }, 100);
}

function update() {
  game.physics.arcade.overlap(bullets, enemies, (b, e) => {
    bullets.remove(b);
    enemies.remove(e);
    setTimeout(() => b.destroy(), 0);
    setTimeout(() => e.destroy(), 0);
    score.text = parseInt(score.text) + e.text.text.length;
  }, null, this);
  game.physics.arcade.overlap(sprite, enemies, (s, e) => {
    location.reload();
  }, null, this);
  enemies.callAll("updateText");
}

function render() {
}

function createText(text, x, y, caption) {
  let size = caption ? "32px" : "14px";
  let textStyle = { font: size + " Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
  let newText = game.add.text(x, y, text, textStyle);
  newText.setShadow(3, 3, "#000", 0);
  return newText;
}

function fireBullet() {
  let bullet = bullets.create(sprite.body.center.x, sprite.body.center.y, "bullet");
  bullet.anchor.set(0.5);
  bullet.rotation = sprite.rotation + game.rnd.realInRange(-0.1, 0.1);
  game.physics.arcade.velocityFromRotation(bullet.rotation, 800, bullet.body.velocity);
  bullet.lifespan = 1000;
  bullets.add(bullet);
}

function createEnemy() {
  let x = Math.random() < 0.5 ? -40 : (game.width + 40);
  let y = game.rnd.between(0, game.height);
  let enemy = enemies.create(x, y, "enemy");
  enemy.anchor.set(0.5);
  enemy.rotation = game.physics.arcade.angleBetween(enemy, sprite);
  game.physics.arcade.velocityFromRotation(enemy.rotation, 80, enemy.body.velocity);
  let text = game.rnd.pick(words);
  names.push(enemy);
  enemy.text = createText(text, x, y);
  enemy.updateText = function () {
    this.text.x = this.x;
    this.text.y = this.y;
  };
  enemy.events.onDestroy.add(() => enemy.text.destroy());
}

let words = [
  "anywhere", "below", "burn", "climb",
  "able", "apartment", "bend", "bus", "close",
  "about", "appear", "beneath", "business", "clothes",
  "above", "approach", "beside", "busy", "cloud",
  "accept", "area", "best", "but", "coat",
  "across", "arm", "better", "buy", "coffee",
  "act", "around", "between", "cold",
  "actually", "arrive", "beyond", "call", "college",
  "add", "art", "big", "calm", "color",
  "admit", "bird", "camera", "come",
  "afraid", "ask", "bit", "can", "company",
  "after", "asleep", "bite", "car", "completely",
  "afternoon", "black", "card", "computer",
  "again", "attack", "block", "care", "confuse",
  "against", "attention", "blood", "careful", "consider",
  "age", "aunt", "blow", "carefully", "continue",
  "ago", "avoid", "blue", "carry", "control",
  "agree", "away", "board", "case", "conversation",
  "ahead", "baby", "boat", "cat", "cool",
  "air", "back", "body", "catch", "cop",
  "alive", "bad", "bone", "cause", "corner",
  "all", "bag", "book", "ceiling", "count",
  "allow", "ball", "boot", "center", "counter",
  "almost", "bank", "bore", "certain", "country",
  "alone", "bar", "both", "certainly", "couple",
  "along", "barely", "bother", "chair", "course",
  "already", "bathroom", "bottle", "chance", "cover",
  "also", "bottom", "change", "crazy",
  "although", "beach", "box", "check", "create",
  "always", "bear", "boy", "cheek", "creature",
  "among", "beat", "brain", "chest", "cross",
  "and", "beautiful", "branch", "child", "crowd",
  "angry", "because", "break", "choice", "cry",
  "animal", "become", "breast", "choose", "cup",
  "another", "bed", "breath", "church", "cut",
  "answer", "bedroom", "breathe", "cigarette", "dad",
  "any", "beer", "bridge", "circle", "dance",
  "anybody", "before", "bright", "city", "dark",
  "anymore", "begin", "bring", "class", "darkness",
  "anyone", "behind", "brother", "clean", "daughter",
  "anything", "believe", "brown", "clear", "day",
  "anyway", "belong", "building", "clearly", "dead",
  "death", "except", "funny", "history", "law",
  "decide", "excite", "future", "hit", "lay",
  "deep", "expect", "game", "hold", "lead",
  "desk", "explain", "garden", "hole", "leaf",
  "despite", "expression", "gate", "home", "lean",
  "die", "extra", "gather", "hope", "learn",
  "different", "eye", "gently", "horse", "leave",
  "dinner", "face", "get", "hospital", "leg",
  "direction", "fact", "gift", "hot", "less",
  "dirt", "fade", "girl", "hotel", "let",
  "disappear", "fail", "give", "hour", "letter",
  "discover", "fall", "glance", "house", "lie",
  "distance", "familiar", "glass", "how", "life",
  "family", "however", "lift",
  "doctor", "far", "god", "huge", "light",
  "dog", "fast", "gold", "human", "like",
  "door", "father", "good", "hundred", "line",
  "doorway", "fear", "grab", "hurry", "lip",
  "down", "feed", "grandfather", "hurt", "listen",
  "dozen", "feel", "grandmother", "husband", "little",
  "drag", "few", "grass", "local",
  "draw", "field", "gray", "ice", "lock",
  "dream", "fight", "great", "idea", "long",
  "dress", "figure", "green", "look",
  "drink", "fill", "ground", "ignore", "lose",
  "drive", "final", "group", "image", "lot",
  "driver", "finally", "grow", "imagine", "loud",
  "drop", "find", "guard", "immediately", "love",
  "dry", "fine", "guess", "important", "low",
  "during", "finger", "gun", "lucky",
  "dust", "finish", "guy", "information", "lunch",
  "each", "fire", "hair", "inside", "machine",
  "ear", "first", "half", "instead", "main",
  "early", "fish", "hall", "interest", "make",
  "earth", "fit", "hallway", "into", "man",
  "easily", "five", "hand", "manage",
  "east", "fix", "hang", "itself", "many",
  "easy", "flash", "happen", "jacket", "map",
  "eat", "flat", "happy", "job", "mark",
  "edge", "flight", "hard", "join", "marriage",
  "effort", "floor", "hardly", "joke", "marry",
  "egg", "flower", "hate", "jump", "matter",
  "eight", "fly", "have", "just", "may",
  "either", "follow", "keep", "maybe",
  "else", "food", "head", "key",
  "empty", "foot", "hear", "kick", "mean",
  "end", "for", "heart", "kid", "meet",
  "engine", "force", "heat", "kill", "member",
  "enjoy", "forehead", "heavy", "kind", "memory",
  "enough", "forest", "hell", "kiss", "mention",
  "enter", "forever", "hello", "kitchen", "message",
  "entire", "forget", "help", "knee", "metal",
  "especially", "form", "knife", "middle",
  "even", "forward", "here", "knock", "might",
  "event", "four", "herself", "know", "mind",
  "ever", "free", "hey", "lady", "mine",
  "every", "fresh", "land", "minute",
  "everybody", "friend", "hide", "language", "mirror",
  "everyone", "from", "high", "large", "miss",
  "everything", "front", "hill", "last", "moment",
  "everywhere", "full", "later", "money",
  "exactly", "fun", "himself", "laugh", "month",
  "moon", "our", "quickly", "send", "smile",
  "more", "out", "quiet", "sense", "smoke",
  "morning", "outside", "quietly", "serious", "snap",
  "most", "over", "quite", "seriously", "snow",
  "mostly", "own", "radio", "serve",
  "mother", "page", "rain", "service", "soft",
  "mountain", "pain", "raise", "set", "softly",
  "mouth", "paint", "rather", "settle", "soldier",
  "move", "pair", "reach", "seven", "somebody",
  "movie", "pale", "read", "several", "somehow",
  "much", "palm", "ready", "sex", "someone",
  "music", "pants", "real", "shadow", "something",
  "must", "paper", "realize", "shake", "sometimes",
  "parent", "really", "shape", "somewhere",
  "myself", "part", "reason", "share", "son",
  "name", "party", "receive", "sharp", "song",
  "narrow", "pass", "recognize", "she", "soon",
  "near", "past", "red", "sheet", "sorry",
  "nearly", "path", "refuse", "ship", "sort",
  "neck", "pause", "remain", "shirt", "soul",
  "need", "pay", "remember", "shoe", "sound",
  "neighbor", "people", "remind", "shoot", "south",
  "never", "perfect", "remove", "shop", "space",
  "new", "perhaps", "repeat", "short", "speak",
  "news", "personal", "reply", "should", "special",
  "next", "phone", "rest", "shoulder", "spend",
  "nice", "photo", "return", "shout", "spin",
  "night", "pick", "reveal", "shove", "spirit",
  "picture", "rich", "show", "spot",
  "nobody", "piece", "ride", "shower", "spread",
  "nod", "pile", "right", "shrug", "spring",
  "noise", "pink", "ring", "shut", "stage",
  "none", "place", "rise", "sick", "stair",
  "nor", "plan", "river", "side", "stand",
  "normal", "plastic", "road", "sigh", "star",
  "north", "plate", "rock", "sight", "stare",
  "nose", "play", "roll", "sign", "start",
  "not", "please", "roof", "silence", "state",
  "note", "pocket", "room", "silent", "station",
  "nothing", "point", "round", "silver", "stay",
  "notice", "police", "row", "simple", "steal",
  "now", "pool", "rub", "simply", "step",
  "number", "poor", "run", "since", "stick",
  "nurse", "pop", "rush", "sing", "still",
  "porch", "sad", "single", "stomach",
  "off", "position", "safe", "sir", "stone",
  "offer", "possible", "same", "sister", "stop",
  "office", "pour", "sand", "sit", "store",
  "officer", "power", "save", "situation", "storm",
  "often", "prepare", "say", "six", "story",
  "press", "scared", "size", "straight",
  "okay", "pretend", "scene", "skin", "strange",
  "old", "pretty", "school", "sky", "street",
  "probably", "scream", "slam", "stretch",
  "once", "problem", "screen", "sleep", "strike",
  "one", "promise", "sea", "slide", "strong",
  "only", "prove", "search", "slightly", "student",
  "onto", "pull", "seat", "slip", "study",
  "open", "push", "second", "slow", "stuff",
  "put", "see", "slowly", "stupid",
  "order", "question", "seem", "small", "such",
  "other", "quick", "sell", "smell", "suddenly",
  "suggest", "thick", "tree", "wash", "window",
  "suit", "thin", "trip", "watch", "wine",
  "summer", "thing", "trouble", "water", "wing",
  "sun", "think", "truck", "wave", "winter",
  "suppose", "third", "true", "way", "wipe",
  "sure", "thirty", "trust", "wish",
  "surface", "truth", "wear", "with",
  "surprise", "try", "wedding", "within",
  "sweet", "though", "turn", "week", "without",
  "swing", "three", "twenty", "weight", "woman",
  "system", "throat", "twice", "well", "wonder",
  "table", "through", "two", "west", "wood",
  "take", "throw", "uncle", "wet", "wooden",
  "talk", "tie", "under", "what", "word",
  "tall", "time", "understand", "whatever", "work",
  "tea", "tiny", "unless", "wheel", "world",
  "teach", "tire", "until", "when", "worry",
  "teacher", "where", "would",
  "team", "today", "upon", "whether", "wrap",
  "tear", "together", "use", "which", "write",
  "television", "tomorrow", "usual", "while", "wrong",
  "tell", "tone", "usually", "whisper", "yard",
  "ten", "tongue", "very", "white", "yeah",
  "terrible", "tonight", "view", "who", "year",
  "too", "village", "whole", "yell",
  "thank", "tooth", "visit", "whom", "yellow",
  "top", "voice", "whose", "yes",
  "toss", "wait", "why", "yet",
  "touch", "wake", "wide", "you",
  "toward", "walk", "wife", "young",
  "town", "wall", "wild", "your",
  "track", "want", "will", "yourself",
  "train", "war", "win", "travel", "warm", "wind"
];