var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 100;
canvas.height = window.innerWidth - 100;
var MONITOR_HZ = 144;
var dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    draw: function () {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};
dino.draw();
var fish = new Image();
fish.src = './resource/blowfish.svg';
console.log(fish);
var Obstacle = /** @class */ (function () {
    function Obstacle() {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
    }
    Obstacle.prototype.draw = function () {
        ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(fish, this.x, this.y);
    };
    return Obstacle;
}());
var timer = 0;
var obstaclePool = [];
function startFrame() {
    requestAnimationFrame(startFrame);
    timer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (timer % 144 === 0) {
        obstaclePool.push(new Obstacle());
    }
    obstaclePool.forEach(function (ob) {
        ob.x++;
        ob.draw();
    });
    dino.x++;
    dino.draw();
}
startFrame();
//# sourceMappingURL=main.js.map