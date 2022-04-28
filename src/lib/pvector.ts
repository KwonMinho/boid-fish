
class PVector {
    x: number;
    y: number;
    z: number;

    constructor(x:number, y:number, z: number){
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(v: PVector): void {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v: PVector): PVector {
        this.x -= v.
    }

    dist(): number {

    }

    limit(): void {

    }

    multiply(): PVector{

    }

    normalize(): void {

    }

    divide(): void {

    }

}