import PVector from 'pvectorjs';

class Boid {

    position: PVector;
    velocity: PVector;
    acceleration: PVector;
    r: number;
    maxForce: number;
    maxSpeed: number;

    constructor(x: number, y: number){

    }

    run(boids: Array<Boid>): void{
        this.flock(boids);
        this.update();
        this.border();
        //this.render();
    }


    // Accumulate a new acceleration each time based on three rules
    flock(boids: Array<Boid>): void {
        const sep:PVector = this.sperate(boids);
        const ali:PVector = this.align(boids);
        const coh:PVector = this.cohesion(boids);

        sep.mult();
        ali.mult();
        coh.mult();

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    // Update position
    update(): void {
        // 속도 계산 (가속 추가)
        this.velocity.add(this.acceleration);
        // 속도 limit
        this.velocity.maxMag(this.maxSpeed);
        
        this.position.add(this.velocity);
        
        // 가속 초기화
        this.acceleration.mult(0);
    }

    border(): void {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    seek(): PVector {}


    applyForce(force: PVector){
        this.acceleration.add(force);
    }

    ///
    sperate(boids: Array<Boid>): PVector {}
    align(boids: Array<Boid>): PVector {}
    cohesion(boids: Array<Boid>): PVector {}
    



}

export default Boid;