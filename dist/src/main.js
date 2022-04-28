import Boid from "./boid.js";
import Flock from "./flock.js";
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;
var MONITOR_HZ = 144;
var timer = 0;
var flock = new Flock();
function animation() {
    requestAnimationFrame(animation);
    timer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (timer % MONITOR_HZ === 0) {
        var randomX = Math.random() * (canvas.width - 1) + canvas.width;
        var randomY = Math.random() * (canvas.height - 1) + canvas.height;
        var boid = new Boid(randomX, randomY, canvas.width, canvas.height, ctx);
        flock.addBoid(boid);
    }
    flock.run();
}
animation();
//# sourceMappingURL=main.js.map