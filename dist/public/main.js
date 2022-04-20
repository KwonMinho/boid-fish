var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 100;
canvas.height = window.innerWidth - 100;
ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 100, 100);
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
//# sourceMappingURL=main.js.map