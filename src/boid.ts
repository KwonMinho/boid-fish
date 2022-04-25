import PVector from 'pvectorjs';
import { NumberLiteralType } from 'typescript';

class Boid {

    position: PVector;
    velocity: PVector;
    acceleration: PVector;
    r: number;
    maxForce: number;
    maxSpeed: number;
    neighbordist: number;

    constructor(x: number, y: number, neighbordist: number){
        this.neighbordist = neighbordist;
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


    // 목표물에 대한 steering force towards a target
    // steer = desired minus velocity
    seek(target: PVector): PVector {
        let desired: PVector = PVector.prototype.sub(target, this.position);

        // max speed로 조정하다
        desired.norm();
        desired.mult(this.maxSpeed);

        let steer: PVector = PVector.prototype.sub(desired, this.velocity);
        steer.maxMag(this.maxForce);
        return steer;
    }


    applyForce(force: PVector){
        this.acceleration.add(force);
    }

    ///
    sperate(boids: Array<Boid>): PVector {}


    //정렬하다
    align(boids: Array<Boid>): PVector {
        let sum: PVector = new PVector(0, 0);
        let count: number = 0;

        for(const other of boids){
            // 1. 개체간의 거리계산
            const d: number = PVector.prototype.dist(this.position, other.position);

            if ((d > 0) && (d < this.neighbordist)){
                sum.add(other.velocity);
                count++;
            }
        }

        if(count > 0){
            sum.div(count);
            sum.norm();
            sum.mult(this.maxSpeed);
            let steer:PVector = PVector.sub(sum, this.velocity);
            steer.maxMag(this.maxForce);
            return steer;
        }else{
            return new PVector(0, 0);
        }
    }

    // For the average position (i.e. center) of 
    //   all nearby boids, calculate steering vector towards that position
    cohesion(boids: Array<Boid>): PVector {
        let sum: PVector = new PVector(0, 0);
        let count: number = 0;

        for(const other of boids){
            //1. 개체간의 거리계산
            const d: number = PVector.prototype.dist(this.position, other.position);

            //2. 개체 간의 거리가 neighbordist보다 작으면, sum 벡터 누적
            if( (d > 0) && (d < this.neighbordist) ){
                sum.add(other.position);
                count++;
            }
        }

        if(count > 0){
            // sum의 평균 구하기
            sum.div(count);
            return this.seek(sum);
        }else{
            return new PVector(0, 0);
        }
    }
    



}

export default Boid;