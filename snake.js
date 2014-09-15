(function() {
  var Game = function() {
    console.log("game");

    var screen = document.getElementById("screen").getContext("2d");

    var body = {x: 10, y: 10}

    this.size = { x: screen.canvas.width, y: screen.canvas.height };

    var self = this;
    var tick = function(){
      self.update(body);
      self.draw(screen,body);
      requestAnimationFrame(tick);
    };

    tick();

  };

  Game.prototype = {

    update: function(body){
      body.x +=1;
      console.log("update");
    },

    draw: function(screen, body){
      screen.clearRect(0, 0, this.size.x, this.size.y);
      drawRect(screen, body)
    }
  };


  var drawRect = function(screen, body) {
    screen.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
    screen.fillRect(body.x - 10,
                    body.y - 10,
                    20,
                    20)
  };

  window.addEventListener('load', function() {
    new Game();
  });
})();