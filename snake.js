(function() {
  var Game = function() {

    var screen = document.getElementById("screen").getContext("2d");

    this.size = { x: screen.canvas.width, y: screen.canvas.height };
    this.bodies = [];
    this.lastSegment = new Player(this);
    this.bodies = createBlocks(this).concat(this.lastSegment);
    this.speed = 3;
    this.colorCount = 11;
    this.colorPulse = .25;

    this.active = true;

    var self = this;
    var tick = function(){
      if (self.active === true) {
        self.update();
        self.draw(screen);
      }
      requestAnimationFrame(tick);
    };

    tick();

  };

  Game.prototype = {

    update: function(){
      console.log("game is active");
      createFood(this);
      reportCollisions(this.bodies);

      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].update !== undefined) {
          this.bodies[i].update();
        }
      }
      
      if (this.colorCount < 10 || this.colorCount > 310) {
        this.colorPulse = -this.colorPulse;
      }
        this.colorCount = this.colorCount + this.colorPulse;
    },


    draw: function(screen){

      var grd = screen.createRadialGradient(200,200,5+this.colorCount,200,200,80+this.colorCount);

      grd.addColorStop(0,"red");
      grd.addColorStop(1,"yellow");

      screen.fillStyle=grd;
      screen.fillRect(0,0,this.size.x,this.size.y);

      for (var i = 0; i < this.bodies.length; i++) {
        if (this.bodies[i].draw !== undefined) {
          this.bodies[i].draw(screen);
        }
      }
    },

    addBody: function(body) {
      this.bodies.push(body);
    },

    removeBody: function(body) {
      var bodyIndex = this.bodies.indexOf(body);
      if (bodyIndex !== -1) {
        this.bodies.splice(bodyIndex, 1);
      }
    },

    gameOver: function(){
      for(i=0; i<this.game.bodies.length; i++){
        this.bodies[i] = ""
      }
    }
  };

  var Food = function(game, center) {
    this.game = game;
    this.center = center;
    this.size = { x: 12, y: 12 };
  };

  Food.prototype = {

    draw: function(screen) {
      drawRect(screen, this);
    },

    collision: function() {
      this.game.removeBody(this);
      this.game.addBody(new Tail(this.game, this.game.lastSegment));
    }
  };

  var createFood = function(game) {

    if(Math.random() > .988){

      var xf = (30 + Math.random() * (game.size.x - 60));
      var yf = (30 + Math.random() * (game.size.y - 60));

      if(isColliding)

          game.addBody(new Food(game, { x: xf, y: yf}));

        };
      
    
  };
  


  var Block = function(game, center) {
  this.game = game;
  this.size = { x: 12, y: 12 };
  this.center = center;

  };

  Block.prototype = {

    draw: function(screen) {
      drawRect(screen, this);
    },

    collision: function() {

      for(i=0; i<this.game.bodies.length; i++){
        this.game.bodies[i] = "";
        this.game.active = false;
      }

    }

  };

  var createBlocks = function(game) {
    var blocks = [];
    for (var i = 1; i < game.size.x; i++) {
      if (i % 15 === 0){
      var x = i;                          
      var y = 15;
      blocks.push(new Block(game, { x: x, y: y}));
      var y = game.size.y - 15;
      blocks.push(new Block(game, { x: x, y: y}));
      }
    }

    for (var i = 16; i < game.size.y-16; i++) {
      if (i % 15 === 0){
      var x = 15;                           //sizes and positions hard coded - would like to make this flexible
      var y = i;
      blocks.push(new Block(game, { x: x, y: y}));
      var x = game.size.y - 15;
      blocks.push(new Block(game, { x: x, y: y}));
      }
    }

    return blocks;
  };

  var Player = function(game) {

  this.follows = null;
  this.game = game;
  this.size = { x: 12, y: 12 };
  this.center = { x: this.game.size.x / 2, y: this.game.size.y / 2 };
  this.direction = "";
  this.notMoving = true;
  this.keyboarder = new Keyboarder();

  //count used to delay key inputs and prevent too-sharp turns
  this.turnCount = 0;

  };

  Player.prototype = {
    update: function() {

      //check
      this.turnCount += 1;
      if (this.turnCount > (20 / this.game.speed)){

        if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) && (this.direction != "right")) {
          this.handleKeyPress("left");
        } 
        else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) && (this.direction != "left")) {
          this.handleKeyPress("right");
        } 
        else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP) && (this.direction != "down")) {
          this.handleKeyPress("up");
        } 
        else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN) && (this.direction != "up")) {
          this.handleKeyPress("down");
        };
      };

      if (this.direction === "left") {
          this.center.x -= this.game.speed;;
      } else if (this.direction === "right") {
          this.center.x += this.game.speed;;
      } else if (this.direction === "up") {
          this.center.y -= this.game.speed;;
      } else if (this.direction === "down") {
          this.center.y += this.game.speed;;
      };
    },

    draw: function(screen) {
      drawRect(screen, this);
    },

    startPlayer: function(direction) {
      this.direction = direction;
      this.game.addBody(new Tail(this.game, this));
      this.notMoving = false;
    },

    handleKeyPress: function(direction) {
      if(this.notMoving){        
        this.startPlayer(direction);
      } else {
        this.direction = direction;
        this.turnCount = 0;
      };
    }
  };

  var Tail = function(game,body) {

    this.game = game;
    this.follows = body;
    this.size = { x: 12, y: 12 };
    this.direction = body.direction;


    if (this.game.colorPulse > 0) {

  this.game.colorPulse = this.game.colorPulse + .1;

  } else {

  this.game.colorPulse = this.game.colorPulse - .1;

  };






  if (body.direction === "right"){
    this.center = { x: body.center.x - 15 , y: body.center.y };
  } else if (body.direction === "left"){
    this.center = { x: body.center.x + 15 , y: body.center.y };
  } else if (body.direction === "up"){
    this.center = { x: body.center.x , y: body.center.y + 15};
  } else if (body.direction === "down"){
    this.center = { x: body.center.x, y: body.center.y - 15 };
  }

  this.game.lastSegment = this;



  };

  Tail.prototype = {
    update: function() {

      if (this.direction === "up"){

        if (this.center.y <= this.follows.center.y ){

          this.center.y = this.follows.center.y;
          this.direction = this.follows.direction;


        };
      };

      if (this.direction === "down"){

        if (this.center.y >= this.follows.center.y ){

          this.center.y = this.follows.center.y;
          this.direction = this.follows.direction;


        };
      };

      if (this.direction === "right"){

        if (this.center.x >= this.follows.center.x ){

          this.center.x = this.follows.center.x;
          this.direction = this.follows.direction;


        };
      };


      if (this.direction === "left"){

        if (this.center.x <= this.follows.center.x ){

          this.center.x = this.follows.center.x;
          this.direction = this.follows.direction;


        };
      };



      if (this.direction === "left") {
          this.center.x -= this.game.speed;
      } else if (this.direction === "right") {
          this.center.x += this.game.speed;
      } else if (this.direction === "up") {
          this.center.y -= this.game.speed;
      } else if (this.direction === "down") {
          this.center.y += this.game.speed;
      };


    },

    draw: function(screen) {
      drawRect(screen, this);
    },

    collision: function(body){

      if (body.follows !== undefined) {

        if (body.follows !== this && this.follows !== body){

          for(i=0; i<this.game.bodies.length; i++){

          this.game.bodies[i] = "";
          this.game.active = false;

          }


        }

      }
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

    this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32, A: 65, Z: 90};
  };


  var drawRect = function(screen, body) {
    screen.fillStyle="black";
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x,
                    body.size.y);
  };

  var isColliding = function(b1, b2) {
    return !(
      b1 === b2 ||
        b1.center.x + b1.size.x / 2 <= b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 <= b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 >= b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 >= b2.center.y + b2.size.y / 2
    );
  };



  var reportCollisions = function(bodies) {
    var bodyPairs = [];
    for (var i = 0; i < bodies.length; i++) {
      for (var j = i + 1; j < bodies.length; j++) {
        if (isColliding(bodies[i], bodies[j])) {
          bodyPairs.push([bodies[i], bodies[j]]);
        }
      }
    }

    for (var i = 0; i < bodyPairs.length; i++) {
      if (bodyPairs[i][0].collision !== undefined) {
        bodyPairs[i][0].collision(bodyPairs[i][1]);
      }

      if (bodyPairs[i][1].collision !== undefined) {
        bodyPairs[i][1].collision(bodyPairs[i][0]);
      }
    }
  };

  window.addEventListener('load', function() {
    new Game();
  });
})();