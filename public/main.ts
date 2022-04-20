let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
let ctx:CanvasRenderingContext2D = canvas.getContext('2d');


canvas.width = window.innerWidth - 100;
canvas.height = window.innerWidth - 100;


ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 100, 100);


let dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};


dino.draw();