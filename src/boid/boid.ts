import BoidBehaviors from './boid_behaviors';
import { Vector } from '../lib/vector';

class Boid implements BoidBehaviors  {
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;

    private r: number;
    private maxForce: number;
    private maxSpeed: number;


    constructor (x: number, y: number){
        this.location = null;
        this.velocity = null;
    }
    
    /**
     * desiredseparation: 원하는 간격
     * 
     * 1. d = 현재 boid 객체의 좌표와 각 boid 간 거리 비교
     * 2. d > 0 && d < desiredsepartin
     *      2.1 vector <= 조건 충족할 때, 현 boid와 다른 boid 간의 벡터 거리 계산
     *      2.2 diff <- normalize()
     *      2.3 diff <- 벡터를 스칼로 나눔
    */
    separte(): void {}
    cohere(): void {}
    align(): void {}
}


export default Boid;