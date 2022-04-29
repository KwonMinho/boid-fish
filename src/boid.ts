import PVector from "./lib/pvector";
// todo - pvectorjs ==> vecti

const MAX_ANGLE: number = 360;
const MIN_ANGLE: number  = 0;
const CURRENT_FISH_SRC: string = './resource/blowfish.svg';


class Boid {

    position: PVector;
    velocity: PVector;
    acceleration: PVector;

    width: number;
    height: number;

    ctx: CanvasRenderingContext2D;

    private static readonly maxForce: number = 0.03; // 최대 조향력
    private static readonly maxSpeed: number = 2;  // 최대 속도

    // desiredSeparation은 neighourRadius보다 크면 안됨 (만약 크다면, 보이드는 모든 보이드를 배척하게 됨)
    private static readonly desiredSeparation: number = 25;
    private static readonly neighbourRadius: number = 50;

    

    constructor(x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D){
        const rand =  Math.random() * (MAX_ANGLE - MIN_ANGLE + 1) + MAX_ANGLE;
        const angle: number = Math.floor(rand);
        
        this.velocity = new PVector(Math.cos(angle), Math.sin(angle));
        this.position = new PVector(x, y);
        this.acceleration = new PVector(0, 0);

        this.width = width;
        this.height = height;

        this.ctx = ctx;
    }

    run(boids: Array<Boid>): void{
        this.flock(boids);
        this.update();
        this.border();
        this.render();
    }


    // Accumulate a new acceleration each time based on three rules
    flock(boids: Array<Boid>): void {
        const sep:PVector = this.sperate(boids);
        const ali:PVector = this.align(boids);
        const coh:PVector = this.cohesion(boids);

        sep.multiply(1.5);
        ali.multiply(1.0);
        coh.multiply(1.0);

        this.applyForce(sep); // 가속도에 끼칠 영향도(weight)
        this.applyForce(ali); // 가속도에 끼칠 영향도(weight)
        this.applyForce(coh); // 가속도에 끼칠 영향도(weight)
    }

    // Update position
    update(): void {
        // 속도 계산 (가속 추가)
        this.velocity.add(this.acceleration);

        // 속도 limit
        this.velocity.limit(Boid.maxSpeed);
        this.position.add(this.velocity);
        // 가속 초기화
        this.acceleration.multiply(0);
    }


    // 화면 밖에 벗어나면 반대편으로 랜더링
    border(): void {
        const r: number = 2;
        if (this.position.x < -r) this.position.x = this.width + r;
        if (this.position.y < -r) this.position.y = this.height + r;
        if (this.position.x > this.width + r) this.position.x = -r;
        if (this.position.y > this.height + r) this.position.y = -r;
    }

    render(): void {
        const fishImg: HTMLImageElement = new Image();
        fishImg.src = CURRENT_FISH_SRC;  
        this.ctx.drawImage(fishImg, this.position.x, this.position.y);
    }

    applyForce(force: PVector){
        this.acceleration.add(force);
    }
    ////////////////////////////////////////////////////////////////


    // 분리하다
    // 1. 주변 보이드들과의 거리를 검사해서
    // 2. desiredSpearation보다 가까운 보이드와 거리르 정규화해서 평균
    sperate(boids: Array<Boid>): PVector {
        let mean: PVector = new PVector();
        let count: number = 0;

        for(const other of boids){

            const distance: number = this.position.distance(other.position);

            if((distance > 0) && (distance < Boid.desiredSeparation)) {
                const diff: PVector = this.position.subtract(other.position);
                diff.normalize();
                diff.divide(distance);
                mean.add(diff);
                count++;
            }
        }

        if(count > 0){
            mean.divide(count);
        }

        // 제외해도 됨
        if (mean.magnitude() > 0){
            mean.normalize();
            mean.multiply(Boid.maxSpeed);
            mean.subtract(this.velocity);
            mean.limit(Boid.maxForce);
        }

        return mean;
    }


    // 정렬하다
    // 주변의 보이드와 같은 속도를 가지려는 특성
    // 응집과 기본 로직은 비슷
    // 단, 위치의 평균이 아니라 속도의 평균인 점이 다르다.
    align(boids: Array<Boid>): PVector {
        let mean: PVector = new PVector(0, 0);
        let count: number = 0;

        for(const other of boids){
            // 개체 간의 거리계산
            const distance: number = this.position.distance(other.position);

            if ((distance > 0) && (distance < Boid.neighbourRadius)){
                mean.add(other.velocity); // 응집과 다른점
                count++;
            }
        }

        if(count > 0){
            mean.divide(count);
            mean.normalize(); //제외가능
            mean.multiply(Boid.maxSpeed); // 정규화 (제외가능)
            let steer:PVector =  mean.subtract(this.velocity); //제외가능
            steer.limit(Boid.maxForce);
            return steer;
        }else{
            return new PVector(0, 0);
        }
    }

    // 무리를 지으려는 성질
    // 자신을 제외한 모든 보이드의 위치 평균 값 리턴
    // 보이드의 방향을 자연스럽게 틀어주는 역할 (일종의 보정)
    cohesion(boids: Array<Boid>): PVector {
        let sum: PVector = new PVector(0, 0);
        let count: number = 0;

        // 1. 개체간의 거리계산
        // 2. 개체 간의 거리가 neighbourRadius보다 작으면, sum 벡터 누적
        for(const other of boids){
            const distance: number = this.position.distance(other.position);

            if((distance > 0) && (distance < Boid.neighbourRadius)){
                sum.add(other.position);
                count++;
            }
        }

        if(count > 0){
            sum.divide(count); // sum의 평균 구하기
            return this.seek(sum);
        }else{
            return new PVector(0, 0);
        }
    }

    // 현재 위치와 갈 곳을 계산해서 보이드의 방향을 계산해주는 메서드
    seek(target: PVector): PVector {
        // 현재 위치에서 가려하는 곳을 가리키는 벡터
        let desired: PVector = target.subtract(this.position);

        if(desired.magnitude() > 0){
            desired.normalize();
            desired.multiply(Boid.maxSpeed); // 원하는 벡터의 크기를 계산

            // Steering = Desired minus Velocity
            let steer: PVector = desired.subtract(this.velocity);
            steer.limit(Boid.maxForce); // 방향 전환 정도에 제한을 둔다.
            return steer;        
        }else{
            return new PVector(0, 0);
        }
        // max speed로 조정하다
    }
}

export default Boid;