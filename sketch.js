let player;
let diff = 1;
let points = 0;
let coins;
let zombies;
let interval;
let boom;
let dash;
let coin;
let particleSystem;

function preload() {
  boom = loadSound('assets/boom.wav');
  dash = loadSound('assets/dash.wav');
  coin = loadSound('assets/coin.wav')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  particleSystem = new ParticleSystem();
  player = new Player();
  coins = [];
  zombies = [];
  for(let i = 0; i < diff; i++) {
    zombies.push(new Zombie())
  }
  diff--;
  interval = setInterval(() => {
    zombies.push(new Zombie());
    diff++;
    coins.push(new Coin());
  },10000);
}

function draw() {
  background(0,200,55);
  player.update();
  player.show();
  for(let i = 0; i<coins.length; i++) {
    if(coins[i].collected) {
      let color = particleSystem.color(255, 204, 0);
      particleSystem.add(coins[i].x,coins[i].y,-0.75,0,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,-0.5,-0.5,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,0.75,0,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,0.5,-0.5,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,0.5,0.5,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,0,-0.75,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,0,0.75,color,12.5,1);
      particleSystem.add(coins[i].x,coins[i].y,-0.5,0.5,color,12.5,1);
      coins.splice(i,1)
    } else {
      coins[i].update(player);
      coins[i].show();
    }
  }
  for(let i = 0; i<zombies.length; i++) {
    if(zombies[i].dead) {
      let color = particleSystem.color(0,100,25);
      particleSystem.add(zombies[i].x,zombies[i].y,-0.75,0,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,-0.5,-0.5,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,0.75,0,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,0.5,-0.5,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,0.5,0.5,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,0,-0.75,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,0,0.75,color,12.5,1);
      particleSystem.add(zombies[i].x,zombies[i].y,-0.5,0.5,color,12.5,1);
      zombies.splice(i,1)
    } else {
      try {
      zombies[i].update(player, zombies);
      zombies[i].show();
      } catch {
        clearInterval(interval);
        diff+=1;
        setup()
        ;
      }
    }
  }
  particleSystem.update();
  textSize(20)
  fill(0)
  text('Difficulty: ' + diff,40,80)
  text('Points: ' + points,40,40)
}

function Player() {
  this.dashing = false;
  this.speed = 2;
  this.x = 100;
  this.y = 300;
  this.show = () => {
    stroke(0)
    fill(200,0,55);
    ellipse(this.x,this.y,50)
  }
  this.update = () => {
    if (keyIsDown(LEFT_ARROW) && this.x > 25) this.x-=this.speed;
    if (keyIsDown(RIGHT_ARROW) && this.x < (width - 25)) this.x+=this.speed;
    if (keyIsDown(UP_ARROW) && this.y > 25) this.y-=this.speed;
    if (keyIsDown(DOWN_ARROW) && this.y < (height - 25)) this.y+=this.speed;
  }
}

function Zombie() {
  this.dead = false;
  this.x = random(width);
  this.y = random(height);
  this.show = () => {
    stroke(0)
    fill(0,100,25);
    ellipse(this.x,this.y,50);
  }
  this.update = (p, z) => {
    let playerDist = dist(this.x,this.y,p.x,p.y)
    let xnz = false;
    let xpz = false;
    let ynz = false;
    let ypz = false;
    z.forEach(zombie => {
      let d = dist(this.x,this.y,zombie.x,zombie.y);
      let inRange = d < 75;
      if(this.x < zombie.x && inRange) xpz = true;
      if(this.x > zombie.x && inRange) xnz = true;
      if(this.y < zombie.y && inRange) ypz = true;
      if(this.y > zombie.y && inRange) ynz = true;
    })
    if(this.x < p.x && this.x < (width - 25) && xpz == false) this.x++;
    if(this.x > p.x && this.x > 25 && xnz == false) this.x--;
    if(this.y < p.y && this.y < (height - 25) && ypz == false) this.y++;
    if(this.y > p.y && this.y > 25 && ynz == false) this.y--;
    if(playerDist < 50) {
      boom.play();
      clearInterval(interval);
      setup();
      points--;
    }
  }
}

function Coin() {
  this.collected = false;
  this.x = random(width);
  this.y = random(height);
  this.show = () => {
    stroke(0);
    fill(255, 204, 0);
    ellipse(this.x,this.y,50);
  }
  this.update = (p) => {
    let playerDist = dist(this.x,this.y,p.x,p.y)
    if(this.x < p.x && this.x > 25) this.x-=0.5;
    if(this.x > p.x && this.x < (width - 25)) this.x+=0.5;
    if(this.y < p.y && this.y > 25) this.y-=0.5;
    if(this.y > p.y && this.y < (height - 25)) this.y+=0.5;
    if(playerDist < 50) {
      coin.play();
      points++;
      this.collected = true;
      zombies[0].dead = true;
    }
  }
}

function keyPressed() {
  if(keyCode == 32 && player.dashing == false && (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW))) {
    dash.play();
    points--;
    player.dashing = true;
    player.speed = 10;
    setTimeout(() => {
      player.dashing = false;
      player.speed = 2;
    }, 500)
  }
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight)
}

function Particle(x,y,xSpeed,ySpeed,color,size,time) {
  this.x = x;
  this.y = y;
  this.xSpeed = xSpeed;
  this.ySpeed = ySpeed;
  this.color = color;
  this.size = size;
  this.time = setTimeout(() => {
    this.removed = true;
  },(time*1000));
  this.removed = false;
  this.show = () => {
    noStroke();
    fill(this.color.r,this.color.g,this.color.b);
    ellipse(this.x,this.y, this.size);
  }
  this.update = () => {
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }
}

function ParticleSystem() {
  this.particles = [];
  this.update = () => {
  for(let i = 0; i<this.particles.length; i++) {
    particle = this.particles[i];
    if(particle.removed) {
      this.particles.splice(i,1);
    } else {
      particle.update();
      particle.show();
    }
  }
  }
  this.add = (x,y,xSpeed,ySpeed,color,size,time) => {
    this.particles.push(new Particle(x,y,xSpeed,ySpeed,color,size,time))
  }
  this.color = (r,g,b) => {
    return {r:r,g:g,b:b};
  }
}