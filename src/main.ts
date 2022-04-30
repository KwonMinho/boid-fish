




const MAX_ANGLE: number = 360;
const MIN_ANGLE: number  = 0;
const CURRENT_FISH_SRC: string = './resource/blowfish.svg';



const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

const ctx:CanvasRenderingContext2D = canvas.getContext('2d');

const MONITOR_HZ: number = 144;
let timer: number = 0;


class Boid {

    position: PVector;
    velocity: PVector;
    acceleration: PVector;


    private static readonly maxForce: number = 0.05; // 최대 조향력
    private static readonly maxSpeed: number = 3;  // 최대 속도

    // desiredSeparation은 neighourRadius보다 크면 안됨 (만약 크다면, 보이드는 모든 보이드를 배척하게 됨)
    private static readonly desiredSeparation: number = 25;
    private static readonly neighbourRadius: number = 100;

    
    constructor(x: number, y: number){
        const rand =  Math.random() * (MAX_ANGLE - MIN_ANGLE + 1) + MAX_ANGLE;
        const angle: number = Math.floor(rand);
        
        this.velocity = new PVector(Math.cos(angle), Math.sin(angle));
        this.position = new PVector(x, y);
        this.acceleration = new PVector(0, 0);
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
        if (this.position.x < -r) this.position.x = canvas.width + r;
        if (this.position.y < -r) this.position.y = canvas.height + r;
        if (this.position.x > canvas.width + r) this.position.x = -r;
        if (this.position.y > canvas.height + r) this.position.y = -r;
    }

    render(): void {
        const fishImg: HTMLImageElement = new Image();
        fishImg.src = CURRENT_FISH_SRC;  
        ctx.drawImage(fishImg, this.position.x, this.position.y);
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
            const distance: number = PVector.distance(this.position, other.position);

            if((distance > 0) && (distance < Boid.desiredSeparation)) {
                const diff: PVector = PVector.substract(this.position, other.position);
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
        let sum: PVector = new PVector(0, 0);
        let count: number = 0;

        for(const other of boids){
            // 개체 간의 거리계산
            const distance: number = PVector.distance(this.position, other.position);

            if ((distance > 0) && (distance < Boid.neighbourRadius)){
                sum.add(other.velocity); // 응집과 다른점
                count++;
            }
        }

        if(count > 0){
            sum.divide(count);
            sum.normalize();
            sum.multiply(Boid.maxSpeed);
            let steer:PVector = PVector.substract(sum, this.velocity);
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
            const distance: number = PVector.distance(this.position, other.position);

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
        let desired: PVector = PVector.substract(target, this.position);

        if(desired.magnitude() > 0){
            desired.normalize();
            desired.multiply(Boid.maxSpeed); // 원하는 벡터의 크기를 계산

            // Steering = Desired minus Velocity
            let steer: PVector = PVector.substract(desired,this.velocity);
            steer.limit(Boid.maxForce); // 방향 전환 정도에 제한을 둔다.
            return steer;        
        }else{
            return new PVector(0, 0);
        }
        // max speed로 조정하다
    }
}


class Flock {
    boids: Array<Boid>

    constructor() {
        this.boids = new Array<Boid>();
    }

    run(): void {
        this.boids.forEach((boid)=>{
            boid.run(this.boids);
        })
    }

    addBoid(boid: Boid): void {
        this.boids.push(boid);
    }

}


class PVector {
    x: number;
    y: number;
    z: number;

    constructor(x:number|void, y:number|void, z: number|void){
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(vec_or_scal: PVector|number): PVector {
        this.addX(vec_or_scal);
        this.addY(vec_or_scal);
        return this;
    }

    addX(vec_or_scal: PVector|number): PVector {
        if (typeof vec_or_scal === 'number') this.x += vec_or_scal
        else this.x += vec_or_scal.x
        return this
    }

    addY(vec_or_scal: PVector|number): PVector {
        if (typeof vec_or_scal === 'number') this.y += vec_or_scal
        else this.y += vec_or_scal.y
        return this
    }

    addZ(vec_or_scal: PVector|number): PVector {
        if (typeof vec_or_scal === 'number') this.z += vec_or_scal
        else this.z += vec_or_scal.z
        return this
    }

    static substract(v1: PVector| number, v2: PVector|number){
        const result: PVector = new PVector();
        result.add(v1);
        result.subtract(v2);
        return result;
    }


    subtract(vec_or_scal: PVector|number): PVector {
        this.subtractX(vec_or_scal);
        this.subtractY(vec_or_scal);
        this.subtractZ(vec_or_scal);
        return this;
    }
    
    subtractX(vec_or_scal: PVector|number): PVector  {
        if (typeof vec_or_scal === 'number') this.x -= vec_or_scal
        else this.x -= vec_or_scal.x
        return this
    }

    subtractY(vec_or_scal: PVector|number): PVector  {
        if (typeof vec_or_scal === 'number') this.y -= vec_or_scal
        else this.y -= vec_or_scal.y
        return this
    }

    subtractZ(vec_or_scal: PVector|number): PVector  {
        if (typeof vec_or_scal === 'number') this.z -= vec_or_scal
        else this.z -= vec_or_scal.z
        return this
    }

    static distance(vec: PVector, vec2: PVector): number {
        return Math.sqrt(
            PVector.distanceX(vec, vec2) ** 2 +
            PVector.distanceY(vec, vec2) ** 2 +
            PVector.distanceZ(vec, vec2) ** 2 
        );
    }

    static distanceX(vec: PVector, vec2: PVector): number {
        return vec.x - vec2.x
    }

    static distanceY(vec: PVector, vec2: PVector): number {
        return vec.y - vec2.y
    }

    static distanceZ(vec: PVector, vec2: PVector): number {
        return vec.z - vec2.z
    }


    limit(high: number): PVector|void {
        if (this.magnitude() > high){
            this.normalize();
            return this.multiply(high);
        }
    }

    magnitude(): number{
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): PVector{
        const m: number = this.magnitude();
        if(m > 0)  this.divide(Math.sqrt(m));
        return this
    }

    divide(vec_or_scal: PVector | number): PVector {
        this.divideX(vec_or_scal);
        this.divideY(vec_or_scal);
        this.divideZ(vec_or_scal);
        return this;
    }

    divideX(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.x /= vec_or_scal;
        else this.x /= vec_or_scal.x;
        return this;
    }


    divideY(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.y /= vec_or_scal;
        else this.y /= vec_or_scal.y;
        return this;
    }


    divideZ(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.z /= vec_or_scal
        else this.z /= vec_or_scal.z
        return this
    }


    multiply(vec_or_scal: PVector | number): PVector{
        this.multiplyX(vec_or_scal);
        this.multiplyY(vec_or_scal);
        this.multiplyZ(vec_or_scal);
        return this;
    }

    multiplyX(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.x *= vec_or_scal;
        else this.x *= vec_or_scal.x;
        return this;
    }
    multiplyY(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.y *= vec_or_scal;
        else this.y *= vec_or_scal.y;
        return this;
    }
    multiplyZ(vec_or_scal: PVector | number): PVector {
        if (typeof vec_or_scal === 'number') this.z *= vec_or_scal;
        else this.z *= vec_or_scal.z;
        return this;
    }
}

/*******************/



const flock:Flock = new Flock();


for(let i=0; i<20; i ++){
    const randomX: number = ((Math.random() * (canvas.width-0)) + canvas.width) % canvas.width;
    const randomY: number = ((Math.random() * (canvas.height-0)) + canvas.height) % canvas.height;

    const boid: Boid = new Boid(
        randomX, 
        randomY
    );
    flock.addBoid(boid)
}

function animation(){
    requestAnimationFrame(animation);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    // if(timer % MONITOR_HZ === 0){
    //     const randomX: number = ((Math.random() * (canvas.width-0)) + canvas.width) % canvas.width;
    //     const randomY: number = ((Math.random() * (canvas.height-0)) + canvas.height) % canvas.height;
    //     const boid: Boid = new Boid(
    //         randomX, 
    //         randomY,
    //         canvas.width,
    //         canvas.height, 
    //         ctx
    //     );
    //     flock.addBoid(boid)
    // }

    flock.run();
}

animation();
