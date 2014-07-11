var player = function(name) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.maxV = 100;
    this.direction = 0;
    this.targetX = 0;
    this.targetY = 0;
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

player.prototype.toJson = function() {
    return {
        name: this.name,
        x: this.x,
        y: this.y,
        vx: this.vx,
        vy: this.vy,
        direction: this.direction
    };
};