import 'p2';
import 'pixi';
import 'phaser';

import AssetsLoader from '../utils/AssetsLoader';

let map;
let layer;
let player;
let hook = [];
let facing = 'left';
let jumpTimer = 0;
let cursors;
let jumpButton;
let bg;
let cursor;
let doublejump = true;
let firstJumpTimer = 0;
let mouseBody;
let newRect;
let lastRect;
let hookTimer = true;
let line;
let mouseSpring;
var drawLine = false;
let fireArrow;
let fireButton;
let left;
let right;
let angle;
let graphics;
let layerConstick;
let flagFirstStart;
let flagFirstEnd;
let flagSecondStart;
let flagSecondEnd;
let flagThirdStart;
let flagThirdEnd;
let checkPointX;
let checkPointY;
let infoButton;

let playerCollisionGroup;
let consticCollisionGroup;

let layerStone;
let layerBackground;

let backButton;

let musicJump;
let hookAttach;
let hookNoAttach;
let musicDeath;
let musicLand;
let musicFoot;


let firstJump = false;
let secondJump = false;
let hookJump = false;

let anglePlayer;


let game = {
  preload: function () {
    const assetsLoader = new AssetsLoader(game);
    assetsLoader.getAssets();
  },
  create: function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = "#4488AA";

    map = game.add.tilemap('level1');
    map.addTilesetImage('generic_deathtiles', 'tiles2');
    map.addTilesetImage('grass_main', 'tiles1');
    map.addTilesetImage('bg_cloud1', 'bg_cloud1');
    map.addTilesetImage('bg_cloud2', 'bg_cloud2');
    map.addTilesetImage('bg_cloud3', 'bg_cloud3');

    layerBackground = map.createLayer('background');
    // layerBackground.resizeWorld();

    layer = map.createLayer('grass');
    layer.resizeWorld();

    layerConstick = map.createLayer('constic');
    // layerConstick.resizeWorld();

    layerStone = map.createLayer('stone');
    // layerStone.resizeWorld();


    map.setCollisionByExclusion([], true, layer);
    map.setCollisionByExclusion([], true, layerConstick);
    map.setCollisionByExclusion([], true, layerStone);

    game.physics.p2.convertTilemap(map, layer);
    game.physics.p2.convertTilemap(map, layerConstick);
    game.physics.p2.convertTilemap(map, layerStone);

    game.physics.p2.restitution = 0;
    game.physics.p2.gravity.y = 300;

    player = game.add.sprite(300, 340, 'player');
    checkPointX = 300;
    checkPointY = 340;

    player.animations.add('left', [2, 3, 4, 5], 10, true);
    player.animations.add('jump', [0], 20, true);
    player.animations.add('right', [6, 7, 8, 9], 10, true);


    game.physics.p2.enable(player);

    player.body.fixedRotation = true;
    player.body.collideWorldBounds = true;
    game.camera.follow(player);

    cursor = game.add.sprite(game.world.centerX, game.world.centerY, 'cursor');

    cursors = game.input.keyboard.createCursorKeys();
    game.physics.p2.enable(cursor);


    cursor.body.collideWorldBounds = false;
    cursor.body.static = true;

    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.F);
    left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    infoButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
    backButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);


    this.game.canvas.style.cursor = 'none';
    line = new Phaser.Line(player.x, player.y, cursor.body.x, cursor.body.y);

    graphics = game.add.graphics(0, 0);
    game.input.onUp.add(release, this);
    game.input.addMoveCallback(move, this);

    flagFirstStart = game.add.sprite(300, 320, 'flagStart');
    flagFirstEnd = game.add.sprite(1300, 1217, 'flagEnd');
    flagSecondStart = game.add.sprite(1120, 1217, 'flagStart');
    flagSecondEnd = game.add.sprite(1730, 1730, 'flagEnd');
    flagThirdStart = game.add.sprite(2000, 1730, 'flagStart');
    flagThirdEnd = game.add.sprite(2925, 2947, 'flagEnd');

    musicJump = this.add.audio('music_jump');
    hookAttach = this.add.audio('hook_attach');
    hookNoAttach = this.add.audio('hook_noattach');
    musicDeath = this.add.audio('death');
    musicLand = this.add.audio('land');
  },
  update: function () {
    if (fireArrow) {
      changeAngle();
    }

    if (left.isDown) {
      // anglePlayer = 0;
      player.body.moveLeft(230);
      if (facing != 'left') {
        player.animations.play('left');
        facing = 'left';
      }
    } else if (right.isDown) {
      anglePlayer = 1;
      player.body.moveRight(230);
      if (facing != 'right') {
        player.animations.play('right');
        facing = 'right';
      }
    } else {
      player.body.velocity.x = 0;
      if (facing != 'idle') {
        player.animations.stop();
        if (facing == 'left') {
          player.frame = 2;
        } else {
          player.frame = 6;
        }
        facing = 'idle';
      }
    }

    if (!(checkIfCanJump()) && game.time.now < jumpTimer) {
      if (anglePlayer === 0) {
        player.frame = 0;
      }
      if (anglePlayer === 1) {
        player.frame = 1;
      }

    }

    if (jumpButton.isDown && !(checkIfCanJump()) && secondJump === true) {
      musicJump.play();
      player.body.velocity.y = -250;
      secondJump = false;
    }

    if (jumpButton.isDown && !(checkIfCanJump()) && firstJump === false && hookJump === false) {
      musicJump.play();
      player.body.velocity.y = -250;
      hookJump = true;
    }

    if ((secondJump === true || hookJump === true) && checkIfCanJump()) {
      secondJump = false;
      hookJump = false
    }

    if (jumpButton.isUp && firstJump === true) {
      secondJump = true;
      firstJump = false;
    }

    if (jumpButton.isDown && checkIfCanJump() && game.time.now > jumpTimer && firstJump === false) {
      musicJump.play();
      player.body.velocity.y = -300;
      jumpTimer = game.time.now + 750;
      firstJumpTimer = game.time.now + 200;
      firstJump = true;
    }


    if (game.input.activePointer.leftButton.isDown && hookTimer === true) {
      pushHook(player.x, player.y, cursor.x, cursor.y);
    }

    if (game.input.activePointer.leftButton.isUp && hookTimer === false) {
      hookTimer = true;
    }

    if (Math.abs(player.body.x - flagFirstEnd.x) <= 20 && Math.abs(player.body.y - flagFirstEnd.y) <= 50) {
      checkPointX = 1120;
      checkPointY = 1215;
      player.body.x = checkPointX;
      player.body.y = checkPointY;
    }

    if (Math.abs(player.body.x - flagSecondEnd.x) <= 20 && Math.abs(player.body.y - flagSecondEnd.y) <= 50) {
      checkPointX = 2000;
      checkPointY = 1740;
      player.body.x = checkPointX;
      player.body.y = checkPointY;
    }

    if (Math.abs(player.body.x - flagThirdEnd.x) <= 20 && Math.abs(player.body.y - flagThirdEnd.y) <= 50) {
      this.state.start('Win');
    }

    if (backButton.isDown) {
      // release();
      game.state.start('Menu');

    }
  },
  render: function () {
    if (drawLine) {
      graphics.kill();
    }
  },
  preRender: function () {
    if (fireArrow) {
      if (line) {
        graphics = game.add.graphics(0, 0);
        if (graphics) {
          graphics.lineStyle(4, 0x3D3D3D);
          graphics.moveTo(player.body.x - game.camera.x, player.body.y - game.camera.y);
          graphics.lineTo(fireArrow.x - game.camera.x, fireArrow.y - game.camera.y);
          graphics.endFill();
        }

      }
    }
  },
  musicOf: function () {
    menuMusic.stop();
    buttonMusicOn.kill();
    buttonMusicOff = this.add.button(750 + game.camera.x, 30 + game.camera.y, 'buttonMusicOff', this.musicOn, this);
  },
  musicOn: function () {
    menuMusic.play();
    buttonMusicOff.kill();
    buttonMusicOn = this.add.button(750 + game.camera.x, 30 + game.camera.y, 'buttonMusicOn', this.musicOf, this);
  },
}

function pushHook(playerX, playerY, cursorX, cursorY) {
  angle = 0;
  let gip = 0;
  let height = 8;
  var width = 16;
  gip = (Math.sqrt((playerX - cursorX) * (playerX - cursorX) + (playerY -
    cursorY) * (playerY - cursorY)));
  angle = ((cursorX - playerX)) / gip;
  angle = Math.acos(angle);
  angle = (angle * 180) / Math.PI;

  if (checkIfCanHook(fireArrow) === 3) {
    release();
    return;
  }

  if (cursorY < playerY) {
    angle = -angle;
  }
  if (fireArrow) {
    let hyp = 0;
    hyp = (Math.sqrt((player.x - fireArrow.x) * (player.x - fireArrow.x) + (player.y -
      fireArrow.y) * (player.y - fireArrow.y)));
    if (hyp > 250) {
      release();
      return;
    }
    if (checkIfCanHook(fireArrow)) {
      createHook(fireArrow.x, fireArrow.y)
    } else {
      fireArrow.body.velocity.x = fireArrow.body.x - playerX + (30 * Math.cos((angle * Math.PI) / 180) * 32);
      fireArrow.body.velocity.y = fireArrow.body.y - playerY + (30 * Math.sin((angle * Math.PI) / 180) * 32);
    }
  }
  else {
    let x = playerX + (1 * Math.cos((angle * Math.PI) / 180) * 64);
    let y = playerY + (1 * Math.sin((angle * Math.PI) / 180) * 64);

    fireArrow = game.add.sprite(x, y, 'hook', 1)
    game.physics.p2.enable(fireArrow);
    fireArrow.body.setRectangle(width, height);
    drawLine = true;
  }
}

function createHook(cursorX, cursorY) {
  mouseSpring = game.physics.p2.createSpring(fireArrow, player, 20, 7, 0);
  hookTimer = false;
}

function changeAngle() {
  angle = 0;
  let gip = 0;
  gip = (Math.sqrt((player.x - fireArrow.x) * (player.x - fireArrow.x) + (player.y -
    fireArrow.y) * (player.y - fireArrow.y)));
  angle = ((fireArrow.x - player.x)) / gip;
  angle = Math.acos(angle);
  angle = (angle * 180) / Math.PI;

  if (fireArrow.y < player.y) {
    angle = -angle;
  }
  fireArrow.body.angle = angle;
}

function release() {

  if (fireArrow) {
    game.physics.p2.removeSpring(mouseSpring);
    drawLine = false;
    fireArrow.kill();
    fireArrow = null;
    hookTimer = false;
  }
}


function move(pointer, x, y, isDown) {
  cursor.body.x = x + game.camera.x;
  cursor.body.y = y + game.camera.y;
}


function restart() {
  release();
  player.body.x = checkPointX;
  player.body.y = checkPointY;
}

function checkIfCanJump() {

  var yAxis = p2.vec2.fromValues(0, 1);
  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    if (c.bodyA === player.body.data || c.bodyB === player.body.data) {
      if (c.bodyA.id >= player.body.data.id - 254 && c.bodyA.id <= player.body.data.id - 42) {
        musicDeath.play();
        restart();
        return;
      }
      var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
      if (c.bodyA === player.body.data) d *= -1;
      if (d > 0.5) result = true;
    }
  }
  return result;
}


function checkIfCanHook(newRect) {

  var yAxis = p2.vec2.fromValues(0, 1);
  var result = false;
  if (!(newRect)) {
    return;
  }
  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    if (c.bodyA === newRect.body.data || c.bodyB === newRect.body.data) {

      if (c.bodyA.id >= player.body.data.id - 40 && c.bodyA.id <= player.body.data.id - 1) {
        hookNoAttach.play();
        return 3;
      }
      hookAttach.play();
      result = true;
      newRect.body.velocity.x = 0;
      newRect.body.velocity.y = 0;
      newRect.body.static = true;
    }
    if (newRect.body.data === player.body.data) {
      result = false;
    }
  }
  return result;
}



export default game;