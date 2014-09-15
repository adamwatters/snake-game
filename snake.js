(function() {
  var Game = function() {
    console.log("game");

    var screen = document.getElementById("screen").getContext("2d");

    this.size = { x: screen.canvas.width, y: screen.canvas.height };
    this.bodies = createBlocks(this).concat(new Player(this));

    var self = this;
    var tick = function(){
      self.update();
      self.draw(screen);
      requestAnimationFrame(tick);
    };

    tick();

  };

  Game.prototype = {

    update: function(){
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].update !== undefined) {
          this.bodies[i].update();
        }
      }
    },

    draw: function(screen){
      screen.fillStyle="#99FF66";
      screen.fillRect(0,0,this.size.x,this.size.y);
      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].draw !== undefined) {
          this.bodies[i].draw(screen);
        }
      }
    }
  };

  var Block = function(game, center) {
  this.game = game;
  this.size = { x: 13, y: 13 };
  this.center = center;

  };

  Block.prototype = {
    update: function(screen) {

      return true;

    },

    draw: function(screen) {
      drawRect(screen, this);
    }
  };

  var createBlocks = function(game) {
    var blocks = [];
    for (var i = 0; i < 24; i++) {
      var x = 35 + (i % 8) * 30;
      var y = 35 + (i % 3) * 30;
      blocks.push(new Block(game, { x: x, y: y}));
    }

    return blocks;
  };

  var Player = function(game) {
  this.game = game;
  this.size = { x: 15, y: 15 };
  this.center = { x: this.game.size.x / 2, y: this.game.size.y / 2 };
  this.direction = {l: false, r: false, u: false, d: false};
  this.keyboarder = new Keyboarder();

  };

  Player.prototype = {
    update: function(screen) {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
          this.direction.l = true;
          this.direction.r = false;
          this.direction.u = false;
          this.direction.d = false;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
          this.direction.l = false;
          this.direction.r = true;
          this.direction.u = false;
          this.direction.d = false;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
          this.direction.l = false;
          this.direction.r = false;
          this.direction.u = true;
          this.direction.d = false;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
          this.direction.l = false;
          this.direction.r = false;
          this.direction.u = false;
          this.direction.d = true;
      }

      if (this.direction.l === true) {
          this.center.x -= 2;
      } else if (this.direction.r === true) {
          this.center.x += 2;
      } else if (this.direction.u === true) {
          this.center.y -= 2;
      } else if (this.direction.d === true) {
          this.center.y += 2;
      }


    },

    draw: function(screen) {
      drawRect(screen, this);
    }
  };


  var Keyboarder = function() {
    var keyState = {};
    window.addEventListener('keydown', function(e) {
      keyState[e.keyCode] = true;
    });

    window.addEventListener('keyup', function(e) {
      keyState[e.keyCode] = false;
    });

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40};
  };


  var drawRect = function(screen, body) {
    screen.fillStyle="black";
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x,
                    body.size.y);
  };

  window.addEventListener('load', function() {
    new Game();
  });
})();