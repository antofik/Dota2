var player = function(name, socket) {
    this.name = name;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.canMove = false;
    this.maxV = 100;
    this.direction = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.hero = null;
    this.maxHealth = 100;
    this.health = this.maxHealth;

    var that = this;
    socket.on('move', function(e){        
        that.targetX = e.x;
        that.targetY = e.y;
    });
};
exports.constructor = player;

player.prototype.update = function(time) {
    this.x += this.vx * time;   
    this.y += this.vy * time;
    var dx = this.targetX - this.x;
    var dy = this.targetY - this.y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    if (!time) console.log('bad time', time);
    var maxV = Math.min(this.maxV, distance/time);
    this.vx = distance > 1 ? maxV * dx / distance : 0;
    this.vy = distance > 1 ? maxV * dy / distance : 0;
};

player.prototype.selectHero = function(hero) {
    this.hero = hero;
    this.maxV = hero.speed;
}

player.prototype.hasSelectedHero = function() {
    return !!this.hero;
};

player.prototype.toJson = function() {
    return {
        name: this.name,
        x: this.x,
        y: this.y,
        vx: this.vx,
        vy: this.vy,
        direction: this.direction, 
        health: this.health,
        maxHealth: this.maxHealth,

        //to remove
        color: this.hero.color
    };
};