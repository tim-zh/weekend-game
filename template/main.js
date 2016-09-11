let game = new Phaser.Game(800, 600, Phaser.CANVAS, "game", {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.image("space", "deep-space.jpg");
  game.load.image("ship", "ship.png");
}

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
}

function update() {
}

function render() {
}

