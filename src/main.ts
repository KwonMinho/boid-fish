import Boid from "./boid.js";
import Flock from "./flock.js";

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
let ctx:CanvasRenderingContext2D = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

const MONITOR_HZ: number = 144;
let timer: number = 0;


const flock:Flock = new Flock();

function animation(){
    requestAnimationFrame(animation);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    if(timer % MONITOR_HZ === 0){
        const randomX: number = Math.random() * (canvas.width-1) + canvas.width;
        const randomY: number = Math.random() * (canvas.height-1) + canvas.height;
        const boid: Boid = new Boid(
            randomX, 
            randomY,
            canvas.width,
            canvas.height, 
            ctx
        );
        flock.addBoid(boid)
    }

    flock.run();
}

animation();
