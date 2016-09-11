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

let words = ["low", "fox", "jumper", "nose"];

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
  enemy.events.onDestroy.add(function () { enemy.text.destroy(); });
}
