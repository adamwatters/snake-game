(function() {
  var Game = function() {
    console.log("game");

    var screen = document.getElementById("screen").getContext("2d");


    this.size = { x: screen.canvas.width, y: screen.canvas.height };
    this.bodies = new Player(this);

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
      if (this.bodies.update !== undefined) {
          this.bodies.update(screen);
        }
    },

    draw: function(screen){
      screen.clearRect(0, 0, this.size.x, this.size.y);
      if (this.bodies.draw !== undefined) {
          this.bodies.draw(screen);
        }
    }
  };

  var Player = function(game) {
  this.game = game;
  this.size = { x: 15, y: 15 };
  this.center = { x: this.game.size.x / 2, y: this.game.size.y / 2 };
}

  Player.prototype = {
    update: function() {
        this.center.x += .5;
        return true;
      },

    draw: function(screen) {
        drawRect(screen, this);
        return true;
     }
  };


  var drawRect = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x,
                    body.size.y);
  };

  window.addEventListener('load', function() {
    new Game();
  });
})();