import Boid from "./boid";

class Flock {
    boids: Array<Boid>

    constructor() {
        this.boids = new Array<Boid>();
    }

    run(): void {
        this.boids.forEach((boid)=>{
            boid.run();
        })
    }

    addBoid(boid: Boid): void {
        this.boids.push(boid);
    }

}

export default Flock;