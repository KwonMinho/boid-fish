let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
let ctx:CanvasRenderingContext2D = canvas.getContext('2d');


canvas.width = window.innerWidth - 100;
canvas.height = window.innerWidth - 100;

const MONITOR_HZ:number = 144;

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

const fish = new Image();
fish.src = './resource/blowfish.svg';
console.log(fish);

class Obstacle{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
    }

    draw(){
        ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(fish, this.x, this.y)
    }
}


let timer = 0;
let obstaclePool: Array<Obstacle> = [];

function startFrame(){
    requestAnimationFrame(startFrame);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if ( timer % 144 === 0 ) {
        obstaclePool.push(
            new Obstacle()
        );
    }

    obstaclePool.forEach((ob)=>{
        ob.x++;
        ob.draw();
    });


    dino.x++;
    dino.draw();
}

startFrame();